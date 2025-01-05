import { BigQuery } from "@google-cloud/bigquery"

const bigQueryClient = new BigQuery({
  credentials: {
    private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
    client_email: process.env.GOOGLE_CLIENT_EMAIL,
    project_id: process.env.GOOGLE_PROJECT_ID,
  },
})

export const readTotalPostsByDate = async (date: string) => {
  // Query de BigQuery
  const query = `
      SELECT COUNT(*)
      FROM 
        \`lens-public-data.v2_polygon.publication_record\` pr
      LEFT JOIN 
        \`lens-public-data.v2_polygon.publication_metadata\` pm
      ON 
        pr.publication_id = pm.publication_id
      LEFT JOIN (
        SELECT profile_id, COUNT(DISTINCT profile_follower_id) AS follower_count
        FROM \`lens-public-data.v2_polygon.profile_follower\`
        GROUP BY profile_id
      ) followers ON pr.profile_id = followers.profile_id
      WHERE 
        pr.content_uri IS NOT NULL
        AND pr.profile_id != "0x027290"
        AND pm.content IS NOT NULL
        AND is_hidden = false
        AND pr.publication_type = "POST"
        AND pm.language IN ("en", "es") 
        AND LENGTH(pm.content) > 24
        AND pr.app IN ("orb")
        AND DATE(TIMESTAMP(pm.timestamp)) = "${date}"
        AND follower_count >= 24`

  // AND pm.main_content_focus = "TEXT_ONLY"
  //
  const [rows] = await bigQueryClient.query({ query })
  console.log("🟢 BigQuery results:", rows)

  const totalPosts = rows[0].f0_

  return totalPosts
}

export const fetchPublications = async ({
  date,
  start,
  end,
}: {
  date: string
  start: number
  end: number
}) => {
  const batchSize = end - start

  // Query de BigQuery con LIMIT y OFFSET pa pillar trozos de 100
  const query = `
      SELECT 
        pr.publication_id,
        pm.content,
        pm.language,
        pr.profile_id,
        pr.app,
        follower_count
      FROM \`lens-public-data.v2_polygon.publication_record\` pr
      LEFT JOIN \`lens-public-data.v2_polygon.publication_metadata\` pm
        ON pr.publication_id = pm.publication_id
      LEFT JOIN (
        SELECT profile_id, COUNT(DISTINCT profile_follower_id) AS follower_count
        FROM \`lens-public-data.v2_polygon.profile_follower\`
        GROUP BY profile_id
      ) followers ON pr.profile_id = followers.profile_id
      WHERE 
        pr.content_uri IS NOT NULL
        AND pr.profile_id != "0x027290"
        AND pm.content IS NOT NULL
        AND is_hidden = false
        AND pr.publication_type = "POST"
        AND pm.language IN ("en", "es")
        AND LENGTH(pm.content) > 24
        AND pr.app IN ("orb")
        AND DATE(TIMESTAMP(pm.timestamp)) = "${date}"
        AND follower_count >= 24
      ORDER BY pm.timestamp ASC
      LIMIT ${batchSize}
      OFFSET ${start}`

  // console.log(
  //   `🟢 Fetching publications from ${start} to ${end - 1} pa la fecha: ${date}`
  // )

  const [rows] = await bigQueryClient.query({ query })

  // Aquí tienes el batch de publicaciones
  return rows
}

export const getWalletAddressFromUserId = async (
  userId: string
): Promise<string | false> => {
  const theQuery = `SELECT owned_by FROM \`lens-public-data.v2_polygon.profile_record\`
WHERE profile_id = '${userId}'; `

  const [rows] = await bigQueryClient.query({ query: theQuery })

  if (rows.length === 0) {
    return false
  }

  return rows[0].owned_by
}

export const getProfileIdFromAddress = async (address: string) => {
  const theQuery = `SELECT profile_id FROM \`lens-public-data.v2_polygon.profile_record\`
WHERE owned_by = '${address}';`

  console.log("🟢 BigQuery query:", theQuery)

  const [rows] = await bigQueryClient.query({ query: theQuery })

  return rows[0].profile_id
}

export const getProfileDataByProfileId = async (profileId: string) => {
  const theQuery = `SELECT name, bio, metadata_uri FROM \`lens-public-data.v2_polygon.profile_metadata\`
WHERE profile_id = '${profileId}'; `

  console.log("🟢 BigQuery query getProfileDataByProfileId:", theQuery)

  const [rows] = await bigQueryClient.query({ query: theQuery })

  return rows[0]

  // example URL for ipfs IDs: https://ipfs.io/ipfs/bafybeig2dlnq2hqcmq6vg3qugc5lythwkpskqexc3o3xjnrixnm5ve7is4
}

export const getProfileHandleByWalletAddress = async (address: string) => {
  console.log("🟢 getProfileHandleByWalletAddress....!!!!!", address)

  const theQuery = `SELECT handle FROM \`lens-public-data.v2_polygon.namespace_handle\`
WHERE owned_by = '${address}'; `

  const [rows] = await bigQueryClient.query({ query: theQuery })

  return rows[0]?.handle
}

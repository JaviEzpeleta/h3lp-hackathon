/*
* * * * * * * * * * 
* Table Definitions: 
* * * * * * * * * * 


CREATE TABLE h3lp_profiles (
  id TEXT PRIMARY KEY,
  address TEXT NOT NULL,
  handle TEXT NOT NULL,
  display_name TEXT NOT NULL,
  profile_picture TEXT,
  cover_picture TEXT,
  bio TEXT,
  facts TEXT[] NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE h3lp_ideas (
    id SERIAL PRIMARY KEY,
    from_handle TEXT NOT NULL,
    to_handle TEXT NOT NULL,
    products_and_services TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE h3lp_products (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  price TEXT NOT NULL,
  deadline INTEGER NOT NULL,
  created_by TEXT NOT NULL,
  inspired_by_publication_ids TEXT[] NOT NULL,
  offered_by TEXT NOT NULL,
  targeted_to TEXT NOT NULL,
  tx_hash TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE h3lp_purchases (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id INTEGER NOT NULL,
  address TEXT NOT NULL,
  amount TEXT NOT NULL,
  purchase_tx_hash TEXT NOT NULL,
  status TEXT NOT NULL, // pending, completed, failed
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
);

*/

const { Pool, types } = require("pg")

export interface ImageEmbedding {
  original_name: string
  description: string
  url: string
  embedding: number[]
}

// Parse numeric types as floats
types.setTypeParser(1700, function (val: any) {
  return parseFloat(val)
})

// Parse BIGINT as numbers
types.setTypeParser(20, function (val: any) {
  return parseInt(val, 10)
})

// Create a single pool instance outside of the function
const pool = new Pool({
  connectionString: process.env.SUPABASE_DB_URL || "",
  ssl: {
    rejectUnauthorized: false,
  },
})

import { BLOCK_EXPLORER_URL } from "./constants"
import { postErrorToDiscord, postToDiscord } from "./discord"
import { LensSavedProfile } from "./types"

export const executeQuery = async (query: string, params: Array<any> = []) => {
  // console.log(" 🐗 🐗 🐗 🐗 POSGRES CALL")

  const currentTime = new Date().getTime()

  try {
    const res = await pool.query(query, params)

    const timeDiff = new Date().getTime() - currentTime
    const timeDiffInSeconds = timeDiff / 1000

    // console.log(" 🐗 🐗 🐗 🐗 POSTGRES CALL FINISHED in " + timeDiffInSeconds)

    return res
  } catch (error: any) {
    console.error(
      "🔴🔴🔴🔴 Error executing query (`executeQuery`)",
      error.stack
    )
    await postToDiscord(
      "Error executing query (lib/postgres at executeQuery) " +
        JSON.stringify(params) +
        " " +
        query.substring(0, 100)
    )
    throw error // Re-throwing the error is optional depending on how you want to handle errors
  }
}

// Optionally, handle pool shutdown properly, for example on process exit
process.on("exit", () => {
  pool.end(() => {
    // console.log("Pool has ended")
  })
})

export const getSavedProfileByAddress = async (address: string) => {
  const res = await executeQuery(
    `SELECT * FROM h3lp_profiles WHERE address = $1`,
    [address]
  )
  return res.rows[0]
}

export const getSavedProfileByHandle = async (
  handle: string
): Promise<LensSavedProfile | null> => {
  if (!handle.startsWith("lens/")) {
    handle = "lens/" + handle
  }

  const res = await executeQuery(
    `SELECT * FROM h3lp_profiles WHERE handle = $1`,
    [handle]
  )
  return res.rows[0] || null
}

export const createProduct = async ({
  name,
  description,
  price,
  deadline,
  created_by,
  inspired_by_publication_ids,
  offered_by,
  targeted_to,
}: {
  name: string
  description: string
  price: string
  deadline: number
  created_by: string
  inspired_by_publication_ids: string[]
  offered_by: string
  targeted_to: string
}) => {
  try {
    const res = await executeQuery(
      `INSERT INTO h3lp_products (name, description, price, deadline, created_by, inspired_by_publication_ids, offered_by, targeted_to) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8) 
       RETURNING id`,
      [
        name,
        description,
        price,
        deadline,
        created_by,
        inspired_by_publication_ids,
        offered_by,
        targeted_to,
      ]
    )
    return res.rows[0].id
  } catch (error) {
    console.error("🔴 Error in createProduct:", error)
    return false
  }
}

export const getAllProducts = async () => {
  const res = await executeQuery(
    `SELECT * FROM h3lp_products
      WHERE tx_hash IS NOT NULL
      ORDER BY created_at DESC
      LIMIT 50`
  )
  return res.rows
}

export const getProductById = async (id: string) => {
  const res = await executeQuery(`SELECT * FROM h3lp_products WHERE id = $1`, [
    id,
  ])
  return res.rows[0]
}

export const updateProductTxHashById = async ({
  id,
  txHash,
}: {
  id: string
  txHash: string
}) => {
  const res = await executeQuery(
    `UPDATE h3lp_products SET tx_hash = $2 WHERE id = $1`,
    [id, txHash]
  )
  return res.rows
}

export const getLensProfileByAddress = async (address: string) => {
  const res = await executeQuery(
    `SELECT * FROM h3lp_profiles WHERE address = $1`,
    [address]
  )
  return res.rows[0]
}

export const saveLensProfileObject = async (profile: LensSavedProfile) => {
  try {
    const res = await executeQuery(
      `INSERT INTO h3lp_profiles (id, address, handle, display_name, profile_picture, cover_picture, bio, facts) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
      [
        profile.id,
        profile.address,
        profile.handle,
        profile.display_name,
        profile.profile_picture,
        profile.cover_picture,
        profile.bio,
        profile.facts,
      ]
    )
    await postToDiscord(`🐣 New Lens Profile saved: ${profile.handle}`)
    return res.rows
  } catch (error) {
    console.error("🔴 Error in saveLensProfileObject:", error)
    await postErrorToDiscord(
      "🔴 Error in saveLensProfileObject: " + JSON.stringify(profile)
    )
    return false
  }
}

export const saveProductsAndServicesToIdeasTable = async ({
  from,
  to,
  productsAndServices,
}: {
  from: string
  to: string
  productsAndServices: any[]
}) => {
  const res = await executeQuery(
    `INSERT INTO h3lp_ideas (from_handle, to_handle, products_and_services) VALUES ($1, $2, $3)`,
    [from, to, JSON.stringify(productsAndServices)]
  )
  return res.rows
}

export const findIdeasFromHandleToHandle = async (from: string, to: string) => {
  const res = await executeQuery(
    `SELECT * FROM h3lp_ideas WHERE from_handle = $1 AND to_handle = $2`,
    [from, to]
  )
  return res.rows
}

export const getRecentProducts = async () => {
  const res = await executeQuery(
    `SELECT * FROM h3lp_products ORDER BY created_at DESC LIMIT 10`
  )

  const rows = res.rows

  if (rows.length === 0) return []

  for (const row of rows) {
    row.creator = await getLensProfileByAddress(row.created_by)
  }

  return rows
}

export const saveProductPurchase = async ({
  product_id: productId,
  address,
  amount,
  purchase_tx_hash,
  status,
}: {
  product_id: string
  address: string
  amount: string
  purchase_tx_hash: string
  status: string
}) => {
  try {
    const res = await executeQuery(
      `INSERT INTO h3lp_purchases (product_id, address, amount, purchase_tx_hash, status) VALUES ($1, $2, $3, $4, $5)`,
      [productId, address, amount, purchase_tx_hash, status]
    )
    await postToDiscord(
      `🐣 New Product Purchase saved: ${productId} ${BLOCK_EXPLORER_URL}/tx/${purchase_tx_hash}`
    )
    return res.rows
  } catch (error) {
    console.error("🔴 Error in saveProductPurchase:", error)
    await postErrorToDiscord(
      "🔴 Error in saveProductPurchase: " +
        JSON.stringify({
          productId,
          address,
          amount,
          purchase_tx_hash,
          status,
        })
    )
    return false
  }
}

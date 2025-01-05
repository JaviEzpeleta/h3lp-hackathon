import {
  S3Client,
  PutObjectCommand,
  ListObjectsV2Command,
  DeleteObjectCommand,
} from "@aws-sdk/client-s3"

const s3Client = new S3Client({
  region: process.env.AWS_S3_BUCKET_REGION || "us-east-1",
  credentials:
    process.env.AWS_S3_ACCESS_KEY_ID && process.env.AWS_S3_SECRET_ACCESS_KEY
      ? {
          accessKeyId: process.env.AWS_S3_ACCESS_KEY_ID,
          secretAccessKey: process.env.AWS_S3_SECRET_ACCESS_KEY,
        }
      : undefined,
})

// Check if bucket name is provided
if (!process.env.AWS_S3_BUCKET_NAME) {
  throw new Error("AWS_S3_BUCKET_NAME is not set in environment variables")
}

export async function saveJsonToS3(
  data: any,
  folder: string,
  namePrefix: string
) {
  const fileName = `${namePrefix}.json`
  try {
    await s3Client.send(
      new PutObjectCommand({
        Bucket: process.env.AWS_S3_BUCKET_NAME,
        Key: `${folder}/${fileName}`,
        Body: JSON.stringify(data),
        ContentType: "application/json",
      })
    )
    const uploadedJSON = `https://${process.env.AWS_S3_BUCKET_NAME}.s3.${process.env.AWS_S3_BUCKET_REGION}.amazonaws.com/${folder}/${fileName}`
    return uploadedJSON
  } catch (error) {
    console.error("Error saving to S3:", error)
    throw error
  }
}

export async function listFilesInFolder(): Promise<string[]> {
  const bucketName = process.env.AWS_S3_BUCKET_NAME

  const fileKeys: string[] = []
  let continuationToken: string | undefined = undefined
  const folderPath = "company-cards"

  do {
    try {
      const command: ListObjectsV2Command = new ListObjectsV2Command({
        Bucket: bucketName,
        Prefix: folderPath, // Filter objects within the folder
        ContinuationToken: continuationToken, // Handle pagination
      })

      const response = await s3Client.send(command)

      if (response.Contents) {
        fileKeys.push(...response.Contents.map((item) => item.Key!))
      }

      continuationToken = response.NextContinuationToken
    } catch (error) {
      console.error(`Error listing files: ${error}`)
      throw error
    }
  } while (continuationToken)

  return fileKeys
}

export async function deleteFileFromS3(filePath: string) {
  try {
    await s3Client.send(
      new DeleteObjectCommand({
        Bucket: process.env.AWS_S3_BUCKET_NAME,
        Key: filePath,
      })
    )
    console.log(`File ${filePath} deleted successfully.`)
  } catch (error) {
    console.error(`Error deleting file: ${error}`)
    throw error
  }
}

export async function uploadFileToS3(
  file: File | Buffer,
  folder: string = "",
  customFilename?: string
) {
  try {
    const buffer =
      file instanceof File ? Buffer.from(await file.arrayBuffer()) : file

    const filename =
      customFilename ||
      (file instanceof File
        ? `${Date.now()}-${file.name}`
        : `${Date.now()}-upload`)

    const key = folder ? `${folder}/${filename}` : filename

    await s3Client.send(
      new PutObjectCommand({
        Bucket: process.env.AWS_S3_BUCKET_NAME!,
        Key: key,
        Body: buffer,
        ContentType:
          file instanceof File ? file.type : "application/octet-stream",
      })
    )

    return `https://${process.env.AWS_S3_BUCKET_NAME}.s3.${process.env.AWS_S3_BUCKET_REGION}.amazonaws.com/${key}`
  } catch (error) {
    console.error("Error uploading to S3:", error)
    throw error
  }
}

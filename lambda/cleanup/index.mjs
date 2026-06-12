// Daily cleanup: empties and deletes resume-preview-* buckets older than 2 days.
// (A bucket lifecycle rule can expire OBJECTS but never deletes the bucket itself,
//  so this Lambda does the bucket-level deletion.) Triggered by EventBridge daily.

import {
  S3Client,
  ListBucketsCommand,
  ListObjectsV2Command,
  DeleteObjectsCommand,
  DeleteBucketCommand,
} from "@aws-sdk/client-s3"

const s3 = new S3Client({ region: "af-south-1" })
const MAX_AGE_MS = 2 * 24 * 60 * 60 * 1000 // 2 days

export const handler = async () => {
  const { Buckets = [] } = await s3.send(new ListBucketsCommand({}))
  const now = Date.now()
  const targets = Buckets.filter(
    (b) =>
      b.Name?.startsWith("resume-preview-") &&
      b.CreationDate &&
      now - new Date(b.CreationDate).getTime() > MAX_AGE_MS,
  )

  const deleted = []
  for (const b of targets) {
    const Bucket = b.Name
    try {
      // Empty the bucket (handle pagination).
      let token
      do {
        const list = await s3.send(
          new ListObjectsV2Command({ Bucket, ContinuationToken: token }),
        )
        if (list.Contents?.length) {
          await s3.send(
            new DeleteObjectsCommand({
              Bucket,
              Delete: { Objects: list.Contents.map((o) => ({ Key: o.Key })) },
            }),
          )
        }
        token = list.IsTruncated ? list.NextContinuationToken : undefined
      } while (token)

      await s3.send(new DeleteBucketCommand({ Bucket }))
      deleted.push(Bucket)
      console.log("deleted", Bucket)
    } catch (err) {
      console.error("failed to delete", Bucket, err?.message)
    }
  }

  console.log(`cleanup complete — deleted ${deleted.length} bucket(s)`, deleted)
  return { deleted }
}

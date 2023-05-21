import { Bucket, StackContext } from "sst/constructs"

const commonPermissions = [
  "s3:GetObject",
  "ssm:GetParameter",
  "secretsmanager:GetSecretValue",
  "ses:DeleteTemplate",
  "ses:CreateTemplate",
  "ses:SendTemplatedEmail",
]

export function BucketStack({ stack }: StackContext) {

  /**
   * When markdown file is uploaded, those notifications run and 
   * create & upload SES email template from the md file uploaded.
   * At 21:00 UTC, Cron job checks if there's SES email template 
   * with a target date suffix. If so, send it to subscribers.
   */
  

  /** 
   * Category: Tech
  */
  const techMdBucket 
    = new Bucket(stack, "TechMdBucket")

  techMdBucket.addNotifications(stack, {
    dailyTechMarkdownUploadedNotification: {
      function: {
        handler: 
          "packages/functions/daily/generateDailyEmailTemplate.handler",
        environment: { 
          MD_BUCKET_NAME: techMdBucket.bucketName,
          BUCKET_CATEGORY: "tech",
        },
      },
      events: ["object_created"],
    },
  })
  techMdBucket.attachPermissionsToNotification(
    "dailyTechMarkdownUploadedNotification", 
    commonPermissions
  )

  /** 
   * Category: Web
  */
  const webMdBucket = new Bucket(stack, "WebMdBucket")

  webMdBucket.addNotifications(stack, {
    dailyWebMarkdownUploadedNotification: {
      function: {
        handler: 
          "packages/functions/daily/generateDailyEmailTemplate.handler",
        environment: { 
          MD_BUCKET_NAME: webMdBucket.bucketName,
          BUCKET_CATEGORY: "web",
        },
      },
      events: ["object_created"],
    },
  })
  webMdBucket.attachPermissionsToNotification(
    "dailyWebMarkdownUploadedNotification", 
    commonPermissions
  )

  /** 
   * Category: AI
  */
  const aiMdBucket = new Bucket(stack, "AiMdBucket")

  aiMdBucket.addNotifications(stack, {
    dailyAiMarkdownUploadedNotification: {
      function: {
        handler: 
          "packages/functions/daily/generateDailyEmailTemplate.handler",
        environment: { 
          MD_BUCKET_NAME: aiMdBucket.bucketName,
          BUCKET_CATEGORY: "ai",
        },
      },
      events: ["object_created"],
    },
  })
  aiMdBucket.attachPermissionsToNotification(
    "dailyAiMarkdownUploadedNotification", 
    commonPermissions
  )

  stack.addOutputs({
    techMdBucketName: techMdBucket.bucketName,
    WebNewsBucketName: webMdBucket.bucketName,
    AiNewsBucketName: aiMdBucket.bucketName,
  })

  return {
    techMdBucket,
    webMdBucket,
    aiMdBucket,
  }
}
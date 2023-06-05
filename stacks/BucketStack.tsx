import { Bucket, StackContext, use } from "sst/constructs"
import { ConfigStack } from "./ConfigStack"

const commonPermissions = [
  "s3:GetObject",
  "ssm:GetParameter",
  "secretsmanager:GetSecretValue",
  "ses:DeleteTemplate",
  "ses:CreateTemplate",
  "ses:SendTemplatedEmail",
]

export function BucketStack({ stack }: StackContext) {

  const {
    domainParam,
    cipherAlgoParam,
    cipherKeyParam,
    cipherIvParam,
  } = use(ConfigStack)
  
  /** 
   * Category: Tech
  */
  const techMdBucket 
    = new Bucket(stack, "TechMdBucket")

  techMdBucket.addNotifications(stack, {
    dailyTechMarkdownUploadedNotification: {
      function: {
        handler: 
          "packages/functions/bucket/generateDailyEmailTemplate.handler",
        environment: { 
          MD_BUCKET_NAME: techMdBucket.bucketName,
          BUCKET_CATEGORY: "tech",
        },
        bind: [
          domainParam,
          cipherAlgoParam,
          cipherKeyParam,
          cipherIvParam,
        ],
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
        "packages/functions/bucket/generateDailyEmailTemplate.handler",
        environment: { 
          MD_BUCKET_NAME: webMdBucket.bucketName,
          BUCKET_CATEGORY: "web",
        },
        bind: [
          domainParam,
          cipherAlgoParam,
          cipherKeyParam,
          cipherIvParam,
        ],
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
        "packages/functions/bucket/generateDailyEmailTemplate.handler",
        environment: { 
          MD_BUCKET_NAME: aiMdBucket.bucketName,
          BUCKET_CATEGORY: "ai",
        },
        bind: [
          domainParam,
          cipherAlgoParam,
          cipherKeyParam,
          cipherIvParam,
        ],
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
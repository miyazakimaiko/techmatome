import { Bucket, StackContext } from "sst/constructs"

export function BucketStack({ stack }: StackContext) {

  /**
   * When I upload markdown file, those notification fires 
   * and they creates Html file from md file uploaded.
   * At 21:00 UTC, Cron job checks if there's a html file 
   * with a target date. If so, send them to subscribers.
   * After sending, it deletes the html file created.
   */
  
  const techNewsMarkdownBucket 
    = new Bucket(stack, "TechNewsMarkdownBucket")

    const techNewsEmailTemplateBucket 
    = new Bucket(stack, "TechNewsEmailTemplateBucket")

  techNewsMarkdownBucket.addNotifications(stack, {
    dailyTechMarkdownUploadedNotification: {
      function: {
        handler: 
          "packages/functions/daily/generateDailyTechTemplate.handler",
        environment: { 
          techNewsMdBucketName: techNewsMarkdownBucket.bucketName,
          techNewsEmailTpBucketName: techNewsEmailTemplateBucket.bucketName,
        },
      },
      events: ["object_created"],
    },
  })
  techNewsMarkdownBucket.attachPermissionsToNotification(
    "dailyTechMarkdownUploadedNotification", 
    [
      "s3",
      "ssm:GetParameter",
      "secretsmanager:GetSecretValue",
      "ses:DeleteTemplate",
      "ses:CreateTemplate",
      "ses:SendTemplatedEmail",
    ]
  )

  const webNewsBucket = new Bucket(stack, "WebNewsBucket", {
    notifications: {
      dailyWebUploadedNotification: {
        function: "packages/functions/generateDailyWebNews.handler",
        events: ["object_created"],
      },
    },
  })

  const aiNewsBucket = new Bucket(stack, "AiNewsBucket", {
    notifications: {
      dailyAiUploadedNotification: {
        function: "packages/functions/generateDailyAiNews.handler",
        events: ["object_created"],
      },
    },
  })

  // stack.addOutputs({
  //   TechNewsMarkdownBucketName: techNewsMarkdownBucket.bucketName,
  //   WebNewsBucketName: webNewsBucket.bucketName,
  //   AiNewsBucketName: aiNewsBucket.bucketName,
  // })

  return {
    techNewsMarkdownBucket,
    techNewsEmailTemplateBucket,
    webNewsBucket,
    aiNewsBucket,
  }
}
import { StackContext, Cron, use } from "sst/constructs"
import { BucketStack } from "./BucketStack"
import { AuroraStack } from "./AuroraStack"

export function CronStack({ stack }: StackContext) {

  const { 
    cluster 
  } = use(AuroraStack)

  const { 
    techNewsEmailTemplateBucket 
  } = use(BucketStack)
  
  const cron = new Cron(stack, "Cron", {
    schedule: "cron(5 23 * * ? *)", // UTC time
    job: {
      function: {
        bind: [ cluster ],
        handler: "packages/functions/daily/bulkSendDailyTech.handler",
        environment: {
          techNewsEmailTpBucketName: techNewsEmailTemplateBucket.bucketName
        },
        
      },
    },
  })
  cron.attachPermissions([
    "rds-data",
    "s3",
    "secretsmanager:GetSecretValue",
    "ses:SendTemplatedEmail",
  ])

  stack.addOutputs({
    CronId: cron.id,
  });
}

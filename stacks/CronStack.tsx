import { StackContext, Cron, use } from "sst/constructs"
import { AuroraStack } from "./AuroraStack"

export function CronStack({ stack }: StackContext) {

  const { 
    cluster 
  } = use(AuroraStack)

  const cronScheculeString = "cron(0 20 ? * SUN-THU *)"

  const commonPermissions = [ 
    "rds-data",
    "ses:CreateTemplate",
    "ses:DeleteTemplate",
    "secretsmanager:GetSecretValue",
    "ses:SendTemplatedEmail",
  ]

  const techCron = new Cron(stack, "TechCron", {
    schedule: cronScheculeString,
    job: {
      function: {
        bind: [ cluster ],
        handler: "packages/functions/cron/bulkSendDailyEmail.handler",
        environment: {
          CATEGORY: "tech"
        },
        
      },
    },
  })
  techCron.attachPermissions(commonPermissions)

  const webCron = new Cron(stack, "WebCron", {
    schedule: cronScheculeString,
    job: {
      function: {
        bind: [ cluster ],
        handler: "packages/functions/cron/bulkSendDailyEmail.handler",
        environment: {
          CATEGORY: "web"
        },
        
      },
    },
  })
  webCron.attachPermissions(commonPermissions)

  const aiCron = new Cron(stack, "aiCron", {
    schedule: cronScheculeString,
    job: {
      function: {
        bind: [ cluster ],
        handler: "packages/functions/cron/bulkSendDailyEmail.handler",
        environment: {
          CATEGORY: "ai"
        },
        
      },
    },
  })
  aiCron.attachPermissions(commonPermissions)
}

import { StackContext, Cron, use } from "sst/constructs"
import { AuroraStack } from "./AuroraStack"
import { ConfigStack } from "./ConfigStack"

export function CronStack({ stack }: StackContext) {

  const { 
    cipherAlgoParam,
    cipherKeyParam,
    cipherIvParam,
  } = use(ConfigStack)

  const { 
    cluster 
  } = use(AuroraStack)

  const techCronSchecule = "cron(30 21 ? * SUN-THU *)"
  const webCronSchecule = "cron(0 21 ? * SUN-THU *)"
  const aiCronSchecule = "cron(0 21 ? * SUN-THU *)"

  const commonPermissions = [ 
    "rds-data",
    "ses:CreateTemplate",
    "ses:DeleteTemplate",
    "secretsmanager:GetSecretValue",
    "ses:SendTemplatedEmail",
  ]

  const techCron = new Cron(stack, "TechCron", {
    schedule: techCronSchecule,
    job: {
      function: {
        bind: [ 
          cluster,
          cipherAlgoParam,
          cipherKeyParam,
          cipherIvParam,
        ],
        handler: "packages/functions/cron/bulkSendDailyEmail.handler",
        environment: {
          CATEGORY: "tech"
        },
        
      },
    },
  })
  techCron.attachPermissions(commonPermissions)

  const webCron = new Cron(stack, "WebCron", {
    schedule: webCronSchecule,
    job: {
      function: {
        bind: [ 
          cluster,
          cipherAlgoParam,
          cipherKeyParam,
          cipherIvParam,
        ],
        handler: "packages/functions/cron/bulkSendDailyEmail.handler",
        environment: {
          CATEGORY: "web"
        },
        
      },
    },
  })
  webCron.attachPermissions(commonPermissions)

  const aiCron = new Cron(stack, "aiCron", {
    schedule: aiCronSchecule,
    job: {
      function: {
        bind: [ 
          cluster,
          cipherAlgoParam,
          cipherKeyParam,
          cipherIvParam,
        ],
        handler: "packages/functions/cron/bulkSendDailyEmail.handler",
        environment: {
          CATEGORY: "ai"
        },
        
      },
    },
  })
  aiCron.attachPermissions(commonPermissions)
}

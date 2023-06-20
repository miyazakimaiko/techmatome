import { StackContext, Cron, use } from "sst/constructs"
import { ConfigStack } from "./ConfigStack"

export function CronStack({ stack }: StackContext) {

  const { 
    cipherAlgoParam,
    cipherKeyParam,
    cipherIvParam,
    xataApiKeyParam
  } = use(ConfigStack)

  const techCronSchecule = "cron(0 21 ? * SUN-THU *)"
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
          cipherAlgoParam,
          cipherKeyParam,
          cipherIvParam,
          xataApiKeyParam,
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
          cipherAlgoParam,
          cipherKeyParam,
          cipherIvParam,
          xataApiKeyParam,
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
          cipherAlgoParam,
          cipherKeyParam,
          cipherIvParam,
          xataApiKeyParam,
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

import { Api, StackContext, use } from "sst/constructs"
import { AuroraStack } from "./AuroraStack"
import { SnsStack } from "./SnsStack"
import { ConfigStack } from "./ConfigStack"

export function ApiStack({ stack }: StackContext) {

  const { 
    cipherAlgoParam,
    cipherKeyParam,
    cipherIvParam,
  } = use(ConfigStack)
  const { 
    cluster 
  } = use(AuroraStack)
  const { 
    subscriberCreationTopic, 
  } = use(SnsStack)

  const mainApi = new Api(stack, "Api", {
    customDomain:
      stack.stage === 'prod' 
      ? "api.techmatome.com" 
      : undefined,
    cors: {
      allowOrigins: 
        stack.stage === 'prod' 
        ? ["https://techmatome.com"] 
        : ["http://localhost:3000"],
    },
    defaults: {
      function: {
        bind: [
          cluster, 
          subscriberCreationTopic,
          cipherAlgoParam,
          cipherKeyParam,
          cipherIvParam,
        ],
      },
    },
    routes: {
      "GET   /find": "packages/functions/api/find.handler",
      "POST  /create": "packages/functions/api/create.handler",
      "PATCH /update/{email}": "packages/functions/api/update.handler",
      "POST  /unsubscribe": "packages/functions/api/unsubscribe.handler",
      "POST  /resend-verification": "packages/functions/api/resendVerification.handler",
    },
  })
  mainApi.attachPermissionsToRoute(
    "POST /create", 
    ["secretsmanager:GetSecretValue"]
  )
  mainApi.attachPermissionsToRoute(
    "PATCH /update/{email}", 
    ["secretsmanager:GetSecretValue"]
  )
  mainApi.attachPermissionsToRoute(
    "POST /unsubscribe", 
    ["secretsmanager:GetSecretValue"]
  )

  stack.addOutputs({
    MainApiUrl: mainApi.url,
  })

  return { 
    apiStack: mainApi,
    mainApiUrl: mainApi.url,
  }
}
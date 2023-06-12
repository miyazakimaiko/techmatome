import { Api, StackContext, use } from "sst/constructs"
import { SnsStack } from "./SnsStack"
import { ConfigStack } from "./ConfigStack"

export function ApiStack({ stack }: StackContext) {

  if (!process.env.PUBLIC_DOMAIN) {
    throw new Error("PUBLIC_DOMAIN is not defined")
  }

  const { 
    cipherAlgoParam,
    cipherKeyParam,
    cipherIvParam,
    xataApiKeyParam,
  } = use(ConfigStack)

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
        ? [process.env.PUBLIC_DOMAIN] 
        : ["http://localhost:3000"],
    },
    defaults: {
      function: {
        bind: [
          subscriberCreationTopic,
          cipherAlgoParam,
          cipherKeyParam,
          cipherIvParam,
        ],
        environment: { 
          DB_API_KEY: xataApiKeyParam.value
        },
      },
    },
    routes: {
      "GET   /find": "packages/functions/api/find.handler",
      "POST  /create": "packages/functions/api/create.handler",
      "PATCH /update": "packages/functions/api/update.handler",
      "POST  /unsubscribe": "packages/functions/api/unsubscribe.handler",
      "POST  /resend-verification": "packages/functions/api/resendVerification.handler",
    },
  })

  stack.addOutputs({
    MainApiUrl: mainApi.url,
  })

  return { 
    apiStack: mainApi,
    mainApiUrl: mainApi.url,
  }
}
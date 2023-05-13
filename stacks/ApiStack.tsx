import { Api, StackContext, use } from "sst/constructs"
import { AuroraStack } from "./AuroraStack"
import { SnsStack } from "./SnsStack"

export function ApiStack({ stack }: StackContext) {

  const { cluster } = use(AuroraStack)
  const { subscriberCreationTopic } = use(SnsStack)

  const mainApi = new Api(stack, "Api", {
    defaults: {
      function: {
        bind: [cluster],
      },
    },
    routes: {
      "GET /find": "packages/functions/find.handler",
      "PATCH /update/{email}": "packages/functions/update.handler",
      "GET /verify/{email}": "packages/functions/verify.handler",
    },
  })

  const subscriberCreationApi = new Api(stack, "SubscriberCreationApi", {
    defaults: {
      function: {
        bind: [cluster, subscriberCreationTopic],
      },
    },
    routes: {
      "POST /create": "packages/functions/create.handler",
    },
  })

  stack.addOutputs({
    MainApiUrl: mainApi.url,
    SubscriberCreationApi: subscriberCreationApi.url,
    SecretArn: cluster.secretArn,
    ClusterIdentifier: cluster.clusterIdentifier,
  })

  return { 
    mainApiUrl: mainApi.url,
    subscriberCreationApiUrl: subscriberCreationApi.url,
  }
}
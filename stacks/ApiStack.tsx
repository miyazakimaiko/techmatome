import { Api, StackContext, use } from "sst/constructs"
import { AuroraStack } from "./AuroraStack"
import { SnsStack } from "./SnsStack"

export function ApiStack({ stack }: StackContext) {

  const { 
    cluster 
  } = use(AuroraStack)
  const { 
    subscriberCreationTopic, 
    subscriberVerifiedTopic 
  } = use(SnsStack)

  const mainApi = new Api(stack, "Api", {
    defaults: {
      function: {
        bind: [
          cluster, 
          subscriberCreationTopic,
          subscriberVerifiedTopic,
        ],
      },
    },
    routes: {
      "GET   /find": "packages/functions/find.handler",
      "POST  /create": "packages/functions/create.handler",
      "PATCH /update/{email}": "packages/functions/update.handler",
      "POST  /verify": "packages/functions/verify.handler",
      "POST  /unsubscribe": "packages/functions/unsubscribe.handler",
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
    SecretArn: cluster.secretArn,
    ClusterIdentifier: cluster.clusterIdentifier,
  })

  return { 
    mainApiUrl: mainApi.url,
  }
}
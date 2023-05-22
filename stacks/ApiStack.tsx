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
      "GET   /find": "packages/functions/api/find.handler",
      "POST  /create": "packages/functions/api/create.handler",
      "PATCH /update/{email}": "packages/functions/api/update.handler",
      "POST  /verify": "packages/functions/api/verify.handler",
      "POST  /unsubscribe": "packages/functions/api/unsubscribe.handler",
    },
  })
  mainApi.attachPermissionsToRoute(
    "POST /create", 
    ["secretsmanager:GetSecretValue"]
  )
  mainApi.attachPermissionsToRoute(
    "POST /verify", 
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
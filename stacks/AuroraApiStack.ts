import { Api, RDS, StackContext } from "sst/constructs"

export function AuroraApiStack({ stack }: StackContext) {
  const DATABASE = "tiro"

  const cluster = new RDS(stack, "Cluster", {
    engine: "postgresql11.13",
    defaultDatabaseName: DATABASE,
  });

  const api = new Api(stack, "Api", {
    defaults: {
      function: {
        bind: [cluster],
      },
    },
    routes: {
      "POST /find": "packages/functions/find.handler",
      "POST /create": "packages/functions/create.handler",
      "POST /update/{email}": "packages/functions/update.handler",
      "POST /verify/{email}": "packages/functions/verify.handler",
    },
  });

  stack.addOutputs({
    ApiEndpoint: api.url,
    SecretArn: cluster.secretArn,
    ClusterIdentifier: cluster.clusterIdentifier,
  });
}
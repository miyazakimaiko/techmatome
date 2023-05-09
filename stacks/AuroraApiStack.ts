import { Api, RDS, StackContext } from "sst/constructs"

export function AuroraApiStack({ stack }: StackContext) {
  const DATABASE = "tiro"

  // Create the Aurora DB cluster
  const cluster = new RDS(stack, "Cluster", {
    engine: "postgresql11.13",
    defaultDatabaseName: DATABASE,
  });

  // Create a HTTP API
  const api = new Api(stack, "Api", {
    defaults: {
      function: {
        bind: [cluster],
      },
    },
    routes: {
      "POST /test": "packages/functions/lambda.handler",
    },
  });

  // Show the resource info in the output
  stack.addOutputs({
    ApiEndpoint: api.url,
    SecretArn: cluster.secretArn,
    ClusterIdentifier: cluster.clusterIdentifier,
  });
}
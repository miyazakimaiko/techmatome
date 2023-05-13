import { RDS, StackContext } from "sst/constructs"

export function AuroraStack({ stack }: StackContext) {

  const DATABASE_NAME = "tiro"

  const cluster = new RDS(stack, "Cluster", {
    engine: "postgresql11.13",
    defaultDatabaseName: DATABASE_NAME,
  })

  stack.addOutputs({
    SecretArn: cluster.secretArn,
    ClusterIdentifier: cluster.clusterIdentifier,
  })

  return { cluster }
}
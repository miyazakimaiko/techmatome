import { RDS, Script, StackContext } from "sst/constructs"

export function AuroraStack({ stack }: StackContext) {

  const DATABASE_NAME = "tiro"

  const cluster = new RDS(stack, "Cluster", {
    engine: "postgresql11.13",
    defaultDatabaseName: DATABASE_NAME,
    scaling: {
      minCapacity: "ACU_2"
    }
  })

  new Script(stack, "auroraCreateTableScript", {
    onCreate: {
      handler: "packages/functions/aurora/createTables.handler",
      bind: [cluster],
    },
  })

  stack.addOutputs({
    SecretArn: cluster.secretArn,
    ClusterIdentifier: cluster.clusterIdentifier,
  })

  return { cluster }
}
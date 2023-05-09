import { RDSData } from "@aws-sdk/client-rds-data"
import { Kysely } from "kysely"
import { DataApiDialect } from "kysely-data-api"
import type { Database } from "./interfaces"
import { RDS } from "sst/node/rds"

declare module "sst/node/rds" {
  export interface RDSResources {
    "Cluster": {
      clusterArn: string;
      secretArn: string;
      defaultDatabaseName: string;
    }
  }
}

export const db = new Kysely<Database>({
  dialect: new DataApiDialect({
    mode: "postgres",
    driver: {
      database: RDS.Cluster.defaultDatabaseName,
      resourceArn: RDS.Cluster.clusterArn,
      secretArn: RDS.Cluster.secretArn,
      client: new RDSData({}),
    },
  }),
})

export * as TiroRds from "./rds"
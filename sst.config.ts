import { SSTConfig } from "sst"
import { ConfigStack } from "./stacks/ConfigStack"
import { BucketStack } from "./stacks/BucketStack"
import { CronStack } from "./stacks/CronStack"
import { SnsStack } from "./stacks/SnsStack"
import { SesStack } from "./stacks/SesStack"
import { ApiStack } from "./stacks/ApiStack"
import { SiteStack } from "./stacks/SiteStack"

export default {
  config(_input) {
    return {
      name: "techmatome",
      region: "eu-west-1",
    };
  },
  stacks(app) {
    app.setDefaultFunctionProps({
      runtime: "nodejs18.x",
    })
    app.stack(ConfigStack)
    app.stack(BucketStack)    
    app.stack(CronStack)    
    app.stack(SnsStack)
    app.stack(SesStack)
    app.stack(ApiStack)
    app.stack(SiteStack)
  },
} satisfies SSTConfig;

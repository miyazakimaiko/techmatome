import { SSTConfig } from "sst"
import { AuroraStack } from "./stacks/AuroraStack"
import { BucketStack } from "./stacks/BucketStack"
import { CronStack } from "./stacks/CronStack"
import { SnsStack } from "./stacks/SnsStack"
import { ApiStack } from "./stacks/ApiStack"
import { SiteStack } from "./stacks/SiteStack"

export default {
  config(_input) {
    return {
      name: "tiro-news",
      region: "ap-northeast-1",
    };
  },
  stacks(app) {
    app.stack(AuroraStack)
    app.stack(BucketStack)    
    app.stack(CronStack)    
    app.stack(SnsStack)
    app.stack(ApiStack)
    app.stack(SiteStack)
  },
} satisfies SSTConfig;

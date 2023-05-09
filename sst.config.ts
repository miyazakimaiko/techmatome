import { SSTConfig } from "sst";
import { SiteStack } from "./stacks/SiteStack"
import { AuroraApiStack } from "./stacks/AuroraApiStack"

export default {
  config(_input) {
    return {
      name: "tiro-news",
      region: "eu-west-2",
    };
  },
  stacks(app) {
    app.stack(SiteStack)
    app.stack(AuroraApiStack)
  },
} satisfies SSTConfig;

import { SSTConfig } from "sst";
import { SiteStack } from "./stacks/SiteStack"
import { ApiStack } from "./stacks/ApiStack"
import { AuroraStack } from "./stacks/AuroraStack";
import { SnsStack } from "./stacks/SnsStack";

export default {
  config(_input) {
    return {
      name: "tiro-news",
      region: "eu-west-2",
    };
  },
  stacks(app) {
    app.stack(AuroraStack)
    app.stack(SnsStack)
    app.stack(ApiStack)
    app.stack(SiteStack)
  },
} satisfies SSTConfig;

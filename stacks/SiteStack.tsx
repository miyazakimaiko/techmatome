import { StackContext, use } from "sst/constructs"
import { NextjsSite } from "sst/constructs"
import { AuroraApiStack } from "./AuroraApiStack";

export function SiteStack({ stack }: StackContext) {
  const { apiEndpoint } = use(AuroraApiStack)

  const site = new NextjsSite(stack, "site", {
    path: "frontend",
    environment: {
      NEXT_PUBLIC_API_ENDPOINT: apiEndpoint,
    },
  });

  stack.addOutputs({
    SiteUrl: site.url,
  });
}
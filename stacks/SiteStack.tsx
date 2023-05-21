import { StackContext, use } from "sst/constructs"
import { NextjsSite } from "sst/constructs"
import { ApiStack } from "./ApiStack"

export function SiteStack({ stack }: StackContext) {
  
  const { mainApiUrl } = use(ApiStack)

  const site = new NextjsSite(stack, "site", {
    path: "frontend",
    environment: {
      NEXT_PUBLIC_MAIN_API: mainApiUrl,
    },
  });

  stack.addOutputs({
    SiteUrl: site.url,
  });
}
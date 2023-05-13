import { StackContext, use } from "sst/constructs"
import { NextjsSite } from "sst/constructs"
import { ApiStack } from "./ApiStack"

export function SiteStack({ stack }: StackContext) {
  
  const { mainApiUrl, subscriberCreationApiUrl } = use(ApiStack)

  const site = new NextjsSite(stack, "site", {
    path: "frontend",
    environment: {
      NEXT_PUBLIC_MAIN_API: mainApiUrl,
      NEXT_PUBLIC_SUBSCRIBER_CREATION_API: subscriberCreationApiUrl,
    },
  });

  stack.addOutputs({
    SiteUrl: site.url,
  });
}
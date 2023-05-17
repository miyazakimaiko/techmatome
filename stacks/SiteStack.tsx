import { StackContext, use } from "sst/constructs"
import { NextjsSite } from "sst/constructs"
import { ApiStack } from "./ApiStack"
import { BucketStack } from "./BucketStack"

export function SiteStack({ stack }: StackContext) {
  
  const { mainApiUrl } = use(ApiStack)
  const {
    techNewsMarkdownBucket,
    webNewsBucket,
    aiNewsBucket,
  } = use(BucketStack)

  const site = new NextjsSite(stack, "site", {
    path: "frontend",
    bind: [techNewsMarkdownBucket, webNewsBucket, aiNewsBucket],
    environment: {
      NEXT_PUBLIC_MAIN_API: mainApiUrl,
    },
  });

  stack.addOutputs({
    SiteUrl: site.url,
  });
}
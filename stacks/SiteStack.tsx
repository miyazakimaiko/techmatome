import { StackContext, use } from "sst/constructs"
import { NextjsSite } from "sst/constructs"
import { ApiStack } from "./ApiStack"

export function SiteStack({ stack }: StackContext) {
  
  const { mainApiUrl } = use(ApiStack)

  const site = new NextjsSite(stack, "site", {
    customDomain: {
      domainName: stack.stage === "prod" ? "tiro.news" : `localhost:3000`,
      domainAlias: stack.stage === "prod" ? `www.tiro.news` : `locahost:3000`,
    },
    path: "frontend",
    environment: {
      NEXT_PUBLIC_DOMAIN: stack.stage === "prod" 
        ? `https://tiro.news` : `https://localhost:3000`,
      NEXT_PUBLIC_MAIN_API: mainApiUrl,
    },
  });

  stack.addOutputs({
    SiteUrl: site.url,
  });
}
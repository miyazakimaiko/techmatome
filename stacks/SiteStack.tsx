import { StackContext, use } from "sst/constructs"
import { NextjsSite } from "sst/constructs"
import { ApiStack } from "./ApiStack"

export function SiteStack({ stack }: StackContext) {
  
  const { mainApiUrl } = use(ApiStack)

  const site = new NextjsSite(stack, "site", {
    customDomain: {
      domainName: stack.stage === "prod" ? "techmatome.com" : `localhost:3000`,
      domainAlias: stack.stage === "prod" ? `www.techmatome.com` : `locahost:3000`,
    },
    path: "frontend",
    environment: {
      NEXT_PUBLIC_DOMAIN: stack.stage === "prod" 
        ? `https://techmatome.com` : `http://localhost:3000`,
      NEXT_PUBLIC_MAIN_API: stack.stage === "prod" 
      ? `https://api.techmatome.com` : mainApiUrl,
    },
  });

  stack.addOutputs({
    SiteUrl: site.url,
  });
}
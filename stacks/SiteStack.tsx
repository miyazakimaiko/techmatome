import { StackContext } from "sst/constructs"
import { NextjsSite } from "sst/constructs"

export function SiteStack({ stack }: StackContext) {
  const site = new NextjsSite(stack, "site");

  stack.addOutputs({
    SiteUrl: site.url,
  });
}
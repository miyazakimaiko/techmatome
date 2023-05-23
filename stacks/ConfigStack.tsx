import { Config, StackContext } from "sst/constructs"

export function ConfigStack({ stack }: StackContext) {

  const params = new Config.Parameter(stack, "PUBLIC_DOMAIN", {
    value: stack.stage === "prod" 
      ? `https://tiro.news` : `https://localhost:3000`,
  });

  return {
    params
  }
}

import { Function, StackContext } from "sst/constructs"

export function SesStack({ stack }: StackContext) {

  const createReceiptRule = new Function(stack, "createReceiptRule", {
    handler: "packages/functions/ses/createReceiptRule.handler",
    permissions: ["ses"],
  })

}
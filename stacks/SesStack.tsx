import { StackContext, use } from "sst/constructs"
import { CfnEmailIdentity, CfnReceiptRuleSet, CfnReceiptRule, } from "aws-cdk-lib/aws-ses"
import { SnsStack } from "./SnsStack"

export async function SesStack({ stack }: StackContext) {

  const { subscriberRepliedTopic } = use(SnsStack)

  // const domainIdentity = new CfnEmailIdentity(stack, "DomainIdentity", {
  //   emailIdentity: "techmatome.com",
  // })

  const ruleSet = new CfnReceiptRuleSet(stack, "miyazakiEmailAddressReceiptRuleSet")

  const receiptRule = new CfnReceiptRule(stack, "miyazakiEmailAddressReceiptRule", {
    ruleSetName: ruleSet.ref,
    rule: {
      name: "miyazakiEmailAddressReceiptRule",
      enabled: true,
      recipients: ["miyazaki@techmatome.com"],
      actions: [
        {
          snsAction: {
            topicArn: subscriberRepliedTopic.topicArn,
          },
        },
        {
          workmailAction: {
            organizationArn: `arn:aws:workmail:${stack.region}:519775997184:organization/m-f00472ae5a854bcba9756af22b6feffc`,
          },
        },
      ],
    },
  })

  receiptRule.node.addDependency(ruleSet)
  // receiptRule.node.addDependency(domainIdentity)
}

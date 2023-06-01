import { StackContext, use } from "sst/constructs"
import { CfnEmailIdentity, CfnReceiptRuleSet, CfnReceiptRule, } from "aws-cdk-lib/aws-ses"
import { SnsStack } from "./SnsStack"

export async function SesStack({ stack }: StackContext) {

  const { subscriberRepliedTopic } = use(SnsStack)

  const domainIdentity = new CfnEmailIdentity(stack, "DomainIdentity", {
    emailIdentity: "miyazaki@techmatome.com",
  })

  const ruleSet = new CfnReceiptRuleSet(stack, "emailVerificationRuleSet")

  const receiptRule = new CfnReceiptRule(stack, "emailAddressVerificationRule", {
    ruleSetName: ruleSet.ref,
    rule: {
      name: "emailAddressVerificationRule",
      enabled: true,
      recipients: ["miyazaki@techmatome.com"],
      actions: [
        {
          snsAction: {
            topicArn: subscriberRepliedTopic.topicArn,
          },
        },
      ],
    },
  })

  const forwardToWorkmailRule = new CfnReceiptRule(stack, "forwardToWorkmailRule", {
    ruleSetName: ruleSet.ref,
    rule: {
      name: "forwardToWorkmailRule",
      enabled: true,
      recipients: ["miyazaki@techmatome.com"],
      actions: [
        {
          workmailAction: {
            organizationArn: `arn:aws:workmail:${stack.region}:519775997184:organization/m-f00472ae5a854bcba9756af22b6feffc`,
          },
        },
      ],
    },
  })

  receiptRule.node.addDependency(domainIdentity)
  forwardToWorkmailRule.node.addDependency(domainIdentity)
}

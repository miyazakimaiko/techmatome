import { StackContext, Config, use } from "sst/constructs"
import { CfnEmailIdentity, CfnReceiptRuleSet, CfnReceiptRule, } from "aws-cdk-lib/aws-ses"
import { SnsStack } from "./SnsStack"

export async function SesStack({ stack }: StackContext) {

  if (!process.env.WORKMAIL_ORG_ID || !process.env.AWS_ACCT_ID) {
    throw new Error("WORKMAIL_ORG_ID or AWS_ACCT_ID is not set")
  }

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
            organizationArn: `arn:aws:workmail:${stack.region}:${process.env.AWS_ACCT_ID}:organization/${process.env.WORKMAIL_ORG_ID}`,
          },
        },
      ],
    },
  })

  receiptRule.node.addDependency(ruleSet)
  // receiptRule.node.addDependency(domainIdentity)
}

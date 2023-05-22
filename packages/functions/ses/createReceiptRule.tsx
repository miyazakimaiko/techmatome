import { CreateReceiptRuleCommand, SESClient } from "@aws-sdk/client-ses";

const client = new SESClient({ region: "ap-northeast-1" })

export async function handler(event: any) {
  try {

    const input = { // CreateReceiptRuleRequest
      RuleSetName: "STRING_VALUE", // required
      After: "STRING_VALUE",
      Rule: { // ReceiptRule
        Name: "STRING_VALUE", // required
        Enabled: true || false,
        TlsPolicy: "STRING_VALUE",
        Recipients: [ // RecipientsList
          "STRING_VALUE",
        ],
        Actions: [ // ReceiptActionsList
          { // ReceiptAction
            S3Action: { // S3Action
              TopicArn: "STRING_VALUE",
              BucketName: "STRING_VALUE", // required
              ObjectKeyPrefix: "STRING_VALUE",
              KmsKeyArn: "STRING_VALUE",
            },
            BounceAction: { // BounceAction
              TopicArn: "STRING_VALUE",
              SmtpReplyCode: "STRING_VALUE", // required
              StatusCode: "STRING_VALUE",
              Message: "STRING_VALUE", // required
              Sender: "STRING_VALUE", // required
            },
            WorkmailAction: { // WorkmailAction
              TopicArn: "STRING_VALUE",
              OrganizationArn: "STRING_VALUE", // required
            },
            LambdaAction: { // LambdaAction
              TopicArn: "STRING_VALUE",
              FunctionArn: "STRING_VALUE", // required
              InvocationType: "STRING_VALUE",
            },
            StopAction: { // StopAction
              Scope: "STRING_VALUE", // required
              TopicArn: "STRING_VALUE",
            },
            AddHeaderAction: { // AddHeaderAction
              HeaderName: "STRING_VALUE", // required
              HeaderValue: "STRING_VALUE", // required
            },
            SNSAction: { // SNSAction
              TopicArn: "STRING_VALUE", // required
              Encoding: "STRING_VALUE",
            },
          },
        ],
        ScanEnabled: true || false,
      },
    };
    const command = new CreateReceiptRuleCommand(input);
    const response = await client.send(command);
    // {};

  } catch (e: any) {
    console.error(e)
    return {
      statusCode: 500,
      body: JSON.stringify({ error: e.message }),
    }
  }
}
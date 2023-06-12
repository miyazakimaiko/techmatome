import { StackContext, Topic, use } from "sst/constructs"
import { ConfigStack } from "./ConfigStack"

export function SnsStack({ stack }: StackContext) {

  const { 
    domainParam,
    cipherAlgoParam,
    cipherKeyParam,
    cipherIvParam,
    xataApiKeyParam
  } = use(ConfigStack)

  // send on creation
  const subscriberCreationTopic = new Topic(stack, "SubscriberCreationTopic", {
    subscribers: {
      emailVerificationLink: 
        "packages/functions/sns/emailVerificationLink.handler",
    },
  })
  subscriberCreationTopic.attachPermissionsToSubscriber(
    "emailVerificationLink",
    [
      "ses:SendEmail", 
      "ses:SendRawEmail",
    ]
  )
  subscriberCreationTopic.bind([
    domainParam,
    cipherAlgoParam,
    cipherKeyParam,
    cipherIvParam,
    xataApiKeyParam,
  ])


  // send on email receive
  const subscriberRepliedTopic = new Topic(stack, "SubscriberRepliedTopic", {
    subscribers: {
      verifyEmailOnReceive: "packages/functions/sns/verifyEmailOnReceive.handler",
    },
  })
  subscriberRepliedTopic.attachPermissionsToSubscriber(
    "verifyEmailOnReceive",
    [
      "ses:SendEmail", 
      "ses:SendRawEmail",
    ]
  )
  subscriberRepliedTopic.bind([
    domainParam,
    cipherAlgoParam,
    cipherKeyParam,
    cipherIvParam,
    xataApiKeyParam,
  ])

  // output
  stack.addOutputs({
    subscriberCreationTopicArn: subscriberCreationTopic.topicArn,
    subscriberRepliedTopicArn: subscriberRepliedTopic.topicArn,
  })

  return { 
    subscriberCreationTopic,
    subscriberRepliedTopic,
  }
}
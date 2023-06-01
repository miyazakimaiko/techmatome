import { StackContext, Topic, use } from "sst/constructs"
import { ConfigStack } from "./ConfigStack";
import { AuroraStack } from "./AuroraStack";

export function SnsStack({ stack }: StackContext) {

  const { params,
    cipherAlgoParam,
    cipherKeyParam,
    cipherIvParam,
  } = use(ConfigStack)

  const { cluster } = use(AuroraStack)

  // send on creation
  const subscriberCreationTopic = new Topic(stack, "SubscriberCreationTopic", {
    subscribers: {
      emailVerificationLink: "packages/functions/sns/emailVerificationLink.handler",
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
    params,
    cipherAlgoParam,
    cipherKeyParam,
    cipherIvParam,
  ])

  // send when verified
  const subscriberVerifiedTopic = new Topic(stack, "SubscriberVerifiedTopic", {
    subscribers: {
      emailVerifiedNotification: "packages/functions/sns/emailVerifiedNotification.handler",
    },
  })
  subscriberVerifiedTopic.attachPermissionsToSubscriber(
    "emailVerifiedNotification",
    [
      "ses:SendEmail", 
      "ses:SendRawEmail", 
    ]
  )
  subscriberVerifiedTopic.bind([
    params,
    cipherAlgoParam,
    cipherKeyParam,
    cipherIvParam,
  ]);

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
    params,
    cipherAlgoParam,
    cipherKeyParam,
    cipherIvParam,
    cluster,
    subscriberVerifiedTopic
  ])

  // output
  stack.addOutputs({
    subscriberCreationTopicArn: subscriberCreationTopic.topicArn,
    subscriberRepliedTopicArn: subscriberRepliedTopic.topicArn,
    subscriberVerifiedTopicArn: subscriberVerifiedTopic.topicArn,
  })

  return { 
    subscriberCreationTopic,
    subscriberRepliedTopic,
    subscriberVerifiedTopic,
  }
}
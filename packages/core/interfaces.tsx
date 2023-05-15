export interface SubscriberTable {
  email_address: string
  verified?: 0 | 1
  tech_subscribed: 0 | 1
  web_subscribed: 0 | 1
  ai_subscribed: 0 | 1
  created_at?: Date
}

export interface EmailVerificationTokenTable {
  email_address: string
  encrypted_token: Text
  created_at?: Date
}

export interface Database {
  subscriber: SubscriberTable,
  email_verification_token: EmailVerificationTokenTable,
}
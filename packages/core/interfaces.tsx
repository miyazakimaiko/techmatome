export interface SubscriberTable {
  email_address: string
  verified: number
  tech_subscribed: number
  web_subscribed: number
  ai_subscribed: number
  created_at: Date
}

export interface Database {
  subscriber: SubscriberTable
}
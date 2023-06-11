export interface Subscriber {
  id: string,
  email_address: string
  verified: 0 | 1
  tech_subscribed: 0 | 1
  web_subscribed: 0 | 1
  crypto_subscribed: 0 | 1
}
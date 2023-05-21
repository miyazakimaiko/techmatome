/**
 * For Kysley
 */
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

/**
 * For converting markdown to html email template
 */
export interface Metadata {
  subject: string,
  category: string,
  date: string,
}

export interface Contents {
  metadata: Metadata,
  sections: Section[],
}

export interface Section {
  icon: string,
  heading: string, 
  articles: Article[],
}

export interface Article {
  heading: string, 
  paragraph: string,
}


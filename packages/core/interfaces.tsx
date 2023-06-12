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


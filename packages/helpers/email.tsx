export function generateEmailSenderFromCategory(category: string) {
  const senderCategoryName
  = category === "tech" ? " Tech"
    : category === "web" ? " Web"
    : category === "ai" ? " AI"
    : ""

  if (senderCategoryName === "") {
    throw new Error(`Failed to generate sender source from category ${category}.`)
  }

  return `TiRO${senderCategoryName}<tech@tiro.news>`
}
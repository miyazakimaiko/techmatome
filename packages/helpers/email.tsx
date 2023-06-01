import libmime from "libmime"

export function generateEmailSenderFromCategory(category: string) {
  const senderCategoryName
  = category === "tech" ? " Tech"
    : category === "web" ? " Web"
    : category === "ai" ? " AI"
    : ""

  if (senderCategoryName === "") {
    throw new Error(`Failed to generate sender source from category ${category}.`)
  }

  return `${senderCategoryName}${libmime.encodeWord("まとめ")} <miyazaki@techmatome.com>`
}
import fs from "fs"

export default function getLatestArticleSlug (category: string): String {
  const files = fs.readdirSync(`articles/${category}/`)
  const latestArticleFile = files.reverse().find((file) => file.endsWith(".md"))
  const slug = latestArticleFile?.replace(".md", "") ?? "#"

  return `${category}/${slug}`
}
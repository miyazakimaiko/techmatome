import fs from "fs"

export default function getLatestArticleSlug (): String {
  const folder = "articles/"
  const files = fs.readdirSync(folder)
  const latestArticleFile = files.reverse().find((file) => file.endsWith(".md"))

  return latestArticleFile?.replace(".md", "") ?? "#"
}
import fs from "fs"
import path from "path"

const root = process.cwd()

export default function getLatestArticleSlug (category: string): String {
  const staticFilePath = `public/articles/${category}/`
  const source = path.join(root, staticFilePath)
  const files = fs.readdirSync(source)
  const latestArticleFile = files.reverse().find((file) => file.endsWith(".md"))
  const slug = latestArticleFile?.replace(".md", "") ?? "#"

  return `${category}/${slug}`
}
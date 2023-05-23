import fs from "fs"
import path from "path"
import matter from "gray-matter"
import { ArticleMetadata } from "@/interfaces/articleMetadata"

const root = process.cwd()

export default function getArticlesMetadata (category: string): ArticleMetadata[] {

  const folder = `public/articles/${category}/`
  const source = path.join(root, folder)

  const files = fs.readdirSync(source)
  const markdownArticles = files.filter((file) => file.endsWith(".md"))

  // Get gray-matter data from each file.
  const articles = markdownArticles.map((fileName) => {
    const fileContents = fs.readFileSync(`${source}${fileName}`, "utf8")
    const matterResult = matter(fileContents)
    return {
      title: matterResult.data.subject,
      subject: matterResult.data.subject,
      date: matterResult.data.date,
      subtitle: matterResult.data.subtitle ?? "No subtitle",
      slug: fileName.replace(".md", ""),
      category,
    }
  })

  return articles
}
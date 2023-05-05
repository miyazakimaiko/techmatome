import fs from "fs";
import matter from "gray-matter"
import { ArticleMetadata } from "@/interfaces/ArticleMetadata";

export default function getArticlesMetadata (): ArticleMetadata[] {
  const folder = "articles/";
  const files = fs.readdirSync(folder);
  const markdownArticles = files.filter((file) => file.endsWith(".md"));

  // Get gray-matter data from each file.
  const articles = markdownArticles.map((fileName) => {
    const fileContents = fs.readFileSync(`${folder}${fileName}`, "utf8");
    const matterResult = matter(fileContents);
    return {
      title: matterResult.data.title,
      date: matterResult.data.date,
      subtitle: matterResult.data.subtitle ?? "No subtitle",
      slug: fileName.replace(".md", ""),
    };
  });

  return articles;
};
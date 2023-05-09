import fs from "fs";
import Markdown from "markdown-to-jsx";
import matter from "gray-matter";
import getArticlesMetadata from "@/helpers/getArticlesMetadata";
import Header from "@/components/header";
import SubscribeForm from "@/components/subscribeForm";

const getArticleContent = (slug: string) => {
  const folder = "articles/";
  const file = `${folder}${slug}.md`;
  const content = fs.readFileSync(file, "utf8");
  const matterResult = matter(content);
  return matterResult;
};

export const generateStaticParams = async () => {
  const articles = getArticlesMetadata();
  return articles.map((article) => ({
    slug: article.slug,
  }));
};

export default function Article (props: any) {
  const slug = props.params.slug;
  const post = getArticleContent(slug);
  return (
    <>
      <Header/>
      <main>
        <h1 className="page-title">TiRO テックニュース {slug}</h1>
        <article className="text-left">
          <Markdown>{post.content}</Markdown>
        </article>
        <SubscribeForm/>
      </main>
    </>
  );
};
import fs from "fs"
import matter from "gray-matter"
import Header from "@/components/header"
import ArticleLink from "@/components/articleLink"
import SubscribeSection from "@/components/subscribeSection"
import getArticlesMetadata from "@/functions/getArticlesMetadata"
import Content from "./content"

const CATEGORY_AS_TITLES = Object.freeze({
  tech: "テック",
  web: "Web制作・Web開発",
  ai: "AI"
})

const getArticleContent = (category: string, date: string) => {
  const file = `articles/${category}/${date}.md`
  const content = fs.readFileSync(file, "utf8")
  const matterResult = matter(content)
  return matterResult
}

export default function Article (props: any) {
  const category = props.params.slug[0]
  const date = props.params.slug[1]

  const categoryTitle = CATEGORY_AS_TITLES[
    category as keyof typeof CATEGORY_AS_TITLES
  ]

  if (!date) {
    const emojis = (
      <div className="text-5xl pt-2 pb-6">
        <span>📚</span>
      </div>
    )
  
    const introText = (
      <div className="text-center pb-5 sm:leading-7">
        <p className="pb-4">
          最新記事を読む時間がない。<strong>英語だと尚更。</strong>
          <br/>TiROは、そんな<strong>Geekのための無料メルマガ</strong>です。
        </p>
        <p>
          テクノロジーやプログラミングに関する
          <br/>興味深い記事を<strong>要約・翻訳</strong>して 毎朝お届けします。
        </p>
      </div>
    )
  
    const articlesMetadata = getArticlesMetadata(category);
    const articleLinks = articlesMetadata.map((metadata) => (
      <ArticleLink key={metadata.slug} {...metadata} />
    )).reverse();
  
    return (
      <>
        <Header/>
        <main className="grow">
          <h1 className="page-title">過去の{categoryTitle}まとめ</h1>
          {emojis}
          {introText}
          <SubscribeSection category={category} />
          <div className="py-16">{articleLinks}</div>
        </main>
      </>
    )

  } else {

    const post = getArticleContent(category, date)
    return (
      <>
        <Header/>
        <main className="archives">
          <h1 className="page-title">TiRO {categoryTitle}まとめ {date}</h1>
          <Content content={post.content}/>
          <SubscribeSection category={category} />
        </main>
      </>
    )
  }
}
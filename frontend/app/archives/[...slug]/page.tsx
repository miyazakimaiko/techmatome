import fs from "fs"
import path from "path"
import matter from "gray-matter"
import Header from "@/components/header"
import ArticleLink from "@/components/articleLink"
import SubscribeSection from "@/components/subscribeSection"
import getArticlesMetadata from "@/functions/getArticlesMetadata"
import Content from "./content"

const CATEGORY_AS_TITLES = Object.freeze({
  tech: "テック全般・AI",
  web: "Web制作・Web開発",
  crypto: "クリプト・ブロックチェーン",
})

const root = process.cwd()

const getArticleContent = (category: string, date: string) => {
  const file = `public/articles/${category}/${date}.md`
  const source = path.join(root, file)

  const content = fs.readFileSync(source, "utf8")
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
      <div className="text-center pb-3 sm:leading-7">
        <p>
          無料でサクッと読める、<br/>Geek・エンジニアのためのメルマガ📩
          <br/>英語の最新記事やブログを翻訳、要約して毎朝お届けします🎁
        </p>
      </div>
    )
  
    const articlesMetadata = getArticlesMetadata(category)


    const articleLinks = 
      articlesMetadata.map((metadata) => (
        <ArticleLink key={metadata.slug} {...metadata} />
      )).reverse()

    console.log({articleLinks})
    return (
      <>
        <Header/>
        <main className="grow">
          <h1 className="page-title">過去の{categoryTitle}まとめ</h1>
          {emojis}
          {introText}
          <SubscribeSection category={category} />
          <div className="py-16">
          {
            articlesMetadata.length > 0
            ?
            articleLinks
            :
            "只今準備中です🙇"
          }</div>
        </main>
      </>
    )

  } else {

    const post = getArticleContent(category, date)
    return (
      <>
        <Header/>
        <main className="archives">
          <h1 className="page-title">{categoryTitle}まとめ {date}</h1>
          <Content content={post.content}/>
          <SubscribeSection category={category} />
        </main>
      </>
    )
  }
}
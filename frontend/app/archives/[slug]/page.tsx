import fs from "fs"
import matter from "gray-matter"
import Header from "@/components/header"
import SubscribeSection from "@/components/subscribeSection"
import Content from "./content"

const getArticleContent = (slug: string) => {
  const folder = "articles/"
  const file = `${folder}${slug}.md`
  const content = fs.readFileSync(file, "utf8")
  const matterResult = matter(content)
  return matterResult
}

export default function Article (props: any) {
  const slug = props.params.slug
  const post = getArticleContent(slug)
  return (
    <>
      <Header/>
      <main className="archives">
        <h1 className="page-title">TiRO テック {slug}</h1>
        <Content content={post.content}/>
        <SubscribeSection/>
      </main>
    </>
  )
}
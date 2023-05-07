import ArticleLink from '@/components/articleLink'
import Header from '@/components/header'
import SubscribeForm from '@/components/subscribeForm'
import getArticlesMetadata from '@/functions/getArticlesMetadata'

export default function Archives() {

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

  const articlesMetadata = getArticlesMetadata();
  const articleLinks = articlesMetadata.map((metadata) => (
    <ArticleLink key={metadata.slug} {...metadata} />
  )).reverse();

  return (
    <>
      <Header/>
      <main className="grow">
        <h1 className="page-title">過去のメルマガ 一覧</h1>
        {emojis}
        {introText}
        <SubscribeForm />
        <div className="py-16">{articleLinks}</div>
      </main>
    </>
  )
}

import Link from 'next/link'
import Header from '@/components/header'
import SubscribeSection from '@/components/subscribeSection'

export default function ArchivesTech() {

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

  const cagegoryLinks = (
    <div className="py-16">
      <article className="pb-4">
        <Link href={`archives/tech`} className="underline">テックまとめ</Link>
      </article>
      <article className="pb-4">
        <Link href={`archives/web`} className="underline">Web制作・Web開発まとめ</Link>
      </article>
      <article className="pb-4">
        <Link href={`archives/ai`} className="underline">AIまとめ</Link>
      </article>
    </div>
  )

  return (
    <>
      <Header/>
      <main className="grow">
        <h1 className="page-title">過去のまとめ カテゴリ一覧</h1>
        {emojis}
        {introText}
        <SubscribeSection category={"tech"} />
        {cagegoryLinks}
      </main>
    </>
  )
}

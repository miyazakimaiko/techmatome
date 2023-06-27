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
    <div className="text-center pb-3 sm:leading-7">
      <p>
        無料でサクッと読める、<br/>Geek・エンジニアのためのメルマガ📩
        <br/>英語の最新記事やブログを翻訳、要約して毎朝お届けします🎁
      </p>
    </div>
  )

  const cagegoryLinks = (
    <div className="py-16">
      <article className="pb-4">
        <Link href={`archives/tech`} className="underline">テクノロジー全般まとめ</Link>
      </article>
      {/* <article className="pb-4">
        <Link href={`archives/web`} className="underline">Web制作・Web開発まとめ</Link>
      </article> */}
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

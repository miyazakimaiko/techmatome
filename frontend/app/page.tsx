import SubscribeSection from '@/components/subscribeSection'

export default function Home() {

  const title = (
    <div className="flex flex-col items-center justify-between pt-4 sm:pt-8">
      <h1 className="text-3xl font-semibold mb-4">
        Techまとめ
      </h1>
      <p className="text-sm pt-2">毎朝5分でサクッと読む最新情報</p>
    </div>
  )

  const emojis = (
    <div className="w-full max-w-[300px] m-auto flex justify-evenly text-4xl py-10">
      <div className="animate-bounce">⏱</div>
      <span className="animate-bounce animation-bounce-delay">📱</span>
      <span className="animate-bounce">👨🏻‍💻</span>
      <span className="animate-bounce animation-bounce-delay">💡</span>
    </div>
  )

  const introText = (
    <div className="text-center">
      <p className="pb-4">
        最新情報をもっと手軽に読みたい人、<br/>
        情報過多に疲れた人のための<br/>
        完全無料テックメルマガ📩
      </p>
      <p className="pb-4">
        テクノロジー、プログラミング、<br/>
        AIに関する英語の最新記事やブログを<br/>
        「翻訳」「要約」して毎朝お届けします🎁
      </p>
    </div>
  )

  return (
    <main>
      {title}
      {emojis}
      {introText}
      <SubscribeSection />
    </main>
  )
}

import SubscribeForm from '@/components/subscribeForm'
import Image from 'next/image'

export default function Home() {

  const title = (
    <div className="flex flex-col items-center justify-between pt-8">
      <h1>
        <Image
          src="/tiro-logo.svg"
          alt="TiRO｜Geekのためのメルマガ｜毎朝５分のインプット"
          className=""
          width={130}
          height={24}
          priority
        />
      </h1>
      <p className="text-xs pt-2">毎朝５分のインプット</p>
    </div>
  )

  const introText = (
    <div className="text-center py-10 leading-8 sm:leading-9">
      <p className="pb-6">
        最新記事を読む時間がない。<strong>英語だと尚更。</strong><br/>TiROは、そんな<strong>Geekのための無料メルマガ</strong>です。
      </p>
      <p>
        テクノロジーやプログラミングに関する<br/>興味深い記事を<strong>要約・翻訳</strong>して 毎朝お届けします。
      </p>
    </div>
  )

  return (
    <main>
      {title}
      {introText}
      <SubscribeForm />
    </main>
  )
}

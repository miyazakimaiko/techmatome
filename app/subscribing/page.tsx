"use client"
import Link from "next/link"
import Image from "next/image"
import { BaseSyntheticEvent, useState } from "react"
import { useSearchParams } from "next/navigation"
import addSubscriber from "@/helpers/addSubscriber"
import { Subscriber } from "@/interfaces/subscriber"

export default function Subscribing() {
  const searchParams = useSearchParams()
  const email = searchParams.get("email")
  const [subscribeToWeb, setSubscribeToWeb] = useState(false)
  const [subscribeToAi, setSubscribeToAi] = useState(false)
  const [processing, setProcessing] = useState(false)
  const [error, setError] = useState(true)

  const subscribe = (event: BaseSyntheticEvent) => {
    event.preventDefault()
    try {
      setProcessing(true)
      addSubscriber({
        email,
        web: subscribeToWeb,
        ai: subscribeToAi,
      } as Subscriber)
    } catch (e: any) {
      setError(true)
    }
  }

  const selections = (
    <div className="max-w-[200px] mx-auto my-8">
      <input type="checkbox" id="box-1" checked disabled/>
      <label htmlFor="box-1">テクノロジー全般 💻</label>
      <input 
        type="checkbox" 
        id="box-2"
        disabled={processing}
        onChange={e => setSubscribeToWeb(e.target.checked)}
      />
      <label htmlFor="box-2">Web制作・Web開発 👨‍💻</label>
      <input 
        type="checkbox"
        id="box-3"
        disabled={processing}
        onChange={e => setSubscribeToAi(e.target.checked)}
      />
      <label htmlFor="box-3">AI・機械学習 🧠</label>
    </div>
  )

  const submitSection = (
    <>
      <div className={error ? "hidden" : "block"}>
        <button 
          type="submit" 
          title="登録" 
          className="subscribe-button mx-auto min-w-[123.4px]"
          disabled={processing}
          onClick={subscribe}
        >
          {processing 
            ? (
              <>
                <Image
                  src="/processing.svg"
                  alt="processing"
                  className="animate-spin mr-1"
                  width={16}
                  height={16}
                /> <>登録しています…</>
              </>
            ) : `登録を完了する`}
        </button>
      </div>
      <div className={error ? " block" : " hidden"}>
        <div className="text-red-600 font-semibold pb-4">
          登録に失敗しました。メールアドレスを今一度ご確認の上、後ほど再度登録をお願いいたします。
        </div>
        <Link href="/" className="underline">戻る</Link>
      </div>
    </>
  )

  return (
    <>
      <main>
        <h1 className="page-title">受け取るメルマガのカテゴリを追加しませんか？</h1>
        <p>テクノロジー全般のほか、特定のジャンルに絞ったメルマガも配信しています。</p>
        {selections}
        {submitSection}
      </main>
    </>
  )
}
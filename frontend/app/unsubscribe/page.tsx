"use client"
import { BaseSyntheticEvent, useEffect, useRef, useState } from "react"
import { useSearchParams } from "next/navigation"
import unsubscribe from "@/functions/unsubscribe"
import Header from "@/components/header"

const CATEGORY = Object.freeze({
  ALL: "all",
  TECH: "tech",
  WEB: "web",
  AI: "ai",
})

export default function Unsbscribe() {
  const searchParams = useSearchParams()
  const e = searchParams.get("e")
  const c = searchParams.get("c")
  const category = searchParams.get("category")

  const form = useRef<HTMLFormElement>(null)
  const [processing, setProcessing] = useState(false)
  const [completed, setCompleted] = useState(false)
  const [error, setError] = useState(false)
  const [categoryName, setCategoryName] = useState("")

  useEffect(() => {
    if (category === CATEGORY.ALL) {
      setCategoryName("すべて")
    }
    else if (category === CATEGORY.TECH) {
      setCategoryName("テックまとめ")
    }
    else if (category === CATEGORY.WEB) {
      setCategoryName("WEB制作・開発まとめ")
    }
    else if (category === CATEGORY.AI) {
      setCategoryName("AIまとめ")
    }
  }, [category])
  

  async function submit(event: BaseSyntheticEvent) {
    event.preventDefault()    
    if (e && c) {
      setProcessing(true)
      const res = await unsubscribe(e, c)
      if (res.success) {
        setCompleted(true)
      } else {
        setError(true)
      }
      setProcessing(false)
    }
    else setError(true)
  }  

  if (!e || !c) {
    return (
      <main>
        <p>404</p>
      </main>
    )
  }
  
  return (
    <>
      <Header />
      <main className="grow">
      { processing 
        ? <p>登録を解除しています…</p>
        : completed
          ? <p>登録を解除しました。</p>
          : error 
            ? <p>エラーが発生しました。お手数をおかけしますが、再度後ほど解除していただくか、miyazaki@techmatome.comにご連絡ください。</p>
            : <form 
                ref={form} 
                action="/subscribing" 
                method="get" 
                className="flex justify-center"
              >
                <div>
                  <button type="submit" onClick={submit} className="subscribe-button">
                    {categoryName}の登録を解除する
                  </button>
                </div>
              </form>
      }
      </main>
    </>
  )
}
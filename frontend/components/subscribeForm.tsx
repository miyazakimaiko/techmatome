"use client"
import { BaseSyntheticEvent, useRef, useState } from "react"
import validateEmail from "@/functions/validateEmail"

export default function SubscribeForm() {
  const form = useRef<HTMLFormElement>(null)
  const email = useRef<HTMLInputElement>(null)
  const [error, setError] = useState(false)

  function submit(event: BaseSyntheticEvent) {
    event.preventDefault()

    if (email.current && form.current) {
      validateEmail(email.current.value).then(
        () => form.current?.submit(),
        () => setError(true)
      )
    }
  }
  
  return (
    <>
      {error 
        ? <span className="text-sm text-[red]">正しいメールアドレスを入力してください。</span> 
        : null
      }
      <form 
        ref={form} 
        action="/subscribing" 
        method="get" 
        className="flex justify-center"
      >
        <input 
          required
          id="email"
          type="email"
          name="email"
          ref={email}
          onChange={() => setError(false)}
          placeholder="メールアドレス" 
          className="w-full max-w-xs bg-gray-50 text-gray-800 border border-black py-1 px-1 mr-2 leading-tight focus:outline-none focus:bg-white"
        />
        <div>
          <button type="submit" onClick={submit} className="subscribe-button">
            登録する
          </button>
        </div>
      </form>
    </>
  )
}
import Link from "next/link"
import getLatestArticleSlug from "@/helpers/getLatestArticleSlug"

export default function SubscribeForm() {
  const latestArticleSlug = getLatestArticleSlug();

  // call API to find user

  return (
    <>
      <form action="/subscribing" method="get" className="flex justify-center">
        <input 
          required
          id="email"
          type="email"
          name="email"
          placeholder="メールアドレス" 
          className="w-full max-w-xs bg-gray-50 text-gray-800 border border-black py-1 px-1 mr-2 leading-tight focus:outline-none focus:bg-white"
        />
        <div>
          <button type="submit" className="subscribe-button">
            登録する
          </button>
        </div>
      </form>
      <span className="text-sm pt-2">
        <Link href={`archives/${latestArticleSlug}`} className="underline">毎朝4000人が読むメール</Link>を受け取る📩
      </span>
    </>
  )
}
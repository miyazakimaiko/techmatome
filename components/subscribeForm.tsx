import getLatestArticleSlug from "@/functions/getLatestArticleSlug"
import Link from "next/link";

export default function SubscribeForm() {

  const latestArticleSlug = getLatestArticleSlug();

  return (
    <>
      <form action="" className="flex justify-center">
        <input 
          type="email" 
          id="email" 
          placeholder="メールアドレス" 
          className="w-full max-w-xs bg-gray-50 text-gray-800 border border-black py-1 px-1 mr-2 leading-tight focus:outline-none focus:bg-white"
        />
        <button type="submit" className="subscribe-button">登録する</button>
      </form>
      <span className="text-sm pt-2">
        <Link href={`archives/${latestArticleSlug}`} className="underline">毎朝4000人が読むメール</Link>を受け取る📩
      </span>
    </>
  )
}
import Link from "next/link"
import getLatestArticleSlug from "@/functions/getLatestArticleSlug"
import SubscribeForm from "./subscribeForm"

export default function SubscribeSection() {
  const latestArticleSlug = getLatestArticleSlug()

  return (
    <>
      <SubscribeForm />
      <span className="text-sm pt-2">
        <Link href={`archives/${latestArticleSlug}`} className="underline">毎朝4000人が読むメール</Link>を受け取る📩
      </span>
    </>
  )
}
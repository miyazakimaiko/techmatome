"use client"
import Markdown from "markdown-to-jsx"
import { useLayoutEffect } from "react"

export default function Content(props: any) {
  const content = props.content

  // * To force open links in new tab
  useLayoutEffect(() => {
    const article = document.getElementsByTagName('article')[0]
    const links = article.getElementsByTagName('a')
    for (let link of links) {
      link.target = "_blank"
    }
  }, [])

  return (
    <>
      <article className="text-left">
        <Markdown>{content}</Markdown>
      </article>
    </>
  )
}
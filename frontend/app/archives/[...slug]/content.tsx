"use client"
import Markdown from "markdown-to-jsx"

export default function Content(props: any) {
  const content = props.content

  return (
    <>
      <article className="text-left">
        <Markdown>{content}</Markdown>
      </article>
    </>
  )
}
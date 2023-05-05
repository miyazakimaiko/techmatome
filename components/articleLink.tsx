import Link from "next/link";
import { ArticleMetadata } from "@/interfaces/ArticleMetadata";


export default function ArticleLink(props: ArticleMetadata) {
  return (
    <article className="pb-4">
      <Link href={`archives/${props.slug}`} className="underline">{props.title}</Link>
    </article>
  )
}
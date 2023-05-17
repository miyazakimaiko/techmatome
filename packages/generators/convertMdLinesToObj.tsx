import { Article, Contents, Metadata, Section } from "core/interfaces"
import * as readline from "readline"

export default function convertMdLinesToObject (contentLine: readline.Interface): Promise<Contents> {

  let isMetadata = false

  const metadata = {
    subject: "",
    category: "",
    date: "",
  } as Metadata

  const contents = {
    metadata: metadata,
    sections: [] as Section[]
  } as Contents

  const section = {
    heading: "",
    articles: [] as Article[]
  } as Section

  const article = {
    heading: "",
    paragraph: "",
  } as Article

  return new Promise((resolve, reject) => {
    contentLine.on('line', (l: string) => {
      const line = l.trimStart()
  
      if (line === "---") {
        isMetadata = !isMetadata
      }
      else if (isMetadata) {

        if (line.slice(0, 8) === "subject:") {
          contents.metadata.subject = line.slice(8)
        }
        else if (line.slice(0, 9) === "category:") {
          contents.metadata.category = line.slice(9)
        }
        else if (line.slice(0, 5) === "date:") {
          contents.metadata.date = line.slice(5)
        }
      }
      else {
        contents.metadata = metadata
  
        if (line.slice(0, 2) === "# ") {
          if (section.heading.length !== 0) {
            section.articles.push({...article})
            contents.sections.push({...section})
          }
          section.heading = line.slice(2)
          section.articles = []
          article.heading = ""
          article.paragraph = ""
        }
        else if (line.slice(0, 3) === "## ") {
          if (article.heading.length !== 0) {
            section.articles.push({...article})
          }
          article.heading = line.slice(3)
          article.paragraph = ""
        }
        else if (line !== "") {
          article.paragraph = line
        }
      }
    })
    contentLine.on('error', (error) => {
      reject(error)
    })
    contentLine.on('close', function () {
      console.log("close")
      section.articles.push({...article})
      contents.sections.push({...section})
      resolve(contents)
    })
  })
}
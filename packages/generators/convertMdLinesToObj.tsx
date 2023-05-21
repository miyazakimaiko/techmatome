import { Article, Contents, Metadata, Section } from "core/interfaces"
import * as readline from "readline"

export default function convertMdLinesToObject (dateString: string, categoryString:string, contentLine: readline.Interface)
  : Promise<Contents> {

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
    icon: "",
    heading: "",
    articles: [] as Article[]
  } as Section

  const article = {
    heading: "",
    paragraph: "",
  } as Article

  return new Promise((resolve, reject) => {
    contentLine.on('line', (l: string) => {
      try {
        const line = l.trimStart()
    
        if (line === "---") {
          isMetadata = !isMetadata
        }
        else if (isMetadata) {
  
          if (line.slice(0, 8) === "subject:") {
            contents.metadata.subject = line.slice(8).trimStart()
          }
          else if (line.slice(0, 9) === "category:") {
            const categoryInLine = line.slice(9).trimStart().trimEnd()

            if (categoryString !== categoryInLine) {
              throw new Error(`Category in metadata 
                (${categoryInLine}) and uploaded S3 bucket does not match.`)
            }
            contents.metadata.category 
              = categoryInLine === "tech" ? "テック"
              : categoryInLine === "web" ? "Web"
              : categoryInLine === "ai" ? "AI"
              : ""
            if (contents.metadata.category === "") {
              throw new Error(`Category in metadata is 
                not one of the following: "tech", "web", or "ai"`)
            }
          }
          else if (line.slice(0, 5) === "date:") {
            if (dateString !== line.slice(5).trimStart()) {
              throw new Error("File name date and metadata date does not match.")
            }
            contents.metadata.date = line.slice(5).trimStart()
          }
        }
        else {
          contents.metadata = metadata
    
          if (line.slice(0, 6) === "<icon>") {
            if (section.heading.length !== 0) {
              section.articles.push({...article})
              contents.sections.push({...section})
            }
            section.icon = line.slice(6)
            section.heading = ""
            section.articles = []
            article.heading = ""
            article.paragraph = ""
          }
          else if (line.slice(0, 2) === "# ") {
            section.heading = line.slice(2)
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
      } catch (error) {
        reject(error)
      }
    })
    contentLine.on('error', (error) => {
      reject(error)
    })
    contentLine.on('close', function () {
      section.articles.push({...article})
      contents.sections.push({...section})
      resolve(contents)
    })
  })
}
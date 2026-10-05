// entities/doc の窓口（Public API）
export {
  allDocs,
  docBooks,
  docUrl,
  findBook,
  findDoc,
  type Doc,
  type DocBook,
} from "./model/docs";
export { getToc, splitSections, type Section } from "./model/sections";
export { MarkdownView } from "./ui/MarkdownView";

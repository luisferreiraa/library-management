import { BookData } from "@/types/book";

export function parseXML(xmlString: string): BookData | null {
    try {
        // Verificar se a string é XML
        if (!xmlString.includes("<dc") && !xmlString.includes("<?xml")) {
            console.error("A string não parece ser XML:", xmlString)
            return null
        }

        // Extrair dados utilizando expressões regulares como fallback
        const extractTag = (tag: string): string[] => {
            const regex = new RegExp(`<(dc:)?${tag}[^>]*>(.*?)</(dc:)?${tag}>`, "g")
            const matches: string[] = []
            let match

            while ((match = regex.exec(xmlString)) !== null) {
                matches.push(match[2])
            }

            return matches
        }

        const title = extractTag("title")[0] || ""
        const creator = extractTag("creator")[0] || ""
        const subject = extractTag("subject")[0] || ""
        const description = extractTag("description")
        const publisher = extractTag("publisher")
        const contributor = extractTag("contributor")
        const date = extractTag("date")[0] || ""
        const type = extractTag("type")[0] || ""
        const format = extractTag("format")[0] || ""
        const identifier = extractTag("identifier")
        const language = extractTag("language")[0] || ""

        return {
            title,
            creator,
            subject,
            description,
            publisher,
            contributor,
            date,
            type,
            format,
            identifier,
            language,
        }
    } catch (error) {
        console.error("Erro ao fazer parsing do XML:", error)
        return null
    }
}
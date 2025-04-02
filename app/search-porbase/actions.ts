"use server"

import { createAuthor, getAuthorByName } from "@/lib/authors"
import { Book, createBook } from "@/lib/books"
import { createFormat, getFormatByName } from "@/lib/formats"
import { createLanguage, getLanguageByName } from "@/lib/languages"
import { createPublisher, getPublisherByName } from "@/lib/publishers"
import type { BookData } from "@/types/book"
import { getDate, getTime } from "date-fns"
import { now } from "lodash"

export async function searchByISBN(isbn: string): Promise<BookData | string> {
    const cleanedISBN = isbn.replace(/[^0-9]/g, "")

    if (!cleanedISBN || cleanedISBN.length < 10) {
        throw new Error("ISBN inválido")
    }

    try {
        // Usando nossa rota de API local
        const url = `http://localhost:3000/api/isbn?isbn=${cleanedISBN}`

        const response = await fetch(url, {
            cache: "no-store",
            next: { revalidate: 0 },
        })

        if (!response.ok) {
            const errorData = await response.json().catch(() => null)
            throw new Error(errorData?.error || `Erro na API: ${response.status}`)
        }

        const xmlData = await response.text()

        if (!xmlData || xmlData.trim() === "") {
            throw new Error("A API retornou um resultado vazio.")
        }

        // Retornar o XML para processamento no cliente
        return xmlData
    } catch (error: any) {
        console.error("Erro ao buscar dados:", error)
        throw new Error(error.message || "Falha ao buscar informações do livro")
    }
}

export async function createBookWithSearchElements(searchedBook: BookData): Promise<Book> {

    // Verifica e cria o autor, se necessário
    let author = await getAuthorByName(searchedBook.creator);
    if (!author) {
        author = await createAuthor({
            name: searchedBook.creator,
            email: "autor@email.com",
            isActive: true
        });
    }

    // Verifica e cria a editora, se necessário
    let publisher = await getPublisherByName(searchedBook.publisher[0])
    if (!publisher) {
        publisher = await createPublisher({
            name: searchedBook.publisher[0],
            isActive: true
        })
    }

    // Verifica e cria o idioma, se necessário
    let language = await getLanguageByName(searchedBook.language)
    if (!language) {
        language = await createLanguage({
            name: searchedBook.language,
            isActive: true
        })
    }

    // Verifica e cria o formato, se necessário
    let format = await getFormatByName(searchedBook.format)
    if (!format) {
        format = await createFormat({
            name: searchedBook.format,
            isActive: true
        })
    }

    // Cria o livro com os Ids Obtidos
    return createBook({
        title: searchedBook.title,
        isbn: searchedBook.identifier[1],
        publishingDate: new Date(),
        edition: 1,
        pageCount: 100,
        formatId: format.id,
        languageId: language.id,
        publisherId: publisher.id,
        authorId: author.id,
        bookStatusId: "cm8eppzxx0003vy1omjluen6e",
        categoryIds: ["cm8bhvmxv0001vyo8bu189ee6"],
        createdByUserId: "cm8fu1vzg0000vybk77k3bck0",
    })
}


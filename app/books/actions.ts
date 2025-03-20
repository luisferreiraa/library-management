"use server"

import { revalidatePath } from "next/cache"
import { createBook, deleteBooks } from "@/lib/books"
import { uploadCoverImage } from "@/lib/upload"
import { createBarcode } from "@/lib/barcodes"

export async function uploadCoverImageAction(formData: FormData): Promise<string> {
    try {
        const file = formData.get("file") as File

        if (!file) {
            throw new Error("Nenhum arquivo enviado")
        }

        const imageUrl = await uploadCoverImage(file)
        return imageUrl
    } catch (error: any) {
        throw new Error(error.message || "Erro ao fazer upload da imagem")
    }
}

export async function createBookAction(bookData: {
    title: string
    isbn: string
    publishingDate: Date
    edition: number
    summary?: string
    coverImage?: string
    pageCount: number
    formatId: string
    languageId: string
    publisherId: string
    authorId: string
    translatorId?: string
    bookStatusId: string
    categoryIds: string[]
}): Promise<any> {
    try {
        // Criar o livro no banco de dados sem referência ao usuário atual
        const newBook = await createBook({
            ...bookData,
            // Quando implementar autenticação, você pode adicionar createdByUserId aqui
        })

        // Revalidar o caminho para atualizar os dados
        revalidatePath("/books")

        return newBook
    } catch (error: any) {
        // Verificar se é um erro de ISBN duplicado
        if (error.code === "P2002" && error.meta?.target?.includes("isbn")) {
            throw new Error("Este ISBN já está registado")
        }

        throw new Error("Erro ao criar livro: " + error.message)
    }
}

export async function deleteBooksAction(bookIds: string[]): Promise<void> {
    try {
        // Excluir os livros do banco de dados
        await deleteBooks(bookIds)

        // Revalidar o caminho para atualizar os dados
        revalidatePath("/books")
    } catch (error: any) {
        throw new Error("Erro ao excluir livros: " + error.message)
    }
}

export async function createBarcodeAction(barcodeData: { bookId: string; code: string }): Promise<any> {
    try {
        const newBarcode = await createBarcode(barcodeData.bookId, barcodeData.code);

        revalidatePath(`/books/${barcodeData.bookId}`);

        return newBarcode;
    } catch (error: any) {
        if (error.code === "P2002" && error.meta?.target?.includes("code")) {
            throw new Error("Este código de barras já está registado");
        }

        throw new Error("Erro ao criar código de barras: " + error.message);
    }
}



"use server"

import { revalidatePath } from "next/cache"
import { Book, BookWithRelations, createBook, deleteBooks, updateBookIsActive } from "@/lib/books"
import { uploadCoverImage } from "@/lib/upload"
import { createBarcode } from "@/lib/barcodes"
import { logAudit } from "@/lib/session"
import prisma from "@/lib/prisma"

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

        // Criar auditLog
        await logAudit("Book", newBook.id, "CREATE_BOOK");

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

type UpdateBookInput = Partial<Book> & {
    id: string
    categoryIds?: string[]
}

export async function updateBookAction(bookData: UpdateBookInput): Promise<BookWithRelations> {
    try {
        const { id, categoryIds, ...rest } = bookData

        const updatedBook = await prisma.book.update({
            where: { id },
            data: {
                ...rest,
                ...(categoryIds && {
                    categories: {
                        set: [], // limpar categorias existentes
                        connect: categoryIds.map((categoryId) => ({ id: categoryId })),
                    },
                }),
            },
            include: {
                author: true,
                publisher: true,
                format: true,
                language: true,
                translator: true,
                bookStatus: true,
                categories: true,
                barcodes: true,
                reviews: true
            },
        })

        revalidatePath("/books")
        revalidatePath(`/books/${id}`)

        return updatedBook
    } catch (error) {
        console.error("Erro ao atualizar livro:", error)
        throw new Error("Falha ao atualizar o livro. Por favor, tente novamente.")
    }
}

export async function updateBookIsActiveAction(bookId: string, isActive: boolean) {
    try {
        await updateBookIsActive(bookId, isActive)

        revalidatePath(`/books/${bookId}`)

        return { success: true }
    } catch (error) {
        console.error("Erro ao atualizar status do livro:", error)
        throw new Error("Falha ao atualizar o status do livro. Por favor, tente novamente.")
    }

}

export async function deleteBooksAction(bookIds: string[]): Promise<void> {
    try {

        // Excluir os livros do banco de dados
        await deleteBooks(bookIds);

        // Criar auditLog para cada livro removido
        await logAudit("Book", bookIds, "DELETE_BOOK");

        // Revalidar o caminho para atualizar os dados
        revalidatePath("/books");
    } catch (error: any) {
        throw new Error("Erro ao excluir livros: " + error.message);
    }
}

export async function createBarcodeAction(barcodeData: { bookId: string; code: string }): Promise<any> {
    try {
        // Criar novo barcode
        const newBarcode = await createBarcode(barcodeData.bookId, barcodeData.code);

        // Criar auditLog
        await logAudit("Barcode", newBarcode.id, "CREATE_BARCODE");

        // Revalidar o caminho para atualizar os dados
        revalidatePath(`/books/${barcodeData.bookId}`);

        return newBarcode;
    } catch (error: any) {
        if (error.code === "P2002" && error.meta?.target?.includes("code")) {
            throw new Error("Este código de barras já está registado");
        }

        throw new Error("Erro ao criar código de barras: " + error.message);
    }
}


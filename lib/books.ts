"use server"

import { prisma } from "./prisma"
import type { Book as PrismaBook, Prisma } from "@prisma/client"

export type Book = PrismaBook
export type BookWithRelations = Prisma.BookGetPayload<{
    include: {
        author: true
        publisher: true
        language: true
        format: true
        translator: true
        bookStatus: true
        categories: true
        barcodes: true
        reviews: true
    }
}>

export async function getBooks(): Promise<BookWithRelations[]> {
    return prisma.book.findMany({
        orderBy: {
            createdAt: "desc",
        },
        include: {
            author: true,
            publisher: true,
            language: true,
            format: true,
            translator: true,
            bookStatus: true,
            categories: true,
            reviews: {
                where: {
                    isActive: true
                },
            },
            barcodes: {
                where: {
                    isActive: true,
                },
            },
        },
    })
}

export async function getBookById(id: string): Promise<BookWithRelations | null> {
    return prisma.book.findUnique({
        where: { id },
        include: {
            author: true,
            publisher: true,
            language: true,
            format: true,
            translator: true,
            bookStatus: true,
            categories: true,
            barcodes: {
                where: {
                    isActive: true,
                },
            },
            reviews: {
                where: {
                    isActive: true,
                    isAproved: true,
                },
                include: {
                    user: true,
                },
            },
        },
    })
}

export async function getBooksByAuthorId(authorId: string): Promise<BookWithRelations[]> {
    return prisma.book.findMany({
        where: { authorId },
        orderBy: {
            createdAt: "desc",
        },
        include: {
            author: true,
            publisher: true,
            language: true,
            format: true,
            translator: true,
            bookStatus: true,
            categories: true,
            barcodes: {
                where: {
                    isActive: true,
                },
            },
            reviews: true,
        },
    })
}

export async function createBook(data: {
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
    createdByUserId?: string
}): Promise<Book> {
    return prisma.book.create({
        data: {
            title: data.title,
            isbn: data.isbn,
            publishingDate: data.publishingDate,
            edition: data.edition,
            summary: data.summary,
            coverImage: data.coverImage,
            pageCount: data.pageCount,
            format: {
                connect: { id: data.formatId },
            },
            language: {
                connect: { id: data.languageId },
            },
            publisher: {
                connect: { id: data.publisherId },
            },
            author: {
                connect: { id: data.authorId },
            },
            ...(data.translatorId
                ? {
                    translator: {
                        connect: { id: data.translatorId },
                    },
                }
                : {}),
            bookStatus: {
                connect: { id: data.bookStatusId },
            },
            categories: {
                connect: data.categoryIds.map((id) => ({ id })),
            },
            ...(data.createdByUserId
                ? {
                    createdByUser: {
                        connect: { id: data.createdByUserId },
                    },
                }
                : {}),
        },
    })
}

export async function updateBook(
    id: string,
    data: {
        title?: string
        isbn?: string
        publishingDate?: Date
        edition?: number
        summary?: string
        coverImage?: string
        pageCount?: number
        formatId?: string
        languageId?: string
        publisherId?: string
        authorId?: string
        translatorId?: string | null
        bookStatusId?: string
        categoryIds?: string[]
        updatedByUserId?: string
        isActive?: boolean
    },
): Promise<Book> {
    // Preparar os dados para atualização
    const updateData: any = { ...data }

    // Remover os IDs e preparar os connects
    if (data.formatId) {
        updateData.format = { connect: { id: data.formatId } }
        delete updateData.formatId
    }

    if (data.languageId) {
        updateData.language = { connect: { id: data.languageId } }
        delete updateData.languageId
    }

    if (data.publisherId) {
        updateData.publisher = { connect: { id: data.publisherId } }
        delete updateData.publisherId
    }

    if (data.authorId) {
        updateData.author = { connect: { id: data.authorId } }
        delete updateData.authorId
    }

    if (data.translatorId === null) {
        updateData.translator = { disconnect: true }
        delete updateData.translatorId
    } else if (data.translatorId) {
        updateData.translator = { connect: { id: data.translatorId } }
        delete updateData.translatorId
    }

    if (data.bookStatusId) {
        updateData.bookStatus = { connect: { id: data.bookStatusId } }
        delete updateData.bookStatusId
    }

    if (data.updatedByUserId) {
        updateData.updatedByUser = { connect: { id: data.updatedByUserId } }
        delete updateData.updatedByUserId
    }

    // Atualizar categorias se fornecidas
    if (data.categoryIds) {
        // Primeiro, desconectar todas as categorias existentes
        // Depois, conectar as novas categorias
        const book = await prisma.book.findUnique({
            where: { id },
            include: { categories: true },
        })

        if (book) {
            updateData.categories = {
                disconnect: book.categories.map((category) => ({ id: category.id })),
                connect: data.categoryIds.map((id) => ({ id })),
            }
        }

        delete updateData.categoryIds
    }

    return prisma.book.update({
        where: { id },
        data: updateData,
    })
}

export async function deleteBook(id: string): Promise<Book> {
    return prisma.book.delete({
        where: { id },
    })
}

export async function deleteBooks(ids: string[]): Promise<number> {
    const result = await prisma.book.deleteMany({
        where: {
            id: {
                in: ids,
            },
        },
    })

    return result.count
}

// Funções auxiliares para obter dados relacionados
export async function getFormats() {
    return prisma.format.findMany({
        where: { isActive: true },
        orderBy: { name: "asc" },
    })
}

export async function getLanguages() {
    return prisma.language.findMany({
        where: { isActive: true },
        orderBy: { name: "asc" },
    })
}

export async function getPublishers() {
    return prisma.publisher.findMany({
        where: { isActive: true },
        orderBy: { name: "asc" },
    })
}

export async function getCategories() {
    return prisma.category.findMany({
        where: { isActive: true },
        orderBy: { name: "asc" },
    })
}

export async function getTranslators() {
    return prisma.translator.findMany({
        where: { isActive: true },
        orderBy: { name: "asc" },
    })
}

export async function getBookStatuses() {
    return prisma.bookStatus.findMany({
        where: { isActive: true },
        orderBy: { name: "asc" },
    })
}


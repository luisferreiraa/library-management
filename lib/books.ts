import { prisma } from "./prisma"
import type { Book as PrismaBook } from "@prisma/client"

export type Book = PrismaBook

export async function getBooksByAuthorId(authorId: string): Promise<Book[]> {
    return prisma.book.findMany({
        where: { authorId },
        orderBy: {
            createdAt: "desc",
        },
    })
}

export async function getBookById(id: string): Promise<Book | null> {
    return prisma.book.findUnique({
        where: { id },
    })
}

export async function createBook(data: {
    title: string
    description?: string
    coverImage?: string
    publishedAt?: Date
    authorId: string
}): Promise<Book> {
    return prisma.book.create({
        data,
    })
}

export async function updateBook(
    id: string,
    data: {
        title?: string
        description?: string
        coverImage?: string
        publishedAt?: Date
    },
): Promise<Book> {
    return prisma.book.update({
        where: { id },
        data,
    })
}

export async function deleteBook(id: string): Promise<Book> {
    return prisma.book.delete({
        where: { id },
    })
}


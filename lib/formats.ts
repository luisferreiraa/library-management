import { prisma } from "./prisma"
import type { Format as PrismaFormat, Book as PrismaBook, Prisma } from "@prisma/client"
import slugify from "slugify"

export type Format = PrismaFormat
export type Book = PrismaBook

export type FormatWithBooks = Prisma.FormatGetPayload<{
    include: {
        books: {
            include: {
                author: true
                translator: true
                language: true
                bookStatus: true
                barcodes: true
                publisher: true
                categories: true
            }
        }
    }
}>

export async function getFormats(): Promise<Format[]> {
    return prisma.format.findMany({
        orderBy: {
            createdAt: "desc",
        },
    })
}

export async function getFormatById(id: string): Promise<Format | null> {
    return prisma.format.findUnique({
        where: { id },
    })
}

export async function getFormatWithBooks(slug: string): Promise<FormatWithBooks | null> {
    return prisma.format.findUnique({
        where: { slug },
        include: {
            books: {
                include: {
                    author: true,
                    translator: true,
                    language: true,
                    bookStatus: true,
                    barcodes: {
                        where: {
                            isActive: true,
                        },
                    },
                    publisher: true,
                    categories: true,
                },
            },
        },
    });
}

export async function createFormat(data: { name: string, isActive: boolean }): Promise<Format> {
    const slug: string = slugify(data.name, { lower: true });

    return prisma.format.create({
        data: {
            ...data,
            slug,
        },
    });
}

export async function updateFormat(id: string, data: { name?: string, isActive?: boolean }): Promise<Format> {
    let updateData: { name?: string; isActive?: boolean; slug?: string } = { ...data };

    if (data.name) {
        updateData.slug = slugify(data.name, { lower: true });
    }

    return prisma.format.update({
        where: { id },
        data: updateData,
    });
}

export async function deleteFormat(id: string): Promise<Format> {
    return prisma.format.delete({
        where: { id },
    });
}

export async function deleteFormats(ids: string[]): Promise<number> {
    const result = await prisma.format.deleteMany({
        where: {
            id: {
                in: ids,
            },
        },
    })

    return result.count
}
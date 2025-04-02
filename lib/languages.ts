import { prisma } from "./prisma"
import type { Language as PrismaLanguage, Book as PrismaBook, Prisma } from "@prisma/client"
import slugify from "slugify"

export type Language = PrismaLanguage
export type Book = PrismaBook

export type LanguageWithBooks = Prisma.LanguageGetPayload<{
    include: {
        books: {
            include: {
                author: true
                format: true
                translator: true
                bookStatus: true
                barcodes: true
                publisher: true
                categories: true
            }
        }
    }
}>

export async function getLanguages(): Promise<Language[]> {
    return prisma.language.findMany({
        orderBy: {
            createdAt: "desc",
        }
    })
}

export async function getLanguagesById(id: string): Promise<Language | null> {
    return prisma.language.findUnique({
        where: { id },
    })
}

export async function getLanguageByName(name: string): Promise<Language | null> {
    return prisma.language.findFirst({
        where: { name },
    })
}

export async function getLanguageWithBooks(slug: string): Promise<LanguageWithBooks | null> {
    return prisma.language.findUnique({
        where: { slug },
        include: {
            books: {
                include: {
                    author: true,
                    format: true,
                    translator: true,
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

export async function createLanguage(data: { name: string, isActive: boolean }): Promise<Language> {
    const slug: string = slugify(data.name, { lower: true });

    return prisma.language.create({
        data: {
            ...data,
            slug,
        },
    });
}

export async function updateLanguage(id: string, data: { name?: string, isActive?: boolean }): Promise<Language> {
    let updateData: { name?: string; isActive?: boolean; slug?: string } = { ...data };

    if (data.name) {
        updateData.slug = slugify(data.name, { lower: true });
    }

    return prisma.language.update({
        where: { id },
        data: updateData,
    });
}

export async function deleteLanguage(id: string): Promise<Language> {
    return prisma.language.delete({
        where: { id },
    });
}

export async function deleteLanguages(ids: string[]): Promise<number> {
    const result = await prisma.language.deleteMany({
        where: {
            id: {
                in: ids,
            },
        },
    })

    return result.count
}


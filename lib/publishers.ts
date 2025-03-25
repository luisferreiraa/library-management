import { prisma } from "./prisma"
import type { Publisher as PrismaPublisher, Book as PrismaBook, Prisma } from "@prisma/client"
import slugify from "slugify"

export type Publisher = PrismaPublisher
export type Book = PrismaBook

export type PublisherWithBooks = Prisma.PublisherGetPayload<{
    include: {
        books: {
            include: {
                author: true
                format: true
                language: true
                translator: true
                bookStatus: true
                categories: true
                barcodes: true
            }
        }
    }
}>

export async function getPublishers(): Promise<Publisher[]> {
    return prisma.publisher.findMany({
        orderBy: {
            createdAt: "desc",
        },
    })
}

export async function getPublisherById(id: string): Promise<Publisher | null> {
    return prisma.publisher.findUnique({
        where: { id },
    })
}

export async function getPublisherWithBooks(slug: string): Promise<PublisherWithBooks | null> {
    return prisma.publisher.findUnique({
        where: { slug },
        include: {
            books: {
                orderBy: { createdAt: "desc" },
                include: {
                    author: true,
                    language: true,
                    format: true,
                    translator: true,
                    barcodes: true,
                    categories: true,
                    publisher: true,
                    bookStatus: true,
                }
            }
        },
    });
}

export async function createPublisher(data: { name: string }): Promise<Publisher> {
    const slug: string = slugify(data.name, { lower: true });

    return prisma.publisher.create({
        data: {
            ...data,
            slug,
        },
    });
}

export async function updatePublisher(id: string, data: { name?: string }): Promise<Publisher> {
    let updateData: { name?: string; slug?: string } = { ...data };

    if (data.name) {
        updateData.slug = slugify(data.name, { lower: true });
    }

    return prisma.publisher.update({
        where: { id },
        data: updateData,
    });
}

export async function deletePublisher(id: string): Promise<Publisher> {
    return prisma.publisher.delete({
        where: { id },
    });
}

export async function deletePublishers(ids: string[]): Promise<number> {
    const result = await prisma.publisher.deleteMany({
        where: {
            id: {
                in: ids,
            },
        },
    })

    return result.count
}
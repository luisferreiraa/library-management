import { prisma } from "./prisma"
import type { BookStatus as PrismaBookStatus } from "@prisma/client"
import slugify from "slugify"

export type BookStatus = PrismaBookStatus

export async function getBookStatus(): Promise<BookStatus[]> {
    return prisma.bookStatus.findMany({
        orderBy: {
            createdAt: "desc",
        },
    })
}

export async function getBookStatusById(id: string): Promise<BookStatus | null> {
    return prisma.bookStatus.findUnique({
        where: { id },
    })
}

export async function createBookStatus(data: { name: string }): Promise<BookStatus> {
    const slug: string = slugify(data.name, { lower: true });

    return prisma.bookStatus.create({
        data: {
            ...data,
            slug,
        },
    });
}

export async function updateBookStatus(id: string, data: { name?: string }): Promise<BookStatus> {
    let updateData: { name?: string; slug?: string } = { ...data };

    if (data.name) {
        updateData.slug = slugify(data.name, { lower: true });
    }

    return prisma.bookStatus.update({
        where: { id },
        data: updateData,
    });
}

export async function deleteBookStatus(id: string): Promise<BookStatus> {
    return prisma.bookStatus.delete({
        where: { id },
    });
}

export async function deleteBookStatuses(ids: string[]): Promise<number> {
    const result = await prisma.bookStatus.deleteMany({
        where: {
            id: {
                in: ids,
            },
        },
    })

    return result.count
}
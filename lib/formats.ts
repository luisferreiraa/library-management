import { prisma } from "./prisma"
import type { Format as PrismaFormat } from "@prisma/client"
import slugify from "slugify"

export type Format = PrismaFormat

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

export async function createFormat(data: { name: string }): Promise<Format> {
    const slug: string = slugify(data.name, { lower: true });

    return prisma.format.create({
        data: {
            ...data,
            slug,
        },
    });
}

export async function updateFormat(id: string, data: { name?: string }): Promise<Format> {
    let updateData: { name?: string; slug?: string } = { ...data };

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
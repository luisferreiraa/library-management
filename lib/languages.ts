import { prisma } from "./prisma"
import type { Language as PrismaLanguage } from "@prisma/client"
import slugify from "slugify"

export type Language = PrismaLanguage

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

export async function createLanguage(data: { name: string }): Promise<Language> {
    const slug: string = slugify(data.name, { lower: true });

    return prisma.language.create({
        data: {
            ...data,
            slug,
        },
    });
}

export async function updateLanguage(id: string, data: { name?: string }): Promise<Language> {
    let updateData: { name?: string; slug?: string } = { ...data };

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


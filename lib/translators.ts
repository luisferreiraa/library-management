import { prisma } from "./prisma"
import type { Translator as PrismaTranslator } from "@prisma/client"
import slugify from "slugify"

export type Translator = PrismaTranslator

export async function getTranslators(): Promise<Translator[]> {
    return prisma.translator.findMany({
        orderBy: {
            createdAt: "desc",
        },
    })
}

export async function getTranslatorById(id: string): Promise<Translator | null> {
    return prisma.translator.findUnique({
        where: { id },
    })
}

export async function createTranslator(data: { name: string }): Promise<Translator> {
    const slug: string = slugify(data.name, { lower: true });

    return prisma.translator.create({
        data: {
            ...data,
            slug,
        },
    });
}

export async function updateTranslator(id: string, data: { name?: string }): Promise<Translator> {
    let updateData: { name?: string; slug?: string } = { ...data };

    if (data.name) {
        updateData.slug = slugify(data.name, { lower: true });
    }

    return prisma.translator.update({
        where: { id },
        data: updateData,
    });
}

export async function deleteTranslator(id: string): Promise<Translator> {
    return prisma.translator.delete({
        where: { id },
    });
}

export async function deleteTranslators(ids: string[]): Promise<number> {
    const result = await prisma.translator.deleteMany({
        where: {
            id: {
                in: ids,
            },
        },
    })

    return result.count
}
import { prisma } from "./prisma"
import type { Category as PrismaCategory } from "@prisma/client"
import slugify from "slugify"

export type Category = PrismaCategory

export async function getCategories(): Promise<Category[]> {
    return prisma.category.findMany({
        orderBy: {
            createdAt: "desc",
        }
    })
}

export async function getCategoriesById(id: string): Promise<Category | null> {
    return prisma.category.findUnique({
        where: { id },
    })
}

export async function createCategory(data: { name: string }): Promise<Category> {
    const slug: string = slugify(data.name, { lower: true });

    return prisma.category.create({
        data: {
            ...data,
            slug,
        },
    });
}

export async function updateCategory(id: string, data: { name?: string }): Promise<Category> {
    let updateData: { name?: string; slug?: string } = { ...data };

    if (data.name) {
        updateData.slug = slugify(data.name, { lower: true });
    }

    return prisma.category.update({
        where: { id },
        data: updateData,
    });
}

export async function deleteCategory(id: string): Promise<Category> {
    return prisma.category.delete({
        where: { id },
    });
}


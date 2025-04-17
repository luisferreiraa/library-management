import slugify from "slugify"
import { prisma } from "./prisma"
import type { Catalog as PrismaCatalog, Prisma } from "@prisma/client"

export type Catalog = PrismaCatalog
export type CatalogWithRelations = Prisma.CatalogGetPayload<{
    include: {
        library: true
    }
}>

export async function getCatalogs(): Promise<CatalogWithRelations[]> {
    return prisma.catalog.findMany({
        include: {
            library: true,
        }
    })
}

export async function getCatalogsByLibraryId(libraryId: string): Promise<Catalog[]> {
    return prisma.catalog.findMany({
        where: { libraryId: libraryId },
        orderBy: {
            createdAt: "desc",
        }
    })
}

export async function getCatalogById(id: string): Promise<CatalogWithRelations | null> {
    return prisma.catalog.findUnique({
        where: { id },
        include: {
            library: true,
        },
    })
}

export async function createCatalog(data: { name: string, libraryId: string }): Promise<Catalog> {
    const slug = slugify(data.name, { lower: true })
    return prisma.catalog.create({
        data: {
            ...data,
            slug,
        }
    })
}

export async function updateCatalog(id: string, data: { name?: string, libraryId?: string, isActive?: boolean }): Promise<Catalog> {
    let updateData: { name?: string, libraryId?: string, isActive?: boolean, slug?: string } = { ...data }

    if (data.name) {
        updateData.slug = slugify(data.name, { lower: true })
    }

    return prisma.catalog.update({
        where: { id },
        data: updateData,
    })
}

export async function deleteCatalogs(ids: string[]): Promise<number> {
    const result = await prisma.catalog.deleteMany({
        where: {
            id: {
                in: ids,
            }
        }
    })

    return result.count
}
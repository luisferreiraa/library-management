import slugify from "slugify"
import { prisma } from "./prisma"
import type { Library as PrismaLibrary, Prisma } from "@prisma/client"

export type Library = PrismaLibrary
export type LibraryWithCatalogs = Prisma.LibraryGetPayload<{
    include: {
        catalog: true
    }
}>

export async function getLibraries(): Promise<Library[]> {
    return prisma.library.findMany({
        orderBy: {
            createdAt: "asc",
        }
    })
}

export async function getLibrariesByNetworkId(networkId: string): Promise<Library[]> {
    return prisma.library.findMany({
        where: { libraryNetworkId: networkId },
        orderBy: {
            createdAt: "desc",
        }
    })
}

export async function getLibraryById(id: string): Promise<Library | null> {
    return prisma.library.findUnique({
        where: { id }
    })
}

export async function getLibraryBySlug(slug: string): Promise<LibraryWithCatalogs | null> {
    return prisma.library.findUnique({
        where: { slug },
        include: {
            catalog: true
        }
    })
}

export async function createLibrary(data: { name: string, location: string, libraryNetworkId: string }): Promise<Library> {
    const slug = slugify(data.name, { lower: true })
    return prisma.library.create({
        data: {
            ...data,
            slug,
        }
    })
}

export async function updateLibrary(id: string, data: { name?: string, location?: string, libraryNetworkId?: string; isActive?: boolean }): Promise<Library> {
    let updateData: { name?: string; location?: string; isActive?: boolean; slug?: string } = { ...data }

    if (data.name) {
        updateData.slug = slugify(data.name, { lower: true })
    }

    return prisma.library.update({
        where: { id },
        data: updateData,
    })
}

export async function deleteLibraries(ids: string[]): Promise<number> {
    const result = await prisma.library.deleteMany({
        where: {
            id: {
                in: ids,
            },
        },
    })

    return result.count
}
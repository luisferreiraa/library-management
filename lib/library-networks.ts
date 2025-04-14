import slugify from "slugify"
import { prisma } from "./prisma"
import type { LibraryNetwork as PrismaFormat } from "@prisma/client"
import { resourceLimits } from "worker_threads"

export type LibraryNetwork = PrismaFormat

export async function getLibraryNetworks(): Promise<LibraryNetwork[]> {
    return prisma.libraryNetwork.findMany({
        orderBy: {
            createdAt: "desc",
        }
    })
}

export async function getLibraryNetworksById(id: string): Promise<LibraryNetwork | null> {
    return prisma.libraryNetwork.findUnique({
        where: { id },
    })
}

export async function createLibraryNetwork(data: { name: string }): Promise<LibraryNetwork> {
    const slug = slugify(data.name, { lower: true });
    return prisma.libraryNetwork.create({
        data: {
            ...data,
            slug,
        },
    })
}

export async function updateLibraryNetwork(id: string, data: { name?: string, isActive?: boolean }): Promise<LibraryNetwork> {
    let updateData: { name?: string; isActive?: boolean; slug?: string } = { ...data };

    if (data.name) {
        updateData.slug = slugify(data.name, { lower: true });
    }

    return prisma.libraryNetwork.update({
        where: { id },
        data: updateData,
    })
}

export async function deleteLibraryNetwork(id: string): Promise<LibraryNetwork> {
    return prisma.libraryNetwork.delete({
        where: { id },
    })
}

export async function deleteLibraryNetworks(ids: string[]): Promise<number> {
    const result = await prisma.libraryNetwork.deleteMany({
        where: {
            id: {
                in: ids,
            },
        },
    })

    return result.count
}
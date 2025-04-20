import { prisma } from "./prisma"
import type { ItemType, Prisma } from "@prisma/client"

export type BookCreateInput = Prisma.BookCreateInput
export type PeriodicalCreateInput = Prisma.PeriodicalCreateInput
export type DVDCreateInput = Prisma.DVDCreateInput
export type VHSCreateInput = Prisma.VHSCreateInput
export type CDCreateInput = Prisma.CDCreateInput

// Buscar item específico com dados relacionados
export async function getCatalogItem(id: string) {
    return prisma.catalogItem.findUnique({
        where: { id },
        include: {
            book: true,
            periodical: true,
            dvd: true,
            vhs: true,
            cd: true,
        }
    })
}

// Listar todos os itens de um catálogo
export async function getItemsByCatalog(catalogId: string) {
    return prisma.catalogItem.findMany({
        where: { catalogId },
        include: {
            book: true,
            periodical: true,
            dvd: true,
            vhs: true,
            cd: true,
        }
    })
}

// Filtrar por tipo
export async function getItemsByType(catalogId: string, type: ItemType) {
    return prisma.catalogItem.findMany({
        where: {
            catalogId,
            type
        },
        include: {
            [type.toLocaleLowerCase()]: true
        }
    })
}

export async function createCatalogItem(
    type: ItemType,
    catalogId: string,
    title: string,
    subTitle: string,
    data:
        | BookCreateInput
        | PeriodicalCreateInput
        | DVDCreateInput
        | VHSCreateInput
        | CDCreateInput
) {
    switch (type) {
        case "BOOK":
            return prisma.catalogItem.create({
                data: {
                    type,
                    title,
                    subTitle,
                    catalog: { connect: { id: catalogId } },
                    book: { create: data as BookCreateInput },
                },
                include: { book: true }
            })

        case "PERIODICAL":
            return prisma.catalogItem.create({
                data: {
                    type,
                    title,
                    subTitle,
                    catalog: { connect: { id: catalogId } },
                    periodical: { create: data as PeriodicalCreateInput },
                },
                include: { periodical: true }
            })

        case "DVD":
            return prisma.catalogItem.create({
                data: {
                    type,
                    title,
                    subTitle,
                    catalog: { connect: { id: catalogId } },
                    dvd: { create: data as DVDCreateInput },
                },
                include: { dvd: true }
            })

        case "VHS":
            return prisma.catalogItem.create({
                data: {
                    type,
                    title,
                    subTitle,
                    catalog: { connect: { id: catalogId } },
                    vhs: { create: data as VHSCreateInput },
                },
                include: { vhs: true }
            })

        case "CD":
            return prisma.catalogItem.create({
                data: {
                    type,
                    title,
                    subTitle,
                    catalog: { connect: { id: catalogId } },
                    cd: { create: data as CDCreateInput },
                },
                include: { cd: true }
            })

        default:
            throw new Error(`Tipo não suportado: ${type}`)
    }
}

/* export async function createCatalogItem<T extends ItemType>(
    type: T,
    catalogId: string,
    data: T extends 'BOOK' ? BookCreateInput :
        T extends 'PERIODICAL' ? PeriodicalCreateInput :
        T extends 'DVD' ? DVDCreateInput :
        T extends 'VHS' ? VHSCreateInput :
        T extends 'CD' ? CDCreateInput :
        never
) {
    const relationKey = type.toLocaleLowerCase() as keyof typeof prisma

    return prisma.catalogItem.create({
        data: {
            type,
            catalog: { connect: { id: catalogId } },
            [relationKey]: { create: data }
        },
        include: {
            [relationKey]: true
        }
    });
} */

// Atualização genérica
export async function updateCatalogItem<T extends ItemType>(
    itemId: string,
    type: T,
    data: T extends 'PERIODICAL' ? PeriodicalCreateInput :
        T extends 'DVD' ? DVDCreateInput :
        T extends 'VHS' ? VHSCreateInput :
        T extends 'CD' ? CDCreateInput :
        never
) {
    return prisma.catalogItem.update({
        where: { id: itemId },
        data: {
            [type.toLowerCase()]: { update: data }
        },
        include: {
            [type.toLowerCase()]: true
        }
    });
}

// Excluir item e os seus relacionamentos (Cascade implícito)
export async function deleteCatalogItem(id: string) {
    return prisma.catalogItem.delete({
        where: { id }
    })
}

// Excluir vários itens
export async function deleteCatalogItems(ids: string[]) {
    return prisma.catalogItem.deleteMany({
        where: {
            id: {
                in: ids,
            },
        },
    })
}

// Excluir vários itens por tipo
export async function deleteItemsByType(catalogId: string, type: ItemType) {
    return prisma.catalogItem.deleteMany({
        where: {
            catalogId,
            type
        }
    })
}

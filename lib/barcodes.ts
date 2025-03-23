import { prisma } from "./prisma"
import type { Barcode as PrismaFormat } from "@prisma/client"

export type Barcode = PrismaFormat

export async function getBarcodesByBookId(bookId: string): Promise<Barcode[]> {
    return prisma.barcode.findMany({
        where: { bookId }
    })
}

export async function getBarcodeIdByCode(code: string): Promise<Barcode | null> {
    return await prisma.barcode.findUnique({
        where: { code: code },
    });
}

export async function createBarcode(bookId: string, code: string): Promise<Barcode> {
    return prisma.barcode.create({
        data: {
            bookId,
            code,
        },
    });
}
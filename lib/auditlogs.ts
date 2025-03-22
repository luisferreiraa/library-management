import { prisma } from "./prisma"
import type { AuditLog as PrismaAuditLog, Prisma } from "@prisma/client"

export type AuditLog = PrismaAuditLog
export type AuditLogWithRelations = Prisma.AuditLogGetPayload<{
    include: {
        user: true
    }
}>

export async function getAuditLogs(): Promise<AuditLog[]> {
    return prisma.auditLog.findMany({
        orderBy: {
            timestamp: 'desc',
        },
        include: {
            user: true,
        },
    });
}

export async function createAuditLog(
    entity: string,
    entityId: string,
    action: string,
    userId: string
): Promise<AuditLog> {
    return prisma.auditLog.create({
        data: {
            entity,
            entityId,
            action,
            userId
        },
    });
}

export async function deleteAuditLog(id: string): Promise<AuditLog> {
    return prisma.auditLog.delete({
        where: { id },
    })
}

export async function deleteAuditLogs(ids: string[]): Promise<number> {
    const result = await prisma.auditLog.deleteMany({
        where: {
            id: {
                in: ids,
            },
        },
    })

    return result.count
}
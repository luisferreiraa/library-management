// src/lib/session.ts

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { createAuditLog } from "@/lib/auditlogs";

export async function getAuthenticatedUserId(): Promise<string> {
    const session = await getServerSession(authOptions);

    if (!session || !session.user || !session.user.id) {
        throw new Error("Utilizador não autenticado ou sessão inválida");
    }

    return session.user.id;
}

export async function logAudit(entity: string, entityId: string | string[], action: string) {
    const userId = await getAuthenticatedUserId();

    if (Array.isArray(entityId)) {
        await Promise.all(entityId.map(id => createAuditLog(entity, id, action, userId)));
    } else {
        await createAuditLog(entity, entityId, action, userId);
    }
}
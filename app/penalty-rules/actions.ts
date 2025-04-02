"use server"

import { revalidatePath } from "next/cache"
import { createPenaltyRule, deletePenaltyRules, updatePenaltyRule, } from "@/lib/penaltyrules"
import { logAudit } from "@/lib/session";

export async function createPenaltyRuleAction(penaltyRuleData: { name: string; description: string; finePerDay: number; minDaysLate: number; maxDaysLate?: number; isActive: boolean }): Promise<any> {
    try {
        // Criar a multa na base de dados
        const newPenaltyRule = await createPenaltyRule(penaltyRuleData)

        // Criar auditLog
        await logAudit("PenaltyRule", newPenaltyRule.id, "CREATE_PENALTY_RULE");

        // Revalidar o caminho para atualizar dados
        revalidatePath("/penalty-rules")

        return newPenaltyRule
    } catch (error: any) {
        throw new Error("Erro ao criar regra: " + error.message)
    }
}

export async function updatePenaltyRuleAction(penaltyRuleData: {
    id: string
    name: string
    description: string
    finePerDay: number
    minDaysLate: number
    maxDaysLate?: number
    isActive?: boolean
}): Promise<any> {
    try {
        // Atualizar a penalty rule na base de dados
        const updatedPenaltyRule = await updatePenaltyRule(penaltyRuleData.id, {
            name: penaltyRuleData.name,
            description: penaltyRuleData.description,
            finePerDay: penaltyRuleData.finePerDay,
            minDaysLate: penaltyRuleData.minDaysLate,
            maxDaysLate: penaltyRuleData.maxDaysLate,
            isActive: penaltyRuleData.isActive,
        })

        // Criar auditLog
        await logAudit("PenaltyRule", penaltyRuleData.id, "UPDATE_PENALTY_RULE")

        // Revalidar o caminho para atualizar os dados
        revalidatePath("/penalty-rules")
        revalidatePath(`/penalty-rules/${penaltyRuleData.id}`)

        return updatedPenaltyRule
    } catch (error: unknown) {
        if (error instanceof Error) {
            throw new Error(`Erro ao atualizar multa (ID: ${penaltyRuleData.id}): ${error.message}`);
        }
        throw new Error("Erro desconhecido ao atualizar multa.");
    }
}

export async function deletePenaltyRulesAction(penaltyRuleIds: string[]): Promise<void> {
    try {
        // Excluir as multas da base de dados
        await deletePenaltyRules(penaltyRuleIds)

        // Criar auditLog
        await logAudit("PenaltyRule", penaltyRuleIds, "DELETE_PENALTY_RULE");

        // Revalidar o caminho para atualizar os dados
        revalidatePath("/penalty-rules")
    } catch (error: any) {
        throw new Error("Erro ao excluir multas: " + error.message)
    }
}
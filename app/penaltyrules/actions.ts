"use server"

import { revalidatePath } from "next/cache"
import { createPenaltyRule, deletePenaltyRules, } from "@/lib/penaltyrules"

export async function createPenaltyRuleAction(penaltyRuleData: { name: string; description: string; finePerDay: number }): Promise<any> {
    try {
        // Criar a multa na base de dados
        const newPenaltyRule = await createPenaltyRule(penaltyRuleData)

        // Revalidar o caminho para atualizar dados
        revalidatePath("/penaltyrules")

        return newPenaltyRule
    } catch (error: any) {
        throw new Error("Erro ao criar regra: " + error.message)
    }
}

export async function deletePenaltyRulesAction(penaltyRuleIds: string[]): Promise<void> {
    try {
        // Excluir as multas da base de dados
        await deletePenaltyRules(penaltyRuleIds)

        // Revalidar o caminho para atualizar os dados
        revalidatePath("/penaltyrules")
    } catch (error: any) {
        throw new Error("Erro ao excluir multas: " + error.message)
    }
}
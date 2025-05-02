"use server"

import { getTemplates, getTemplateById, Template } from "@/lib/templates"

export async function getTemplatesAction(): Promise<Template[]> {
    try {
        const templates = await getTemplates()

        return templates
    } catch (error: any) {
        throw new Error("Não foram encontrados templates: " + error.message)
    }
}

export async function getTemplateByIdAction(id: string): Promise<Template | null> {
    try {
        const template = await getTemplateById(id)

        return template
    } catch (error: any) {
        throw new Error(`Não foi possível obter o template com o ID: ${id}. Erro: ${error.message}`)
    }
}
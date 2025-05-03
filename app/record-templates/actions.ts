"use server"

import { getTemplates, getTemplateById, Template, CreateTemplateInput, createTemplate } from "@/lib/templates"

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

export async function createTemplateAction(data: CreateTemplateInput) {
    try {
        const template = await createTemplate({
            name: data.name,
            description: data.description,
            controlFieldDefinitionIds: data.controlFieldDefinitionIds,
            dataFieldDefinitionIds: data.dataFieldDefinitionIds,
        })

        return template
    } catch (error) {
        console.error("Erro ao criar o template:", error)
        throw new Error("Ocorreu um erro ao criar o template. Tente novamente mais tarde.")
    }
}
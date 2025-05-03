"use server"

import { DataFieldDefinition, getControlFieldDefinitions, getDataFieldDefinitions } from "@/lib/field-definitions"
import { getTemplates, getTemplateById, Template, CreateTemplateInput, createTemplate, UpdateTemplateInput, updateTemplate } from "@/lib/templates"
import { ControlFieldDefinition } from "@prisma/client"
import { revalidatePath } from "next/cache"

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

export async function updateTemplateAction(data: UpdateTemplateInput) {
    try {
        const updatedTemplate = await updateTemplate(data);

        // Revalida o caminho após atualização
        revalidatePath("/record-templates")
        revalidatePath(`/record-templates/${data.id}`)

        return updatedTemplate;
    } catch (error) {
        console.error("Falha ao atualizar template:", error);
        throw new Error("Falha ao atualizar template")
    }
}

export async function getControlFieldDefinitionsAction(): Promise<ControlFieldDefinition[]> {
    try {
        const definitions = await getControlFieldDefinitions()
        return definitions
    } catch (error) {
        console.error("Failed to fetch control field definitions:", error)
        throw new Error("Failed to fetch control field definitions")
    }
}

export async function getDataFieldDefinitionsAction(): Promise<DataFieldDefinition[]> {
    try {
        const definitions = await getDataFieldDefinitions()
        return definitions
    } catch (error) {
        console.error("Failed to fetch data field definitions:", error)
        throw new Error("Failed to fetch data field definitions")
    }
}
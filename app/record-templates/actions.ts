"use server"

import { DataFieldDefinition, getControlFieldDefinitions, getDataFieldDefinitions } from "@/lib/field-definitions"
import { getTemplates, getTemplateById, Template, CreateTemplateInput, createTemplate, UpdateTemplateInput, updateTemplate } from "@/lib/templates"
import { ControlFieldDefinition, Prisma } from "@prisma/client"
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
        console.log("Criando template com dados:", {
            name: data.name,
            controlFieldDefinitionIds: data.controlFieldDefinitionIds,
            dataFieldDefinitionIds: data.dataFieldDefinitionIds,
        })

        const template = await createTemplate({
            name: data.name,
            description: data.description,
            controlFieldDefinitionIds: data.controlFieldDefinitionIds,
            dataFieldDefinitionIds: data.dataFieldDefinitionIds,
        })

        revalidatePath("/record-templates")
        return template
    } catch (error) {
        console.error("Erro ao criar o template:", error)
        if (error instanceof Error) {
            throw new Error(error.message || "Ocorreu um erro ao criar o template. Tente novamente mais tarde.")
        }
        throw new Error("Ocorreu um erro ao criar o template. Tente novamente mais tarde.")
    }
}

export async function updateTemplateAction(data: UpdateTemplateInput) {
    try {
        console.log("Atualizando template com dados:", {
            id: data.id,
            name: data.name,
            controlFieldDefinitionIds: data.controlFieldDefinitionIds,
            dataFieldDefinitionIds: data.dataFieldDefinitionIds,
        })

        const updatedTemplate = await updateTemplate(data)
        revalidatePaths(data.id)
        return updatedTemplate
    } catch (error) {
        console.error("Falha ao atualizar template:", error)

        if (error instanceof Prisma.PrismaClientKnownRequestError) {
            if (error.code === "P2025") {
                throw new Error("Registros relacionados não encontrados. Por favor, verifique os campos selecionados.")
            }
        }

        if (error instanceof Error) {
            throw new Error(error.message || "Falha ao atualizar template")
        }
        throw new Error("Falha ao atualizar template")
    }
}

function revalidatePaths(templateId: string) {
    revalidatePath("/record-templates")
    revalidatePath(`/record-templates/${templateId}`)
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
"use server"

import { revalidatePath } from "next/cache"
import {
    getRecords,
    getRecordById,
    createRecord,
    updateRecord,
    deleteRecord,
    type Record,
    type CreateRecordInput,
    type UpdateRecordInput,
} from "@/lib/records"
import { getTemplates } from "@/lib/templates"
import { getControlFieldDefinitions, getDataFieldDefinitions } from "@/lib/field-definitions"

export async function getRecordsAction(): Promise<Record[]> {
    try {
        return await getRecords()
    } catch (error) {
        console.error("Erro ao buscar registros:", error)
        throw new Error("Não foi possível buscar os registros")
    }
}

export async function getRecordByIdAction(id: string): Promise<Record | null> {
    try {
        return await getRecordById(id)
    } catch (error) {
        console.error(`Erro ao buscar registro ${id}:`, error)
        throw new Error(`Não foi possível buscar o registro com ID ${id}`)
    }
}

export async function createRecordAction(data: CreateRecordInput): Promise<Record> {
    try {
        const record = await createRecord(data)
        revalidatePath("/records")
        return record
    } catch (error) {
        console.error("Erro ao criar registro:", error)
        if (error instanceof Error) {
            throw new Error(error.message)
        }
        throw new Error("Ocorreu um erro ao criar o registro")
    }
}

export async function updateRecordAction(data: UpdateRecordInput): Promise<Record> {
    try {
        const record = await updateRecord(data)
        revalidatePath("/records")
        revalidatePath(`/records/${data.id}`)
        return record
    } catch (error) {
        console.error("Erro ao atualizar registro:", error)
        if (error instanceof Error) {
            throw new Error(error.message)
        }
        throw new Error("Ocorreu um erro ao atualizar o registro")
    }
}

export async function deleteRecordAction(id: string): Promise<void> {
    try {
        await deleteRecord(id)
        revalidatePath("/records")
    } catch (error) {
        console.error("Erro ao deletar registro:", error)
        if (error instanceof Error) {
            throw new Error(error.message)
        }
        throw new Error("Ocorreu um erro ao deletar o registro")
    }
}

export async function getTemplatesAction() {
    try {
        return await getTemplates()
    } catch (error) {
        console.error("Erro ao buscar templates:", error)
        throw new Error("Não foi possível buscar os templates")
    }
}

export async function getFieldDefinitionsAction() {
    try {
        const [controlFieldDefinitions, dataFieldDefinitions] = await Promise.all([
            getControlFieldDefinitions(),
            getDataFieldDefinitions(),
        ])

        return {
            controlFieldDefinitions,
            dataFieldDefinitions,
        }
    } catch (error) {
        console.error("Erro ao buscar definições de campos:", error)
        throw new Error("Não foi possível buscar as definições de campos")
    }
}

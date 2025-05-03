"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { Template } from "@prisma/client"
import { z } from "zod"

interface UpdateTemplateInput {
    id: string
    name: string
    description?: string
    controlFieldDefinitionIds: string[]
    dataFieldDefinitionIds: string[]

}

const formSchema = z.object({
    name: z.string().min(1, { message: "Nome do template é obrigatório" }),
    description: z.string().optional(),
    controlFieldDefinitionIds: z.array(z.string()).min(1, { message: "Selecione pelo menos um campo de controlo" }),
    dataFieldDefinitionIds: z.array(z.string()).min(1, { message: "Selecione pelo menos um campo de dados" })
})

type FormValues = z.infer<typeof formSchema>

interface CreateTemplateModalProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    template?: Template | null
    mode?: "create" | "edit"
    onSuccess?: () => void
}

export default async function CreateTemplateModal({ open, onOpenChange, template = null, mode = "create", onSuccess }: CreateTemplateModalProps) {

    return (

        <div>
            <h1>Template Modal</h1>
        </div>

    )
}
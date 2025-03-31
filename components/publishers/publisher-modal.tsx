"use client"
import { z } from "zod"
import { EntityModal } from "@/components/ui/entity-modal-2"
import { useEntityForm } from "@/hooks/use-entity-form"
import { createPublisherAction, updatePublisherAction } from "@/app/publishers/actions"
import type { Publisher } from "@/lib/publishers"
import { useMemo } from "react"

// Schema de validação
const publisherSchema = z.object({
    name: z.string().min(2, { message: "Nome deve ter pelo menos 2 caracteres" }),
    isActive: z.boolean(),
})

// Tipo derivado do schema
type PublisherFormValues = z.infer<typeof publisherSchema>

// Valores padrão
const defaultValues: PublisherFormValues = {
    name: "",
    isActive: true,
}

interface PublisherModalProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    publisher?: Publisher | null
    onSuccess?: (publisher: Publisher) => void
}

export function PublisherModal({ open, onOpenChange, publisher, onSuccess }: PublisherModalProps) {
    const isEditMode = !!publisher

    // Utilizar useMemo para prevenir criar um novo objeto a cada render
    const entityData = useMemo(() => {
        return publisher ? { name: publisher.name, isActive: publisher.isActive } : { name: "", isActive: true };
    }, [publisher])

    const formConfig = useEntityForm<PublisherFormValues, Publisher>({
        schema: publisherSchema,
        defaultValues,
        onSubmit: async (values) => {
            if (isEditMode && publisher) {
                return updatePublisherAction({
                    id: publisher.id,
                    ...values,
                })
            } else {
                return createPublisherAction(values)
            }
        },
        entity: entityData,
        entityName: "Editora",
        onSuccess: (result) => {
            onOpenChange(false)
            if (onSuccess) {
                onSuccess(result)
            }
        },
        onClose: () => onOpenChange(false),
    })

    return (
        <EntityModal
            open={open}
            onOpenChange={onOpenChange}
            entityName="Editora"
            formConfig={formConfig}
            entity={publisher}
            description="Preencha os dados da editora e clique em salvar quando terminar."
            fields={[
                {
                    name: "isActive",
                    label: formConfig.form?.getValues("isActive") ? "Inativar" : "Ativar",
                    type: "switch",
                },
                {
                    name: "name",
                    label: "Nome",
                    placeholder: "Nome da editora",
                    required: true,
                },
            ]}
        />
    )
}


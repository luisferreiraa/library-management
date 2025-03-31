"use client"
import { z } from "zod"
import { EntityModal } from "@/components/ui/entity-modal-2"
import { useEntityForm } from "@/hooks/use-entity-form"
import { createFormatAction, updateFormatAction } from "@/app/formats/actions"
import type { Format } from "@/lib/formats"
import { useMemo } from "react"

// Schema de validação
const formatSchema = z.object({
    name: z.string().min(2, { message: "Nome deve ter pelo menos 2 caracteres" }),
    isActive: z.boolean(),
})

// Tipo derivado do schema
type FormatFormValues = z.infer<typeof formatSchema>

// Valores padrão
const defaultValues: FormatFormValues = {
    name: "",
    isActive: true,
}

interface FormatModalProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    format?: Format | null
    onSuccess?: (format: Format) => void
}

export function FormatModal({ open, onOpenChange, format, onSuccess }: FormatModalProps) {
    const isEditMode = !!format

    // Utilizar useMemo para prevenir criar um novo objeto a cada render
    const entityData = useMemo(() => {
        return format ? { name: format.name, isActive: format.isActive } : { name: "", isActive: true };
    }, [format])

    const formConfig = useEntityForm<FormatFormValues, Format>({
        schema: formatSchema,
        defaultValues,
        onSubmit: async (values) => {
            if (isEditMode && format) {
                return updateFormatAction({
                    id: format.id,
                    ...values,
                })
            } else {
                return createFormatAction(values)
            }
        },
        entity: entityData,
        entityName: "Formato",
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
            entityName="Formato"
            formConfig={formConfig}
            entity={format}
            description="Preencha os dados do formato e clique em salvar quando terminar."
            fields={[
                {
                    name: "isActive",
                    label: formConfig.form?.getValues("isActive") ? "Inativar" : "Ativar",
                    type: "switch",
                },
                {
                    name: "name",
                    label: "Nome",
                    placeholder: "Nome do formato",
                    required: true,
                },
            ]}
        />
    )
}


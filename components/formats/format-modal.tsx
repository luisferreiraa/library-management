"use client"

import { useFormats } from "@/contexts/formats-context"
import { EntityModal } from "@/components/ui/entity-modal"
import { useEntityModal } from "@/hooks/use-entity-modal"
import { FormatForm, formatSchema, formatDefaultValues, type FormatFormValues } from "./format-form"
import { createFormatAction, updateFormatAction } from "@/app/formats/actions"
import type { Format } from "@/lib/formats"
import { useEffect } from "react"

interface FormatModalProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    format?: Format | null
}

export function FormatModal({ open, onOpenChange, format }: FormatModalProps) {
    const { addFormat } = useFormats()
    const isEditMode = !!format

    const handleSubmit = async (values: FormatFormValues) => {
        if (isEditMode && format) {
            return updateFormatAction({
                id: format.id,
                ...values,
            })
        } else {
            return createFormatAction(values)
        }
    }

    const {
        isSubmitting,
        error,
        form,
        handleSubmit: onSubmit,
    } = useEntityModal<FormatFormValues, Format>({
        schema: formatSchema,
        defaultValues: format
            ? { ...formatDefaultValues, name: format.name }
            : formatDefaultValues,
        onSubmit: handleSubmit,
        entity: format,
        entityName: "Formato",
        onSuccess: (result) => {
            addFormat(result);
            onOpenChange(false)
        },
    })

    // Atualiza os valores do formulário sempre que o modal abrir
    useEffect(() => {
        if (open) {
            const values = format
                ? { ...formatDefaultValues, name: format.name }
                : formatDefaultValues

            form.reset(values)
        }
    }, [open, format, form])

    return (
        <EntityModal
            open={open}
            onOpenChange={onOpenChange}
            title={isEditMode ? "Editar Formato" : "Adicionar Novo Formato"}
            description={
                isEditMode
                    ? "Edite os dados do formato e clique em salvar quando terminar."
                    : "Preencha os dados do formato e clique em salvar quando terminar."
            }
            isSubmitting={isSubmitting}
            error={error}
        >
            <FormatForm form={form} onSubmit={onSubmit} isSubmitting={isSubmitting} />
        </EntityModal>
    )
}


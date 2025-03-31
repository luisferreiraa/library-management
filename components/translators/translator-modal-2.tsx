"use client"
import { z } from "zod"
import { EntityModal } from "@/components/ui/entity-modal-2"
import { useEntityForm } from "@/hooks/use-entity-form"
import { createTranslatorAction, updateTranslatorAction } from "@/app/translators/actions"
import type { Translator } from "@/lib/translators"
import { useMemo } from "react"

// Schema de validação para tradutor
const translatorSchema = z.object({
    name: z.string().min(2, { message: "Nome deve ter pelo menos 2 caracteres" }),
})

// Tipo derivado do schema
type TranslatorFormValues = z.infer<typeof translatorSchema>

// Valores padrão
const defaultValues: TranslatorFormValues = {
    name: "",
}

interface TranslatorModalProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    translator?: Translator | null
    onSuccess?: (translator: Translator) => void
}

export function TranslatorModal({ open, onOpenChange, translator, onSuccess }: TranslatorModalProps) {
    const isEditMode = !!translator

    // Use useMemo to prevent creating a new object reference on every render
    const entityData = useMemo(() => {
        return translator ? { name: translator.name } : null
    }, [translator])

    const formConfig = useEntityForm<TranslatorFormValues, Translator>({
        schema: translatorSchema,
        defaultValues,
        onSubmit: async (values) => {
            if (isEditMode && translator) {
                return updateTranslatorAction({
                    id: translator.id,
                    ...values,
                })
            } else {
                return createTranslatorAction(values)
            }
        },
        entity: entityData,
        entityName: "Tradutor",
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
            entityName="Tradutor"
            formConfig={formConfig}
            entity={translator} // Pass the translator as the entity prop
            description="Preencha os dados do tradutor e clique em salvar quando terminar."
            fields={[
                {
                    name: "name",
                    label: "Nome",
                    placeholder: "Nome do tradutor",
                    required: true,
                },
            ]}
        />
    )
}


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
    isActive: z.boolean(),
})

// Tipo derivado do schema
type TranslatorFormValues = z.infer<typeof translatorSchema>

// Valores padrão
const defaultValues: TranslatorFormValues = {
    name: "",
    isActive: true,
}

interface TranslatorModalProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    translator?: Translator | null
    onSuccess?: (translator: Translator) => void
}

export function TranslatorModal({ open, onOpenChange, translator, onSuccess }: TranslatorModalProps) {
    const isEditMode = !!translator

    // Utilizar useMemo para prevenir criar um novo objeto a cada render
    const entityData = useMemo(() => {
        return translator ? { name: translator.name, isActive: translator.isActive } : { name: "", isActive: true };
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
            entity={translator}
            description="Preencha os dados do tradutor e clique em salvar quando terminar."
            fields={[
                {
                    name: "isActive",
                    label: formConfig.form?.getValues("isActive") ? "Inativar" : "Ativar",
                    type: "switch",
                },
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


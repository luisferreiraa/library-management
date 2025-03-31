"use client"

import { z } from "zod"
import { EntityModal } from "@/components/ui/entity-modal-2"
import { useEntityForm } from "@/hooks/use-entity-form"
import { createLanguageAction, updateLanguageAction } from "@/app/languages/actions"
import type { Language } from "@/lib/languages"
import { useMemo } from "react"

// Schema de validação
const languageSchema = z.object({
    name: z.string().min(2, { message: "Nome deve ter pelo menos 2 caracteres" }),
    isActive: z.boolean(),
})

// Tipo derivado do schema
type LanguageFormValues = z.infer<typeof languageSchema>

// Valores padrão
const defaultValues: LanguageFormValues = {
    name: "",
    isActive: true,
}

interface LanguageModalProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    language?: Language | null
    onSuccess?: (language: Language) => void
}

export function LanguageModal({ open, onOpenChange, language, onSuccess }: LanguageModalProps) {
    const isEditMode = !!language

    // Utilizar useMemo para prevenir criar um novo objeto a cada render
    const entityData = useMemo(() => {
        return language ? { name: language.name, isActive: language.isActive } : { name: "", isActive: true };
    }, [language])

    const formConfig = useEntityForm<LanguageFormValues, Language>({
        schema: languageSchema,
        defaultValues,
        onSubmit: async (values) => {
            if (isEditMode && language) {
                return updateLanguageAction({
                    id: language.id,
                    ...values,
                })
            } else {
                return createLanguageAction(values)
            }
        },
        entity: entityData,
        entityName: "Idioma",
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
            entityName="Idioma"
            formConfig={formConfig}
            entity={language}
            description="Preencha os dados do idioma e clique em salvar quando terminar."
            fields={[
                {
                    name: "isActive",
                    label: formConfig.form?.getValues("isActive") ? "Inativar" : "Ativar",
                    type: "switch",
                },
                {
                    name: "name",
                    label: "Nome",
                    placeholder: "Nome do idioma",
                    required: true,
                },
            ]}
        />
    )
}


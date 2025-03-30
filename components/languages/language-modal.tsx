"use client"

import { useLanguages } from "@/contexts/languages-context"
import { EntityModal } from "@/components/ui/entity-modal"
import { useEntityModal } from "@/hooks/use-entity-modal"
import { LanguageForm, languageSchema, languageDefaultValues, type LanguageFormValues } from "./language-form"
import { createLanguageAction, updateLanguageAction } from "@/app/languages/actions"
import type { Language } from "@/lib/languages"
import { useEffect } from "react"

interface LanguageModalProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    language?: Language | null
}

export function LanguageModal({ open, onOpenChange, language }: LanguageModalProps) {
    const { addLanguage } = useLanguages()
    const isEditMode = !!language

    const handleSubmit = async (values: LanguageFormValues) => {
        if (isEditMode && language) {
            return updateLanguageAction({
                id: language.id,
                ...values,
            })
        } else {
            return createLanguageAction(values)
        }
    }

    const {
        isSubmitting,
        error,
        form,
        handleSubmit: onSubmit,
    } = useEntityModal<LanguageFormValues, Language>({
        schema: languageSchema,
        defaultValues: language
            ? { ...languageDefaultValues, name: language.name }
            : languageDefaultValues,
        onSubmit: handleSubmit,
        entity: language,
        entityName: "Idioma",
        onSuccess: (result) => {
            addLanguage(result);
            onOpenChange(false)
        },
    })

    // Atualiza os valores do formulário sempre que o modal abrir
    useEffect(() => {
        if (open) {
            const values = language
                ? { ...languageDefaultValues, name: language.name }
                : languageDefaultValues

            form.reset(values)
        }
    }, [open, language, form])

    return (
        <EntityModal
            open={open}
            onOpenChange={onOpenChange}
            title={isEditMode ? "Editar Idioma" : "Adicionar Novo Idioma"}
            description={
                isEditMode
                    ? "Edite os dados do idioma e clique em salvar quando terminar."
                    : "Preencha os dados do idioma e clique em salvar quando terminar."
            }
            isSubmitting={isSubmitting}
            error={error}
        >
            <LanguageForm form={form} onSubmit={onSubmit} isSubmitting={isSubmitting} />
        </EntityModal>
    )
}


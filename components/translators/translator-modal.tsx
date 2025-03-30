"use client"

import { useTranslators } from "@/contexts/translators-context"
import { EntityModal } from "@/components/ui/entity-modal"
import { useEntityModal } from "@/hooks/use-entity-modal"
import { TranslatorForm, translatorSchema, translatorDefaultValues, type TranslatorFormValues } from "./translator-form"
import { createTranslatorAction, updateTranslatorAction } from "@/app/translators/actions"
import type { Translator } from "@/lib/translators"
import { useEffect } from "react"

interface TranslatorModalProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    translator?: Translator | null
}

export function TranslatorModal({ open, onOpenChange, translator }: TranslatorModalProps) {
    const { addTranslator } = useTranslators()
    const isEditMode = !!translator

    const handleSubmit = async (values: TranslatorFormValues) => {
        if (isEditMode && translator) {
            return updateTranslatorAction({
                id: translator.id,
                ...values,
            })
        } else {
            return createTranslatorAction(values)
        }
    }

    const {
        isSubmitting,
        error,
        form,
        handleSubmit: onSubmit,
    } = useEntityModal<TranslatorFormValues, Translator>({
        schema: translatorSchema,
        defaultValues: translator
            ? { ...translatorDefaultValues, name: translator.name }
            : translatorDefaultValues,
        onSubmit: handleSubmit,
        entity: translator,
        entityName: "Tradutor",
        onSuccess: (result) => {
            if (!isEditMode) {
                addTranslator(result) // Apenas adiciona ao estado se for um novo tradutor
            }
            onOpenChange(false)
        },
    })

    // Atualiza os valores do formulário sempre que o modal abrir
    useEffect(() => {
        if (open) {
            const values = translator
                ? { ...translatorDefaultValues, name: translator.name }
                : translatorDefaultValues

            form.reset(values)
        }
    }, [open, translator, form])

    return (
        <EntityModal
            open={open}
            onOpenChange={onOpenChange}
            title={isEditMode ? "Editar Tradutor" : "Adicionar Novo Tradutor"}
            description={
                isEditMode
                    ? "Edite os dados do tradutor e clique em salvar quando terminar."
                    : "Preencha os dados do tradutor e clique em salvar quando terminar."
            }
            isSubmitting={isSubmitting}
            error={error}
        >
            <TranslatorForm form={form} onSubmit={onSubmit} isSubmitting={isSubmitting} />
        </EntityModal>
    )
}


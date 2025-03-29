"use client"

import { usePublishers } from "@/contexts/publishers-context"
import { EntityModal } from "@/components/ui/entity-modal"
import { useEntityModal } from "@/hooks/use-entity-modal"
import { PublisherForm, publisherSchema, publisherDefaultValues, type PublisherFormValues } from "./publisher-form"
import { createPublisherAction, updatePublisherAction } from "@/app/publishers/actions"
import type { Publisher } from "@/lib/publishers"
import { useEffect } from "react"

interface PublisherModalProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    publisher?: Publisher | null
}

export function PublisherModal({ open, onOpenChange, publisher }: PublisherModalProps) {
    const { addPublisher } = usePublishers()
    const isEditMode = !!publisher

    const handleSubmit = async (values: PublisherFormValues) => {
        if (isEditMode && publisher) {
            return updatePublisherAction({
                id: publisher.id,
                ...values,
            })
        } else {
            return createPublisherAction(values)
        }
    }

    const {
        isSubmitting,
        error,
        form,
        handleSubmit: onSubmit,
    } = useEntityModal<PublisherFormValues, Publisher>({
        schema: publisherSchema,
        defaultValues: publisher
            ? { ...publisherDefaultValues, name: publisher.name }
            : publisherDefaultValues,
        onSubmit: handleSubmit,
        entity: publisher,
        entityName: "Editora",
        onSuccess: (result) => {
            addPublisher(result);
            onOpenChange(false)
        },
    })

    // Atualiza os valores do formulário sempre que o modal abrir
    useEffect(() => {
        if (open) {
            const values = publisher
                ? { ...publisherDefaultValues, name: publisher.name }
                : publisherDefaultValues

            form.reset(values)
        }
    }, [open, publisher, form])

    return (
        <EntityModal
            open={open}
            onOpenChange={onOpenChange}
            title={isEditMode ? "Editar Editora" : "Adicionar Nova Editora"}
            description={
                isEditMode
                    ? "Edite os dados da editora e clique em salvar quando terminar."
                    : "Preencha os dados da editora e clique em salvar quando terminar."
            }
            isSubmitting={isSubmitting}
            error={error}
        >
            <PublisherForm form={form} onSubmit={onSubmit} isSubmitting={isSubmitting} />
        </EntityModal>
    )
}


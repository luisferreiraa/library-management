"use client"
import { z } from "zod"
import { EntityModal } from "@/components/ui/entity-modal-2"
import { useEntityForm } from "@/hooks/use-entity-form"
import { createBookStatusAction, updateBookStatusAction } from "@/app/book-status/actions"
import type { BookStatus } from "@/lib/bookstatus"
import { useMemo } from "react"

// Schema de validação
const bookStatusSchema = z.object({
    name: z.string().min(2, { message: "Nome deve ter pelo menos 2 caracteres" }),
})

// Tipo derivado do schema
type BookStatusFormValues = z.infer<typeof bookStatusSchema>

// Valores padrão
const defaultValues: BookStatusFormValues = {
    name: "",
}

interface BookStatusModalProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    bookStatus?: BookStatus | null
    onSuccess?: (bookStatus: BookStatus) => void
}

export function BookStatusModal({ open, onOpenChange, bookStatus, onSuccess }: BookStatusModalProps) {
    const isEditMode = !!bookStatus

    // Utilizar useMemo para prevenir criar um novo objeto a cada render
    const entityData = useMemo(() => {
        return bookStatus ? { name: bookStatus.name } : null
    }, [bookStatus])

    const formConfig = useEntityForm<BookStatusFormValues, BookStatus>({
        schema: bookStatusSchema,
        defaultValues,
        onSubmit: async (values) => {
            if (isEditMode && bookStatus) {
                return updateBookStatusAction({
                    id: bookStatus.id,
                    ...values,
                })
            } else {
                return createBookStatusAction(values)
            }
        },
        entity: entityData,
        entityName: "Estado",
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
            entityName="Estado"
            formConfig={formConfig}
            entity={bookStatus}
            description="Preencha os dados do estado e clique em salvar quando terminar."
            fields={[
                {
                    name: "name",
                    label: "Nome",
                    placeholder: "Nome do estado",
                    required: true,
                },
            ]}
        />
    )
}


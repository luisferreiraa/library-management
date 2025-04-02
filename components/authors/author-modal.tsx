"use client"
import { z } from "zod"
import { EntityModal } from "@/components/ui/entity-modal-2"
import { useEntityForm } from "@/hooks/use-entity-form"
import { createAuthorAction, updateAuthorAction } from "@/app/authors/actions"
import type { Author } from "@/lib/authors"
import { useMemo } from "react"

// Schema de validação
const authorSchema = z.object({
    name: z.string().min(2, { message: "Nome deve ter pelo menos 2 caracteres" }),
    email: z.string().email({ message: "Email inválido" }),
    bio: z.string().min(10, { message: "Bio deve ter pelo menos 10 caracteres" }),
    isActive: z.boolean(),
})

// Tipo derivado do schema
type AuthorFormValues = z.infer<typeof authorSchema>

// Valores padrão
const defaultValues: AuthorFormValues = {
    name: "",
    email: "",
    bio: "",
    isActive: true,
}

interface AuthorModalProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    author?: Author | null
    onSuccess?: (author: Author) => void
}

export function AuthorModal({ open, onOpenChange, author, onSuccess }: AuthorModalProps) {
    const isEditMode = !!author

    // Utilizar useMemo para prevenir criar um novo objeto a cada render
    const entityData = useMemo(() => {
        return author ? {
            name: author.name,
            email: author.email,
            bio: author.bio || "",
            isActive: author.isActive,
        } : null
    }, [author])

    const formConfig = useEntityForm<AuthorFormValues, Author>({
        schema: authorSchema,
        defaultValues,
        onSubmit: async (values) => {
            if (isEditMode && author) {
                return updateAuthorAction({
                    id: author.id,
                    ...values,
                })
            } else {
                return createAuthorAction(values)
            }
        },
        entity: entityData,
        entityName: "Autor",
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
            entityName="Autor"
            formConfig={formConfig}
            entity={author}
            description="Preencha os dados do autor e clique em salvar quando terminar."
            fields={[
                {
                    name: "isActive",
                    label: formConfig.form?.getValues("isActive") ? "Inativar" : "Ativar",
                    type: "switch",
                },
                {
                    name: "name",
                    label: "Nome",
                    type: "text",
                    placeholder: "Nome do autor",
                    required: true,
                },
                {
                    name: "email",
                    label: "Email",
                    type: "text",
                    placeholder: "Email do autor",
                    required: true,
                },
                {
                    name: "bio",
                    label: "Biografia",
                    type: "textarea",
                    placeholder: "Biografia do autor",
                    required: true,
                },
            ]}
        />
    )
}


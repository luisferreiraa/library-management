"use client"
import { z } from "zod"
import { EntityModal } from "@/components/ui/entity-modal-2"
import { useEntityForm } from "@/hooks/use-entity-form"
import { createCategoryAction, updateCategoryAction } from "@/app/categories/actions"
import type { Category } from "@/lib/categories"
import { useMemo } from "react"

// Schema de validação
const categorySchema = z.object({
    name: z.string().min(2, { message: "Nome deve ter pelo menos 2 caracteres" }),
})

// Tipo derivado do schema
type CategoryFormValues = z.infer<typeof categorySchema>

// Valores padrão
const defaultValues: CategoryFormValues = {
    name: "",
}

interface CategoryModalProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    category?: Category | null
    onSuccess?: (category: Category) => void
}

export function CategoryModal({ open, onOpenChange, category, onSuccess }: CategoryModalProps) {
    const isEditMode = !!category

    // Utilizar useMemo para prevenir criar um novo objeto a cada render
    const entityData = useMemo(() => {
        return category ? { name: category.name } : null
    }, [category])

    const formConfig = useEntityForm<CategoryFormValues, Category>({
        schema: categorySchema,
        defaultValues,
        onSubmit: async (values) => {
            if (isEditMode && category) {
                return updateCategoryAction({
                    id: category.id,
                    ...values,
                })
            } else {
                return createCategoryAction(values)
            }
        },
        entity: entityData,
        entityName: "Categoria",
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
            entityName="Categoria"
            formConfig={formConfig}
            entity={category}
            description="Preencha os dados da categoria e clique em salvar quando terminar."
            fields={[
                {
                    name: "name",
                    label: "Nome",
                    placeholder: "Nome da categoria",
                    required: true,
                },
            ]}
        />
    )
}


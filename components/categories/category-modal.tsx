"use client"

import { useCategories } from "@/contexts/categories-context"
import { EntityModal } from "@/components/ui/entity-modal"
import { useEntityModal } from "@/hooks/use-entity-modal"
import { CategoryForm, categorySchema, categoryDefaultValues, type CategoryFormValues } from "./category-form"
import { createCategoryAction, updateCategoryAction } from "@/app/categories/actions"
import type { Category } from "@/lib/categories"
import { useEffect } from "react"

interface CategoryModalProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    category?: Category | null
}

export function CategoryModal({ open, onOpenChange, category }: CategoryModalProps) {
    const { addCategory } = useCategories()
    const isEditMode = !!category

    const handleSubmit = async (values: CategoryFormValues) => {
        if (isEditMode && category) {
            return updateCategoryAction({
                id: category.id,
                ...values,
            })
        } else {
            return createCategoryAction(values)
        }
    }

    const {
        isSubmitting,
        error,
        form,
        handleSubmit: onSubmit,
    } = useEntityModal<CategoryFormValues, Category>({
        schema: categorySchema,
        defaultValues: category
            ? { ...categoryDefaultValues, name: category.name }
            : categoryDefaultValues,
        onSubmit: handleSubmit,
        entity: category,
        entityName: "Categoria",
        onSuccess: (result) => {
            addCategory(result);
            onOpenChange(false)
        },
    })

    // Atualiza os valores do formulário sempre que o modal abrir
    useEffect(() => {
        if (open) {
            const values = category
                ? { ...categoryDefaultValues, name: category.name }
                : categoryDefaultValues

            form.reset(values)
        }
    }, [open, category, form])

    return (
        <EntityModal
            open={open}
            onOpenChange={onOpenChange}
            title={isEditMode ? "Editar Categoria" : "Adicionar Nova Categoria"}
            description={
                isEditMode
                    ? "Edite os dados da categoria e clique em salvar quando terminar."
                    : "Preencha os dados da categoria e clique em salvar quando terminar."
            }
            isSubmitting={isSubmitting}
            error={error}
        >
            <CategoryForm form={form} onSubmit={onSubmit} isSubmitting={isSubmitting} />
        </EntityModal>
    )
}


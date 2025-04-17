"use client"
import { z } from "zod"
import { EntityModal } from "@/components/ui/entity-modal-2"
import { useEntityForm } from "@/hooks/use-entity-form"
import { createCatalogAction, updateCatalogAction } from "@/app/catalogs/actions"
import type { Catalog } from "@/lib/catalogs"
import { useMemo } from "react"
import { useLibraries } from "@/contexts/libraries-context"

// Schema de validação para role
const catalogSchema = z.object({
    name: z.string().min(2, { message: "Nome deve ter pelo menos 2 caracteres" }),
    libraryId: z.string().min(1, { message: "A biblioteca é obrigatória" }),
    isActive: z.boolean(),
})

// Tipo derivado do schema
type CatalogFormValues = z.infer<typeof catalogSchema>

// Valores padrão
const defaultValues: CatalogFormValues = {
    name: "",
    libraryId: "",
    isActive: true,
}

interface CatalogModalProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    catalog?: Catalog | null
    onSuccess?: (catalog: Catalog) => void
}

export function CatalogModal({ open, onOpenChange, catalog, onSuccess }: CatalogModalProps) {
    const isEditMode = !!catalog
    const { entities: libraries } = useLibraries()

    // Utilizar useMemo para prevenir criar um novo objeto a cada render
    const entityData = useMemo(() => {
        return catalog ? { name: catalog.name, libraryId: catalog.libraryId, isActive: catalog.isActive } : null;
    }, [catalog])

    const formConfig = useEntityForm<CatalogFormValues, Catalog>({
        schema: catalogSchema,
        defaultValues,
        onSubmit: async (values) => {
            if (isEditMode && catalog) {
                return updateCatalogAction({
                    id: catalog.id,
                    ...values,
                })
            } else {
                return createCatalogAction(values)
            }
        },
        entity: entityData,
        entityName: "Catálogos",
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
            entityName="Catálogos"
            formConfig={formConfig}
            entity={catalog}
            description="Preencha os dados do catálogo e clique em salvar quando terminar."
            fields={[
                {
                    name: "isActive",
                    label: formConfig.form?.getValues("isActive") ? "Inativar" : "Ativar",
                    type: "switch",
                },
                {
                    name: "name",
                    label: "Nome",
                    placeholder: "Nome do catálogo",
                    required: true,
                },
                {
                    name: "libraryId",
                    label: "Biblioteca",
                    type: "select",
                    placeholder: "Selecione uma biblioteca",
                    options: libraries.map((library) => ({
                        label: library.name,
                        value: library.id,
                    })),
                    required: true,
                },
            ]}
        />
    )
}


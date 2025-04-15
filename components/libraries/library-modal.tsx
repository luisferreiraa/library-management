"use client"
import { z } from "zod"
import { EntityModal } from "@/components/ui/entity-modal-2"
import { useEntityForm } from "@/hooks/use-entity-form"
import { createLibraryAction, updateLibraryAction } from "@/app/(super-admin)/libraries/actions"
import type { Library } from "@/lib/libraries"
import { useMemo } from "react"
import { useLibraryNetworks } from "@/contexts/library-networks-context"

// Schema de validação para role
const librarySchema = z.object({
    name: z.string().min(2, { message: "Nome deve ter pelo menos 2 caracteres" }),
    location: z.string().min(1, { message: "A localização é obrigatória" }),
    libraryNetworkId: z.string().min(1, { message: "A rede de bibliotecas é obrigatória" }),
    isActive: z.boolean(),
})

// Tipo derivado do schema
type LibraryFormValues = z.infer<typeof librarySchema>

// Valores padrão
const defaultValues: LibraryFormValues = {
    name: "",
    location: "",
    libraryNetworkId: "",
    isActive: true,
}

interface LibraryModalProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    library?: Library | null
    onSuccess?: (library: Library) => void
}

export function LibraryModal({ open, onOpenChange, library, onSuccess }: LibraryModalProps) {
    const isEditMode = !!library
    const { entities: libraryNetworks } = useLibraryNetworks()

    // Utilizar useMemo para prevenir criar um novo objeto a cada render
    const entityData = useMemo(() => {
        return library ? { name: library.name, location: library.location, libraryNetworkId: library.libraryNetworkId, isActive: library.isActive } : null;
    }, [library])

    const formConfig = useEntityForm<LibraryFormValues, Library>({
        schema: librarySchema,
        defaultValues,
        onSubmit: async (values) => {
            if (isEditMode && library) {
                return updateLibraryAction({
                    id: library.id,
                    ...values,
                })
            } else {
                return createLibraryAction(values)
            }
        },
        entity: entityData,
        entityName: "Bibliotecas",
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
            entityName="Bibliotecas"
            formConfig={formConfig}
            entity={library}
            description="Preencha os dados da biblioteca e clique em salvar quando terminar."
            fields={[
                {
                    name: "isActive",
                    label: formConfig.form?.getValues("isActive") ? "Inativar" : "Ativar",
                    type: "switch",
                },
                {
                    name: "name",
                    label: "Nome",
                    placeholder: "Nome da biblioteca",
                    required: true,
                },
                {
                    name: "location",
                    label: "Localização",
                    placeholder: "Localização da biblioteca",
                    required: true,
                },
                {
                    name: "libraryNetworkId",
                    label: "Rede de Bibliotecas",
                    type: "select",
                    placeholder: "Selecione uma rede",
                    options: libraryNetworks.map((network) => ({
                        label: network.name,
                        value: network.id,
                    })),
                    required: true,
                },
            ]}
        />
    )
}


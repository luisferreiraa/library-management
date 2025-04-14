"use client"
import { z } from "zod"
import { EntityModal } from "@/components/ui/entity-modal-2"
import { useEntityForm } from "@/hooks/use-entity-form"
import { createLibraryNetworkAction, updateLibraryNetworkAction } from "@/app/(super-admin)/library-networks/actions"
import type { LibraryNetwork } from "@/lib/library-networks"
import { useMemo } from "react"

// Schema de validação para role
const libraryNetworkSchema = z.object({
    name: z.string().min(2, { message: "Nome deve ter pelo menos 2 caracteres" }),
    isActive: z.boolean(),
})

// Tipo derivado do schema
type LibraryNetworkFormValues = z.infer<typeof libraryNetworkSchema>

// Valores padrão
const defaultValues: LibraryNetworkFormValues = {
    name: "",
    isActive: true,
}

interface LibraryNetworkModalProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    libraryNetwork?: LibraryNetwork | null
    onSuccess?: (libraryNetwork: LibraryNetwork) => void
}

export function LibraryNetworkModal({ open, onOpenChange, libraryNetwork, onSuccess }: LibraryNetworkModalProps) {
    const isEditMode = !!libraryNetwork

    // Utilizar useMemo para prevenir criar um novo objeto a cada render
    const entityData = useMemo(() => {
        return libraryNetwork ? { name: libraryNetwork.name, isActive: libraryNetwork.isActive } : null;
    }, [libraryNetwork])

    const formConfig = useEntityForm<LibraryNetworkFormValues, LibraryNetwork>({
        schema: libraryNetworkSchema,
        defaultValues,
        onSubmit: async (values) => {
            if (isEditMode && libraryNetwork) {
                return updateLibraryNetworkAction({
                    id: libraryNetwork.id,
                    ...values,
                })
            } else {
                return createLibraryNetworkAction(values)
            }
        },
        entity: entityData,
        entityName: "Rede de Bibliotecas",
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
            entityName="Rede de Bibliotecas"
            formConfig={formConfig}
            entity={libraryNetwork}
            description="Preencha os dados da rede de bibliotecas e clique em salvar quando terminar."
            fields={[
                {
                    name: "isActive",
                    label: formConfig.form?.getValues("isActive") ? "Inativar" : "Ativar",
                    type: "switch",
                },
                {
                    name: "name",
                    label: "Nome",
                    placeholder: "Nome da rede de bibliotecas",
                    required: true,
                },
            ]}
        />
    )
}


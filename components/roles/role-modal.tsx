"use client"
import { z } from "zod"
import { EntityModal } from "@/components/ui/entity-modal-2"
import { useEntityForm } from "@/hooks/use-entity-form"
import { createRoleAction, updateRoleAction } from "@/app/roles/actions"
import type { Role } from "@/lib/roles"
import { useMemo } from "react"

// Schema de validação para role
const roleSchema = z.object({
    name: z.string().min(2, { message: "Nome deve ter pelo menos 2 caracteres" }),
})

// Tipo derivado do schema
type RoleFormValues = z.infer<typeof roleSchema>

// Valores padrão
const defaultValues: RoleFormValues = {
    name: "",
}

interface RoleModalProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    role?: Role | null
    onSuccess?: (role: Role) => void
}

export function RoleModal({ open, onOpenChange, role, onSuccess }: RoleModalProps) {
    const isEditMode = !!role

    // Utilizar useMemo para prevenir criar um novo objeto a cada render
    const entityData = useMemo(() => {
        return role ? { name: role.name } : null
    }, [role])

    const formConfig = useEntityForm<RoleFormValues, Role>({
        schema: roleSchema,
        defaultValues,
        onSubmit: async (values) => {
            if (isEditMode && role) {
                return updateRoleAction({
                    id: role.id,
                    ...values,
                })
            } else {
                return createRoleAction(values)
            }
        },
        entity: entityData,
        entityName: "Perfil",
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
            entityName="Perfil"
            formConfig={formConfig}
            entity={role}
            description="Preencha os dados do perfil e clique em salvar quando terminar."
            fields={[
                {
                    name: "name",
                    label: "Nome",
                    placeholder: "Nome do perfil",
                    required: true,
                },
            ]}
        />
    )
}


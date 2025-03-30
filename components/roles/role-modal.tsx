"use client"

import { useRoles } from "@/contexts/roles-context"
import { EntityModal } from "@/components/ui/entity-modal"
import { useEntityModal } from "@/hooks/use-entity-modal"
import { RoleForm, roleSchema, roleDefaultValues, type RoleFormValues } from "./role-form"
import { createRoleAction, updateRoleAction } from "@/app/roles/actions"
import type { Role } from "@/lib/roles"
import { useEffect } from "react"

interface RoleModalProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    role?: Role | null
}

export function RoleModal({ open, onOpenChange, role }: RoleModalProps) {
    const { addRole } = useRoles()
    const isEditMode = !!role

    const handleSubmit = async (values: RoleFormValues) => {
        if (isEditMode && role) {
            return updateRoleAction({
                id: role.id,
                ...values,
            })
        } else {
            return createRoleAction(values)
        }
    }

    const {
        isSubmitting,
        error,
        form,
        handleSubmit: onSubmit,
    } = useEntityModal<RoleFormValues, Role>({
        schema: roleSchema,
        defaultValues: role
            ? { ...roleDefaultValues, name: role.name }
            : roleDefaultValues,
        onSubmit: handleSubmit,
        entity: role,
        entityName: "Role",
        onSuccess: (result) => {
            if (!isEditMode) {
                addRole(result);
            }
            onOpenChange(false)
        },
    })

    // Atualiza os valores do formulário sempre que o modal abrir
    useEffect(() => {
        if (open) {
            const values = role
                ? { ...roleDefaultValues, name: role.name }
                : roleDefaultValues

            form.reset(values)
        }
    }, [open, role, form])

    return (
        <EntityModal
            open={open}
            onOpenChange={onOpenChange}
            title={isEditMode ? "Editar Role" : "Adicionar Novo Role"}
            description={
                isEditMode
                    ? "Edite os dados do role e clique em salvar quando terminar."
                    : "Preencha os dados do role e clique em salvar quando terminar."
            }
            isSubmitting={isSubmitting}
            error={error}
        >
            <RoleForm form={form} onSubmit={onSubmit} isSubmitting={isSubmitting} />
        </EntityModal>
    )
}


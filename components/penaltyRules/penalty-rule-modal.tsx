"use client"
import { z } from "zod"
import { EntityModal } from "@/components/ui/entity-modal-2"
import { useEntityForm } from "@/hooks/use-entity-form"
import { createPenaltyRuleAction, updatePenaltyRuleAction } from "@/app/penalty-rules/actions"
import type { PenaltyRule } from "@/lib/penaltyrules"
import { useMemo } from "react"

// Schema de validação
const penaltyRuleSchema = z.object({
    name: z.string().min(2, { message: "Nome deve ter pelo menos 2 caracteres" }),
    description: z.string().min(5, { message: "Descrição deve ter pelo menos 5 caracteres" }),
    finePerDay: z.coerce.number().positive({ message: "Multa por dia deve ser um número positivo" }),
    minDaysLate: z.coerce.number().positive({ message: "Número mínimo de dias de atraso deve ser positivo" }),
    maxDaysLate: z.coerce.number().min(0, { message: "Número máximo de dias de atraso deve ser positivo" }),
})

// Tipo derivado do schema
type PenaltyRuleFormValues = z.infer<typeof penaltyRuleSchema>

// Valores padrão
const defaultValues: PenaltyRuleFormValues = {
    name: "",
    description: "",
    finePerDay: 0,
    minDaysLate: 0,
    maxDaysLate: 0,
}

interface PenaltyRuleModalProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    penaltyRule?: PenaltyRule | null
    onSuccess?: (penaltyRule: PenaltyRule) => void
}

export function PenaltyRuleModal({ open, onOpenChange, penaltyRule, onSuccess }: PenaltyRuleModalProps) {
    const isEditMode = !!penaltyRule

    // Utilizar useMemo para prevenir criar um novo objeto a cada render
    const entityData = useMemo(() => {
        return penaltyRule ? {
            name: penaltyRule.name,
            description: penaltyRule.description,
            finePerDay: penaltyRule.finePerDay,
            minDaysLate: penaltyRule.minDaysLate,
            maxDaysLate: penaltyRule.maxDaysLate ?? 0
        } : null
    }, [penaltyRule])

    const formConfig = useEntityForm<PenaltyRuleFormValues, PenaltyRule>({
        schema: penaltyRuleSchema,
        defaultValues,
        onSubmit: async (values) => {
            if (isEditMode && penaltyRule) {
                return updatePenaltyRuleAction({
                    id: penaltyRule.id,
                    ...values,
                })
            } else {
                return createPenaltyRuleAction(values)
            }
        },
        entity: entityData,
        entityName: "Regra",
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
            entityName="Regra"
            formConfig={formConfig}
            entity={penaltyRule}
            description="Preencha os dados da regra e clique em salvar quando terminar."
            fields={[
                {
                    name: "name",
                    label: "Nome",
                    placeholder: "Nome da regra",
                    required: true,
                },
                {
                    name: "description",
                    label: "Descrição",
                    type: "textarea",
                    placeholder: "Breve descrição da regra",
                    required: true,
                },
                {
                    name: "finePerDay",
                    label: "Valor p/ dia",
                    type: "number",
                    placeholder: "0",
                    required: true,
                },
                {
                    name: "minDaysLate",
                    label: "Mínimo de dias de atraso",
                    type: "number",
                    placeholder: "0",
                    required: true,
                },
                {
                    name: "maxDaysLate",
                    label: "Máximo de dias de atraso",
                    type: "number",
                    placeholder: "0",
                    required: false,
                },
            ]}
        />
    )
}


"use client"

import { useState, useEffect } from "react"
import { DefaultValues, useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "@/components/ui/use-toast"
import type { z } from "zod"

interface UseEntityModalOptions<T, U> {
    schema: z.ZodType<T>
    defaultValues: T
    onSubmit: (values: T) => Promise<U>
    entity?: any
    entityName: string
    onSuccess?: (result: U) => void
}

export function useEntityModal<T extends Record<string, any>, U>({
    schema,
    defaultValues,
    onSubmit,
    entity,
    entityName,
    onSuccess,
}: UseEntityModalOptions<T, U>) {
    const isEditMode = !!entity
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [open, setOpen] = useState(false)

    const form = useForm<T>({
        resolver: zodResolver(schema),
        defaultValues: entity ? { ...defaultValues, ...entity } : defaultValues, // Garante que os valores iniciais são corretos
    })

    useEffect(() => {
        if (open) {
            const values = entity ? { ...defaultValues, ...entity } : defaultValues;

            form.reset(values);
            setError(null);
        }
    }, [open, entity, form, defaultValues]);


    const handleSubmit = async (values: T) => {
        setError(null)
        try {
            setIsSubmitting(true)
            const result = await onSubmit(values)

            setOpen(false)
            form.reset()

            toast({
                title: isEditMode ? `${entityName} atualizado com sucesso` : `${entityName} criado com sucesso`,
                description: `O ${entityName.toLowerCase()} foi ${isEditMode ? "atualizado" : "adicionado"} com sucesso.`,
            })

            if (onSuccess) {
                onSuccess(result)
            }
        } catch (error: any) {
            setError(
                error.message || `Ocorreu um erro ao ${isEditMode ? "atualizar" : "criar"} o ${entityName.toLowerCase()}`,
            )

            toast({
                title: `Erro ao ${isEditMode ? "atualizar" : "criar"} ${entityName.toLowerCase()}`,
                description: error.message || `Ocorreu um erro. Tente novamente.`,
                variant: "destructive",
            })
        } finally {
            setIsSubmitting(false)
        }
    }

    return {
        isEditMode,
        isSubmitting,
        error,
        open,
        setOpen,
        form,
        handleSubmit: form.handleSubmit(handleSubmit),
    }
}


"use client"

import { useState, useEffect } from "react"
import { useForm, type DefaultValues, type FieldValues } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "@/components/ui/use-toast"
import type { z } from "zod"

interface UseEntityFormOptions<T extends FieldValues, U> {
    schema: z.ZodType<T> // Esquema de validação (Zod)
    defaultValues: DefaultValues<T> // Valores padrão
    onSubmit: (values: T) => Promise<U> // Função para criar/editar entidade
    entity?: Partial<T> | null // Se existir, é edição; senão, é criação
    entityName: string // Nome da entidade (ex: "Tradutor", "Usuário")
    onSuccess?: (result: U) => void // Callback após submissão bem-sucedida
    onClose?: () => void // Callback quando o modal é fechado
}

export function useEntityForm<T extends FieldValues, U>({
    schema,
    defaultValues,
    onSubmit,
    entity,
    entityName,
    onSuccess,
    onClose,
}: UseEntityFormOptions<T, U>) {
    const isEditMode = !!entity
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [isDirty, setIsDirty] = useState(false)

    const form = useForm<T>({
        resolver: zodResolver(schema),
        defaultValues: entity ? ({ ...defaultValues, ...entity } as DefaultValues<T>) : defaultValues,
    })

    // Monitorar mudanças no formulário
    useEffect(() => {
        const subscription = form.watch(() => {
            setIsDirty(true)
        })
        return () => subscription.unsubscribe()
    }, [form])

    // Reset do formulário quando a entidade muda
    useEffect(() => {
        if (entity) {
            form.reset({ ...defaultValues, ...entity } as DefaultValues<T>)
        } else {
            form.reset(defaultValues)
        }
        setError(null)
        setIsDirty(false)
    }, [entity, form, defaultValues])

    // Limpar estado quando o modal fechar
    const handleClose = () => {
        setError(null)
        setIsDirty(false)
        form.reset(defaultValues)
        if (onClose) {
            onClose()
        }
    }

    const handleSubmit = async (values: T) => {
        setError(null)
        try {
            setIsSubmitting(true)
            const result = await onSubmit(values)

            toast({
                title: isEditMode ? `${entityName} atualizado com sucesso` : `${entityName} criado com sucesso`,
                description: `O ${entityName.toLowerCase()} foi ${isEditMode ? "atualizado" : "adicionado"} com sucesso.`,
            })

            setIsDirty(false)
            form.reset(defaultValues)

            if (onSuccess) {
                onSuccess(result)
            }
        } catch (error: any) {
            setError(error.message || `Erro ao ${isEditMode ? "atualizar" : "criar"} ${entityName.toLowerCase()}`)
            toast({
                title: `Erro ao ${isEditMode ? "atualizar" : "criar"} ${entityName.toLowerCase()}`,
                description: error.message || "Ocorreu um erro. Tente novamente.",
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
        isDirty,
        form,
        handleSubmit: form.handleSubmit(handleSubmit),
        handleClose,
    }
}
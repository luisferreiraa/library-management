"use client"

import { useState, useEffect } from "react"
import { useForm, type DefaultValues, type FieldValues } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
/* import { toast } from "@/components/ui/use-toast" */
import { toast } from "react-toastify"
import type { z } from "zod"

// Tipo para o género da entidade
type EntityGender = "masculine" | "feminine" | "neutral"

interface UseEntityFormOptions<T extends FieldValues, U> {
    schema: z.ZodType<T> // Esquema de validação (Zod)
    defaultValues: DefaultValues<T> // Valores padrão
    onSubmit: (values: T) => Promise<U> // Função para criar/editar entidade
    entity?: Partial<T> | null // Se existir, é edição; senão, é criação
    entityName: string // Nome da entidade (ex: "Tradutor", "Usuário")
    entityGender?: EntityGender // Propriedade para género da entidade
    onSuccess?: (result: U) => void // Callback após submissão bem-sucedida
    onClose?: () => void // Callback quando o modal é fechado
}

export function useEntityForm<T extends FieldValues, U>({
    schema,
    defaultValues,
    onSubmit,
    entity,
    entityName,
    entityGender = "masculine",
    onSuccess,
    onClose,
}: UseEntityFormOptions<T, U>) {
    // Determina se o formulário está em modo de edição ou criação
    const isEditMode = !!entity
    // Estado para indicar se a submissão está em andamento
    const [isSubmitting, setIsSubmitting] = useState(false)
    // Estado para armazenar mensagens de erro
    const [error, setError] = useState<string | null>(null)
    const [isDirty, setIsDirty] = useState(false)

    // Função para obter a terminação correta baseada no género
    const getGenderSuffix = () => {
        if (entityGender === "feminine") {
            return isEditMode ? "atualizada" : "adicionada"
        } else if (entityGender === "neutral") {
            return isEditMode ? "atualizado(a)" : "adicionado(a)"
        } else {
            // Masculino (padrão)
            return isEditMode ? "atualizado" : "adicionado"
        }
    }

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
        // Don't reset the form here, as it will be reset when the modal is reopened
        if (onClose) {
            onClose()
        }
    }

    const handleSubmit = async (values: T) => {
        setError(null)
        try {
            setIsSubmitting(true)
            const result = await onSubmit(values)

            toast.success(`${entityName} ${getGenderSuffix()} com sucesso.`, {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
            })

            setIsDirty(false)
            form.reset(defaultValues)

            if (onSuccess) {
                onSuccess(result)
            }
        } catch (error: any) {
            setError(error.message || `Erro ao ${isEditMode ? "atualizar" : "criar"} ${entityName.toLowerCase()}`)

            toast.error(
                error.message ||
                `Ocorreu um erro ao ${isEditMode ? "atualizar" : "criar"} ${entityName.toLowerCase()}. Tente novamente.`,
                {
                    position: "top-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                },
            )

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


"use client"

import { useState, useEffect } from "react"
import { DefaultValues, useForm } from "react-hook-form"    // Gerencia formulários com React Hook Form
import { zodResolver } from "@hookform/resolvers/zod"
/* import { toast } from "@/components/ui/use-toast" */
import { toast } from "react-toastify"
import type { z } from "zod"    // Para definição de esquemas de validação

// Interface que define as opções que são aceites pelo hook useEntityModal
interface UseEntityModalOptions<T, U> {
    schema: z.ZodType<T>    // Esquema de validação
    defaultValues: T    // Valores padrão do formulário
    onSubmit: (values: T) => Promise<U>     // Função assíncrona para submissão
    entity?: any    // Dados opcionais da entidade, usados em modo de edição
    entityName: string      // Nome da entidade, usado nas mensagens do toast
    onSuccess?: (result: U) => void     // Função opcional chamada após sucesso na submissão
}

// Hook personalizado para gerir a lógica de criação e edição de entidades
export function useEntityModal<T extends Record<string, any>, U>({
    schema,
    defaultValues,
    onSubmit,
    entity,
    entityName,
    onSuccess,
}: UseEntityModalOptions<T, U>) {
    // Define se o modal está no modo de edição, baseado na existência de uma entidade
    const isEditMode = !!entity
    // Controla se o formulário está em processo de submissão
    const [isSubmitting, setIsSubmitting] = useState(false)
    // Armazena mensagens de erro
    const [error, setError] = useState<string | null>(null)
    // Estado para controlar a visibilidade do modal
    const [open, setOpen] = useState(false)

    const form = useForm<T>({
        // Usa o esquema do Zod para validar campos do formulário
        resolver: zodResolver(schema),
        // Define os valores iniciais do formulário (preenchidos no modo de edição)
        defaultValues: entity ? { ...defaultValues, ...entity } : defaultValues, // Garante que os valores iniciais são corretos
    })

    useEffect(() => {
        // Sempre que o modal for aberto, os valores do formulário são redefinidos
        if (open) {
            const values = entity ? { ...defaultValues, ...entity } : defaultValues;

            form.reset(values);     // Reseta os valores do formulário
            setError(null);     // Limpa mensagens de erro
        }
        // Dependências do efeito: executa quando open, entity, form ou defaultValues mudam
    }, [open, entity, form, defaultValues]);


    const handleSubmit = async (values: T) => {
        setError(null)      // Limpa qualquer erro anterior
        try {
            setIsSubmitting(true)       // Indica que a submissão está em andamento
            const result = await onSubmit(values)       // Executa a função de submissão

            setOpen(false)  // Fecha o modal após submissão bem sucedida
            form.reset()    // Reseta o formulário para os valores padrão

            // Exibe uma mensagem de sucesso para o utilizador
            toast.success(`O ${entityName.toLowerCase()} foi ${isEditMode ? "atualizado" : "adicionado"} com sucesso.`, {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
            })

            if (onSuccess) {
                onSuccess(result)   // Executa função de sucesso
            }
        } catch (error: any) {
            // Captura erros da submissão
            setError(
                error.message || `Ocorreu um erro ao ${isEditMode ? "atualizar" : "criar"} o ${entityName.toLowerCase()}`,
            )

            // Exibe um toast de erro
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
            setIsSubmitting(false)  // Finaliza o estado de submissão
        }
    }

    return {
        isEditMode,     // Indica se está no modo de edição
        isSubmitting,   // Indica se está a submeter os dados
        error,      // Contém mensagens de erro, se houver
        open,       // Estado que controla se o modal está visível
        setOpen,    // Função para abrir ou fechar o modal
        form,       // Objeto do React Hook Form para gestão do formulário
        // Função de submissão já integrada ao React Hook Form
        handleSubmit: form.handleSubmit(handleSubmit),
    }
}
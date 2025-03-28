"use client"

import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { useLanguages } from "@/contexts/languages-context"
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { toast } from "@/components/ui/use-toast"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { createLanguageAction, updateLanguageAction } from "@/app/languages/actions"
import { Language } from "@/lib/languages"

const formSchema = z.object({
    name: z.string().min(2, { message: "Nome deve ter pelo menos 2 caracteres" }),
})

type FormValues = z.infer<typeof formSchema>

interface CreateLanguageModalProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    language?: Language | null
}

export function CreateLanguageModal({ open, onOpenChange, language }: CreateLanguageModalProps) {
    const isEditMode = !!language
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const { addLanguage } = useLanguages()

    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
        },
    })

    // Atualizar valores quando a categoria muda ou o modal abre/ fecha
    useEffect(() => {
        if (open) {
            form.reset({
                name: language?.name || "",
            })
            setError(null)
        }
    }, [open, language, form])

    async function onSubmit(values: FormValues) {
        setError(null)
        try {
            setIsSubmitting(true)

            let resultLanguage

            if (isEditMode && language) {
                // Atualizar idioma via Server Action
                resultLanguage = await updateLanguageAction({
                    id: language.id,
                    ...values,
                })
            } else {
                resultLanguage = await createLanguageAction(values)
            }

            // Atualizar UI otimisticamente
            addLanguage(resultLanguage)

            // Fechar modal e mostrar toast
            onOpenChange(false)
            form.reset()

            toast({
                title: isEditMode ? "Idioma atualizado com sucesso" : "Idioma criado com sucesso",
                description: `${resultLanguage.name} foi ${isEditMode ? "atualizado" : "adicionado"} à lista de idiomas.`,
            })
        } catch (error: any) {
            setError(error.message || `Ocorreu um erro ao ${isEditMode ? "atualizar" : "criar"} o idioma.`)

            toast({
                title: `Erro ao ${isEditMode ? "atualizar" : "criar"} idioma`,
                description: error.message || `Ocorreu um erro ao ${isEditMode ? "atualizar" : "criar"} a idioma. Tente novamente.`,
                variant: "destructive",
            })
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>{isEditMode ? "Editar Idioma" : "Criar Novo Idioma"}</DialogTitle>
                    <DialogDescription>Preencha os dados do idioma e clique em salvar quando terminar.</DialogDescription>
                </DialogHeader>

                {error && (
                    <Alert variant="destructive" className="mt-4">
                        <AlertDescription>{error}</AlertDescription>
                    </Alert>
                )}

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Nome</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Nome do idioma" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <DialogFooter>
                            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isSubmitting}>
                                Cancelar
                            </Button>
                            <Button type="submit" disabled={isSubmitting}>
                                {isSubmitting ? "Salvando..." : "Salvar"}
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}


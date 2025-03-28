"use client"

import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { useTranslators } from "@/contexts/translators-context"
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
import { createTranslatorAction, updateTranslatorAction } from "@/app/translators/actions"
import { Translator } from "@/lib/translators"

const formSchema = z.object({
    name: z.string().min(2, { message: "Nome deve ter pelo menos 2 caracteres" }),
})

type FormValues = z.infer<typeof formSchema>

interface CreateTranslatorModalProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    translator?: Translator | null
}

export function CreateTranslatorModal({ open, onOpenChange, translator }: CreateTranslatorModalProps) {
    const isEditMode = !!translator
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const { addTranslator } = useTranslators()

    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
        },
    })

    // Atualizar valores quando o tradutor muda ou o modal abre/ fecha
    useEffect(() => {
        if (open) {
            form.reset({
                name: translator?.name || "",
            })
            setError(null)
        }
    }, [open, translator, form])

    async function onSubmit(values: FormValues) {
        setError(null)
        try {
            setIsSubmitting(true)

            let resultTranslator

            if (isEditMode && translator) {
                // Atualizar traadutor via Server Action
                resultTranslator = await updateTranslatorAction({
                    id: translator.id,
                    ...values,
                })
            } else {
                resultTranslator = await createTranslatorAction(values)
            }

            // Atualizar UI otimisticamente
            addTranslator(resultTranslator)

            // Fechar modal e mostrar toast
            onOpenChange(false)
            form.reset()

            toast({
                title: isEditMode ? "Tradutor atualizado com sucesso" : "Tradutor criado com sucesso",
                description: `${resultTranslator.name} foi ${isEditMode ? "atualizado" : "adicionado"} à lista de tradutores.`,
            })
        } catch (error: any) {
            setError(error.message || `Ocorreu um erro ao ${isEditMode ? "atualizar" : "criar"} o tradutor.`)

            toast({
                title: `Erro ao ${isEditMode ? "atualizar" : "criar"} tradutor`,
                description: error.message || `Ocorreu um erro ao ${isEditMode ? "atualizar" : "criar"} o tradutor. Tente novamente.`,
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
                    <DialogTitle>{isEditMode ? "Editar Tradutor" : "Criar Novo Tradutor"}</DialogTitle>
                    <DialogDescription>Preencha os dados do tradutor e clique em salvar quando terminar.</DialogDescription>
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
                                        <Input placeholder="Nome do tradutor" {...field} />
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


"use client"

import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { usePublishers } from "@/contexts/publishers-context"
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
import { createPublisherAction, updatePublisherAction } from "@/app/publishers/actions"
import { Publisher } from "@/lib/publishers"

const formSchema = z.object({
    name: z.string().min(2, { message: "Nome deve ter pelo menos 2 caracteres" }),
})

type FormValues = z.infer<typeof formSchema>

interface CreatePublisherModalProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    publisher?: Publisher | null
}

export function CreatePublisherModal({ open, onOpenChange, publisher }: CreatePublisherModalProps) {
    const isEditMode = !!publisher
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const { addPublisher } = usePublishers()

    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
        },
    })

    // Atualizar valores quando a editora muda ou o modal abre/ fecha
    useEffect(() => {
        if (open) {
            form.reset({
                name: publisher?.name || "",
            })
            setError(null)
        }
    }, [open, publisher, form])

    async function onSubmit(values: FormValues) {
        setError(null)
        try {
            setIsSubmitting(true)

            let resultPublisher

            if (isEditMode && publisher) {
                // Atualizar editora via Server Action
                resultPublisher = await updatePublisherAction({
                    id: publisher.id,
                    ...values,
                })
            } else {
                resultPublisher = await createPublisherAction(values)
            }

            // Atualizar UI otimisticamente
            addPublisher(resultPublisher)

            // Fechar modal e mostrar toast
            onOpenChange(false)
            form.reset()

            toast({
                title: isEditMode ? "Editora atualizada com sucesso" : "Editora criada com sucesso",
                description: `${resultPublisher.name} foi ${isEditMode ? "atualizada" : "adicionada"} à lista de editoras.`,
            })
        } catch (error: any) {
            setError(error.message || `Ocorreu um erro ao ${isEditMode ? "atualizar" : "criar"} a editora.`)

            toast({
                title: `Erro ao ${isEditMode ? "atualizar" : "criar"} editora`,
                description: error.message || `Ocorreu um erro ao ${isEditMode ? "atualizar" : "criar"} a editora. Tente novamente.`,
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
                    <DialogTitle>Criar Nova Editora</DialogTitle>
                    <DialogDescription>Preencha os dados da editora e clique em salvar quando terminar.</DialogDescription>
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
                                        <Input placeholder="Nome da editora" {...field} />
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


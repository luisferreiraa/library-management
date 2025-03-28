"use client"

import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { useFormats } from "@/contexts/formats-context"
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
import { createFormatAction, updateFormatAction } from "@/app/formats/actions"
import { Format } from "@/lib/formats"

const formSchema = z.object({
    name: z.string().min(2, { message: "Nome deve ter pelo menos 2 caracteres" }),
})

type FormValues = z.infer<typeof formSchema>

interface CreateFormatModalProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    format?: Format | null
}

export function CreateFormatModal({ open, onOpenChange, format }: CreateFormatModalProps) {
    const isEditMode = !!format
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const { addFormat } = useFormats()

    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
        },
    })

    // Atualizar valores quando o formato muda ou o modal abre/ fecha
    useEffect(() => {
        if (open) {
            form.reset({
                name: format?.name || "",
            })
            setError(null)
        }
    }, [open, format, form])

    async function onSubmit(values: FormValues) {
        setError(null)
        try {
            setIsSubmitting(true)

            let resultFormat

            if (isEditMode && format) {
                // Atualizar formato via Server Action
                resultFormat = await updateFormatAction({
                    id: format.id,
                    ...values,
                })
            } else {
                resultFormat = createFormatAction(values)
            }

            // Atualizar UI otimisticamente
            addFormat(resultFormat)

            // Fechar modal e mostrar toast
            onOpenChange(false)
            form.reset()

            toast({
                title: isEditMode ? "Formato atualizado com sucesso" : "Formato criado com sucesso",
                description: `${resultFormat.name} foi ${isEditMode ? "atualizado" : "adicionado"} à lista de formatos.`,
            })
        } catch (error: any) {
            setError(error.message || `Ocorreu um erro ao ${isEditMode ? "atualizar" : "criar"} o formato.`)

            toast({
                title: `Erro ao ${isEditMode ? "atualizar" : "criar"} formato`,
                description: error.message || `Ocorreu um erro ao ${isEditMode ? "atualizar" : "criar"} o formato. Tente novamente.`,
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
                    <DialogTitle>{isEditMode ? "Editar Formato" : "Criar Novo Formato"}</DialogTitle>
                    <DialogDescription>Preencha os dados do formato e clique em salvar quando terminar.</DialogDescription>
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
                                        <Input placeholder="Nome do formato" {...field} />
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


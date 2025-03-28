"use client"

import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { useBookStatuses } from "@/contexts/bookstatus-context"
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
import { createBookStatusAction, updateBookStatusAction } from "@/app/book-status/actions"
import { BookStatus } from "@/lib/bookstatus"

const formSchema = z.object({
    name: z.string().min(2, { message: "Nome deve ter pelo menos 2 caracteres" }),
})

type FormValues = z.infer<typeof formSchema>

interface CreateBookStatusModalProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    bookStatus?: BookStatus | null
}

export function CreateBookStatusModal({ open, onOpenChange, bookStatus }: CreateBookStatusModalProps) {
    const isEditMode = !!bookStatus
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const { addBookStatus } = useBookStatuses()

    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
        },
    })

    // Atualizar valores quando o book status muda ou o modal abre/ fecha
    useEffect(() => {
        if (open) {
            form.reset({
                name: bookStatus?.name || "",
            })
            setError(null)
        }
    }, [open, bookStatus, form])

    async function onSubmit(values: FormValues) {
        setError(null)
        try {
            setIsSubmitting(true)

            let resultBookStatus

            if (isEditMode && bookStatus) {
                // Atualizar book status via Server Action
                resultBookStatus = await updateBookStatusAction({
                    id: bookStatus.id,
                    ...values,
                })
            } else {
                resultBookStatus = await createBookStatusAction(values)
            }

            // Atualizar UI otimisticamente
            addBookStatus(resultBookStatus)

            // Fechar modal e mostrar toast
            onOpenChange(false)
            form.reset()

            toast({
                title: isEditMode ? "Book Status atualizado com sucesso" : "Book Status criado com sucesso",
                description: `${resultBookStatus.name} foi ${isEditMode ? "atualizado" : "adicionado"} à lista de book status.`,
            })
        } catch (error: any) {
            setError(error.message || `Ocorreu um erro ao ${isEditMode ? "atualizar" : "criar"} o book status.`)

            toast({
                title: `Erro ao ${isEditMode ? "atualizar" : "criar"} book status`,
                description: error.message || `Ocorreu um erro ao ${isEditMode ? "atualizar" : "criar"} o book status. Tente novamente.`,
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
                    <DialogTitle>{isEditMode ? "Editar Book Status" : "Criar Novo Book Status"}</DialogTitle>
                    <DialogDescription>Preencha os dados do book status e clique em salvar quando terminar.</DialogDescription>
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
                                        <Input placeholder="Nome do book status" {...field} />
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


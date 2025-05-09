"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
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
import { toast } from "react-toastify"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { createBarcodeAction } from "@/app/books/actions"
import { PlusCircle } from "lucide-react"

const formSchema = z.object({
    code: z.string().min(12, { message: "O código deve ter pelo menos 12 dígitos" }),
})

type FormValues = z.infer<typeof formSchema>

interface CreateBarcodeModalProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    bookId: string      // O ID do livro é passado como prop
}

export function CreateBarcodeModal({ open, onOpenChange, bookId }: CreateBarcodeModalProps) {
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            code: "",
        },
    })

    async function onSubmit(values: FormValues) {
        setError(null)
        try {
            setIsSubmitting(true)

            // Criar barcode via Server Action
            const newBarcode = await createBarcodeAction({
                bookId,
                code: values.code,
            })

            // Fechar modal e mostrar toast
            onOpenChange(false)
            form.reset()

            toast.success("Código de barras adicionado com sucesso", {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
            })

        } catch (error: any) {
            setError(error.message || "Ocorreu um erro ao criar o código de barras")

            toast.error("Erro ao adicionar código de barras", {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
            })

        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Adicionar Código de Barras</DialogTitle>
                    <DialogDescription>Preencha o código de barras e clique em salvar.</DialogDescription>
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
                            name="code"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Código</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Digite o código de barras" {...field} />
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
                                {isSubmitting ? "A salvar..." : <><PlusCircle className="mr-2 h-4 w-4" /> Adicionar</>}
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}


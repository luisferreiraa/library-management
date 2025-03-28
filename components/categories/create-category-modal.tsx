"use client"

import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { useCategories } from "@/contexts/categories-context"
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
import { createCategoryAction, updateCategoryAction } from "@/app/categories/actions"
import { Category } from "@/lib/categories"

const formSchema = z.object({
    name: z.string().min(2, { message: "Nome deve ter pelo menos 2 caracteres" }),
})

type FormValues = z.infer<typeof formSchema>

interface CreateCategoryModalProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    category?: Category | null
}

export function CreateCategoryModal({ open, onOpenChange, category }: CreateCategoryModalProps) {
    const isEditMode = !!category
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const { addCategory } = useCategories()

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
                name: category?.name || "",
            })
            setError(null)
        }
    }, [open, category, form])

    async function onSubmit(values: FormValues) {
        setError(null)
        try {
            setIsSubmitting(true)

            let resultCategory

            if (isEditMode && category) {
                // Atualizar categoria via Server Action
                resultCategory = await updateCategoryAction({
                    id: category.id,
                    ...values,
                })
            } else {
                resultCategory = await createCategoryAction(values)
            }

            // Atualizar UI otimisticamente
            addCategory(resultCategory)

            // Fechar modal e mostrar toast
            onOpenChange(false)
            form.reset()

            toast({
                title: isEditMode ? "Categoria atualizada com sucesso" : "Categoria criada com sucesso",
                description: `${resultCategory.name} foi ${isEditMode ? "atualizado" : "adicionado"} à lista de categorias.`,
            })
        } catch (error: any) {
            setError(error.message || `Ocorreu um erro ao ${isEditMode ? "atualizar" : "criar"} a categoria.`)

            toast({
                title: `Erro ao ${isEditMode ? "atualizar" : "criar"} categoria`,
                description: error.message || `Ocorreu um erro ao ${isEditMode ? "atualizar" : "criar"} a categoria. Tente novamente.`,
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
                    <DialogTitle>Criar Nova Categoria</DialogTitle>
                    <DialogDescription>Preencha os dados da categoria e clique em salvar quando terminar.</DialogDescription>
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
                                        <Input placeholder="Nome da categoria" {...field} />
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


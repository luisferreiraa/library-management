"use client"

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useEffect, useState } from "react"
import { createCatalogItemAction, updateCatalogItemAction } from "@/app/catalog-items/actions"
import { toast } from "react-toastify"
import { CatalogItem } from "@prisma/client"

const schema = z.object({
    type: z.string().min(1, "Tipo de item é obrigatório"),
    title: z.string().min(1, "Título é obrigatório"),
    subTitle: z.string().min(1, "Subtítulo é obrigatório"),
    isActive: z.boolean(),
})

type FormValues = z.infer<typeof schema>

interface CreateCatalogItemProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    catalogId: string
    catalogName: string
    catalogItem?: CatalogItem | null
    onSuccess?: () => void
}

export function CreateCatalogItemModal({
    open,
    onOpenChange,
    catalogId,
    catalogName,
    catalogItem,
    onSuccess,
}: CreateCatalogItemProps) {
    const [error, setError] = useState<string | null>(null)
    const isEditMode = !!catalogItem

    const form = useForm<FormValues>({
        resolver: zodResolver(schema),
        defaultValues: {
            type: "",
            title: "",
            subTitle: "",
            isActive: true,
        }
    })

    useEffect(() => {
        if (catalogItem) {
            form.reset({
                type: catalogItem.type,
                title: catalogItem.title,
                subTitle: catalogItem.subTitle,
                isActive: catalogItem.isActive,
            })
        } else {
            form.reset({
                type: "",
                title: "",
                subTitle: "",
                isActive: true,
            })
        }
    }, [catalogItem, form])

    const handleOpenChange = (open: boolean) => {
        if (!open) {
            form.reset()
            setError(null)
        }
        onOpenChange(open)
    }

    const onSubmit = async (values: FormValues) => {
        setError(null)
        try {
            const result = isEditMode && catalogItem
                ? await updateCatalogItemAction({
                    id: catalogItem.id,
                    type: values.type,
                    title: values.title,
                    subTitle: values.subTitle,
                    catalogId: catalogId,
                    isActive: values.isActive
                })
                : await createCatalogItemAction({
                    type: values.type,
                    title: values.title,
                    subTitle: values.subTitle,
                    catalogId: catalogId,
                    isActive: values.isActive,
                    data: values.data as T extends 'BOOK' ? Prisma.BookCreateInput :
                        T extends 'PERIODICAL' ? Prisma.PeriodicalCreateInput :
                        T extends 'DVD' ? Prisma.DVDCreateInput :
                        T extends 'VHS' ? Prisma.VHSCreateInput :
                        T extends 'CD' ? Prisma.CDCreateInput :
                        never
                })

            toast.success(
                isEditMode
                    ? "Item atualizado com sucesso"
                    : "Item criado com sucesso",
                {
                    position: "top-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                }
            )

            handleOpenChange(false)
            onSuccess?.()
        } catch (error: any) {
            const errorMessage = error.message ||
                (isEditMode ? "Erro ao atualizar item" : "Erro ao criar item")

            setError(errorMessage)

            toast.error(errorMessage, {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
            })
        }
    }

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                    <DialogTitle>
                        {isEditMode ? `Editar Item ${catalogItem?.title}` : `Adicionar Novo Item para ${catalogName}`}
                    </DialogTitle>
                    <DialogDescription>
                        {isEditMode
                            ? "Atualize os dados do item e clique em salvar quando terminar."
                            : "Preencha os dados do item e clique em salvar quando terminar."}
                    </DialogDescription>
                </DialogHeader>

                {error && (
                    <Alert variant="destructive" className="mt-4">
                        <AlertDescription>{error}</AlertDescription>
                    </Alert>
                )}

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 mt-4">
                        <FormField
                            control={form.control}
                            name="title"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Título do Item</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="Título do item"
                                            {...field}
                                            value={field.value || ""}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="subTitle"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Subtítulo do Item</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="Subtítulo do item"
                                            {...field}
                                            value={field.value || ""}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="isActive"
                            render={({ field }) => (
                                <FormItem className="flex items-center justify-between">
                                    <FormLabel>Ativo</FormLabel>
                                    <FormControl>
                                        <Switch
                                            checked={field.value}
                                            onCheckedChange={field.onChange}
                                        />
                                    </FormControl>
                                </FormItem>
                            )}
                        />

                        <div>
                            <FormLabel>Catálogo</FormLabel>
                            <Input value={catalogName} disabled />
                        </div>

                        <div className="flex justify-end gap-2">
                            <Button
                                type="button"
                                variant="ghost"
                                onClick={() => handleOpenChange(false)}
                            >
                                Cancelar
                            </Button>
                            <Button
                                type="submit"
                                disabled={form.formState.isSubmitting}
                            >
                                {form.formState.isSubmitting
                                    ? "A salvar..."
                                    : isEditMode ? "Atualizar" : "Salvar"}
                            </Button>
                        </div>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}
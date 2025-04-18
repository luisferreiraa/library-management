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
import { createCatalogAction, updateCatalogAction } from "@/app/catalogs/actions"
import { toast } from "react-toastify"
import { Catalog } from "@prisma/client"

const schema = z.object({
    name: z.string().min(2, "Nome deve ter pelo menos 2 caracteres"),
    isActive: z.boolean(),
})

type FormValues = z.infer<typeof schema>

interface CreateLibraryCatalogModalProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    libraryId: string
    libraryName: string
    catalog?: Catalog | null
    onSuccess?: () => void
}

export function CreateLibraryCatalogModal({
    open,
    onOpenChange,
    libraryId,
    libraryName,
    catalog,
    onSuccess,
}: CreateLibraryCatalogModalProps) {
    const [error, setError] = useState<string | null>(null)
    const isEditMode = !!catalog

    const form = useForm<FormValues>({
        resolver: zodResolver(schema),
        defaultValues: {
            name: "",
            isActive: true,
        },
    })

    // Atualiza os valores do formulário quando o catálogo muda
    useEffect(() => {
        if (catalog) {
            form.reset({
                name: catalog.name,
                isActive: catalog.isActive,
            })
        } else {
            form.reset({
                name: "",
                isActive: true,
            })
        }
    }, [catalog, form])

    const handleOpenChange = (open: boolean) => {
        if (!open) {
            form.reset()
            setError(null)
        }
        onOpenChange(open)
    }

    const onSubmit = async (values: FormValues) => {
        setError(null);
        try {
            let result;

            if (isEditMode && catalog) {
                result = await updateCatalogAction({
                    id: catalog.id,
                    name: values.name,
                    libraryId: libraryId, // Alterado de library.id para libraryId
                    isActive: values.isActive
                });
            } else {
                result = await createCatalogAction({
                    name: values.name,
                    libraryId: libraryId,
                    isActive: values.isActive
                });
            }

            if (!result.success) {
                throw new Error(result.error);
            }

            toast.success(
                isEditMode
                    ? "Catálogo atualizado com sucesso"
                    : "Catálogo criado com sucesso",
                {
                    position: "top-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                }
            );

            handleOpenChange(false);
            onSuccess?.();
        } catch (err: any) {
            const errorMessage = err.message ||
                (isEditMode ? "Erro ao atualizar catálogo" : "Erro ao criar catálogo");

            setError(errorMessage);

            toast.error(errorMessage, {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
            });
        }
    };

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                    <DialogTitle>
                        {isEditMode ? `Editar Catálogo ${catalog?.name}` : `Adicionar Novo Catálogo para ${libraryName}`}
                    </DialogTitle>
                    <DialogDescription>
                        {isEditMode
                            ? "Atualize os dados do catálogo e clique em salvar quando terminar."
                            : "Preencha os dados do catálogo e clique em salvar quando terminar."}
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
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Nome do Catálogo</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="Nome do catálogo"
                                            {...field}
                                            value={field.value || ""} // Garante que não seja undefined
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
                            <FormLabel>Biblioteca</FormLabel>
                            <Input value={libraryName} disabled />
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
                                    ? "Salvando..."
                                    : isEditMode ? "Atualizar" : "Salvar"}
                            </Button>
                        </div>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}
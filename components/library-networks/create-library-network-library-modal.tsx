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
import { createLibraryAction, updateLibraryAction } from "@/app/(super-admin)/libraries/actions"
import { toast } from "react-toastify"
import { Library } from "@prisma/client"

const schema = z.object({
    name: z.string().min(2, "Nome deve ter pelo menos 2 caracteres"),
    location: z.string().min(1, "Localização é obrigatório"),
    isActive: z.boolean(),
})

type FormValues = z.infer<typeof schema>

interface CreateLibraryNetworkLibraryModalProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    libraryNetworkId: string
    libraryNetworkName: string
    library?: Library | null
    onSuccess?: () => void
}

export function CreateLibraryNetworkLibraryModal({
    open,
    onOpenChange,
    libraryNetworkId,
    libraryNetworkName,
    library,
    onSuccess,
}: CreateLibraryNetworkLibraryModalProps) {
    const [error, setError] = useState<string | null>(null)
    const isEditMode = !!library

    const form = useForm<FormValues>({
        resolver: zodResolver(schema),
        defaultValues: {
            name: "",
            location: "",
            isActive: true,
        },
    })

    // Atualiza os valores do formulário quando o catálogo muda
    useEffect(() => {
        if (library) {
            form.reset({
                name: library.name,
                location: library.location,
                isActive: library.isActive,
            })
        } else {
            form.reset({
                name: "",
                location: "",
                isActive: true,
            })
        }
    }, [library, form])

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
            const result = isEditMode && library
                ? await updateLibraryAction({
                    id: library.id,
                    name: values.name,
                    location: values.location,
                    libraryNetworkId: libraryNetworkId,
                    isActive: values.isActive
                })
                : await createLibraryAction({
                    name: values.name,
                    location: values.location,
                    libraryNetworkId: libraryNetworkId,
                    isActive: values.isActive
                });

            if (!result.success) {
                throw new Error(result.error);
            }

            toast.success(
                isEditMode
                    ? "Biblioteca atualizada com sucesso"
                    : "Biblioteca criada com sucesso",
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
                (isEditMode ? "Erro ao atualizar biblioteca" : "Erro ao criar biblioteca");

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
                        {isEditMode ? `Editar Biblioteca ${library?.name}` : `Adicionar Nova Biblioteca para ${libraryNetworkName}`}
                    </DialogTitle>
                    <DialogDescription>
                        {isEditMode
                            ? "Atualize os dados da biblioteca e clique em salvar quando terminar."
                            : "Preencha os dados da biblioteca e clique em salvar quando terminar."}
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
                                    <FormLabel>Nome da Biblioteca</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="Nome da biblioteca"
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
                            name="location"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Localização da Biblioteca</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="Localização da biblioteca"
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
                            <FormLabel>Rede de Bibliotecas</FormLabel>
                            <Input value={libraryNetworkName} disabled />
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
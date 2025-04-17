"use client"

import { createCatalogAction } from "@/app/catalogs/actions"
import { zodResolver } from "@hookform/resolvers/zod"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { toast } from "react-toastify"
import { z } from "zod"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "../ui/dialog"
import { Alert, AlertDescription } from "../ui/alert"
import { EntityModal } from "../ui/entity-modal-2"
import { useEntityForm } from "@/hooks/use-entity-form"

const formSchema = z.object({
    name: z.string().min(1, { message: "Nome do catálogo é obrigatório" }),
    libraryId: z.string().min(1, { message: "Biblioteca é obrigatório" }),
    isActive: z.boolean()
})

type FormValues = z.output<typeof formSchema>

interface CreateLibraryCatalogModalProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    libraryId: string
    libraryName: string
}

export function CreateLibraryCatalogModal({
    open,
    onOpenChange,
    libraryId,
    libraryName,
}: CreateLibraryCatalogModalProps) {
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const formConfig = useEntityForm<FormValues, typeof formSchema>({
        schema: formSchema,
        defaultValues: {
            name: "",
            libraryId,
            isActive: true,
        },
    })

    async function onSubmit(values: FormValues) {
        setError(null)
        try {
            setIsSubmitting(true)

            await createCatalogAction(values)

            onOpenChange(false)
            formConfig.form.reset()

            toast.success("Catálogo criado com sucesso", {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
            })
        } catch (error: any) {
            setError(error.message || "Ocorreu um erro ao criar o catálogo")

            toast.error("Ocorreu um erro ao criar o catálogo", {
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
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Criar catálogo</DialogTitle>
                    <DialogDescription>
                        Adicionar um novo catálogo para a biblioteca <strong>{libraryName}</strong>.
                    </DialogDescription>
                </DialogHeader>

                {error && (
                    <Alert variant="destructive">
                        <AlertDescription>{error}</AlertDescription>
                    </Alert>
                )}

                {error && (
                    <Alert variant="destructive">
                        <AlertDescription>{error}</AlertDescription>
                    </Alert>
                )}

                <EntityModal
                    open={open}
                    onOpenChange={onOpenChange}
                    entityName="Catálogo"
                    formConfig={formConfig}
                    fields={[
                        {
                            name: "name",
                            label: "Nome",
                            type: "text",
                            placeholder: "Nome do catálogo",
                        },
                        {
                            name: "isActive",
                            label: "Ativo",
                            type: "switch",
                        },
                    ]}
                />
            </DialogContent>
        </Dialog>
    )
}
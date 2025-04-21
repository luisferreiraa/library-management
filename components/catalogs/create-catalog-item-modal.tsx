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
import { BookCreateInput, CDCreateInput, DVDCreateInput, PeriodicalCreateInput, VHSCreateInput } from "@/lib/catalog-items"
import { ItemType } from "@prisma/client"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select"

// Tipos específicos para cada categoria de item
type BookData = BookCreateInput
type DvdData = DVDCreateInput
type CdData = CDCreateInput
type PeriodicalData = PeriodicalCreateInput
type VhsData = VHSCreateInput

// Union type para todos os tipos de dados
type ItemData = BookData | DvdData | CdData | PeriodicalData | VhsData

// Schema base com validação condicional
const baseSchema = z.object({
    type: z.nativeEnum(ItemType, {
        required_error: "Tipo de item é orbigatório",
    }),
    title: z.string().min(1, "Título é obrigatório"),
    subTitle: z.string().min(1, "Subtítulo é obrigatório"),
    isActive: z.boolean(),
})

// Schemas específicos para cada tipo
const bookSchema = baseSchema.extend({
    type: z.literal(ItemType.BOOK),
    data: z.object({
        isbn: z.string().min(10, { message: "ISBN inválido" }),
        publishingDate: z.date({ required_error: "Data de publicação é obrigatória" }),
        edition: z.coerce.number().int().positive({ message: "Edição deve ser um número positivo" }),
        pageCount: z.coerce.number().int().positive({ message: "Número de páginas deve ser um número positivo" }),
        summary: z.string().optional(),
        coverImage: z.string().optional(),
        formatId: z.string().min(1, { message: "Formato é obrigatório" }),
        languageId: z.string().min(1, { message: "Idioma é obrigatório" }),
        publisherId: z.string().min(1, { message: "Editora é obrigatória" }),
        authorId: z.string().min(1, { message: "Autor é obrigatório" }),
        translatorId: z.string().optional(),
        bookStatusId: z.string().min(1, { message: "Status é obrigatório" }),
        categoryIds: z.array(z.string()).min(1, { message: "Selecione pelo menos uma categoria" }),
    })
})

const dvdSchema = baseSchema.extend({
    type: z.literal(ItemType.DVD),
    data: z.object({
        director: z.string().min(1, "Realizador é obrigatório"),
        duration: z.number().min(1, "Duração deve ser maior do que 0"),
        studio: z.string().min(1, "Estúdio é obrigatório"),
        releaseYear: z.date({ required_error: "Data de edição é obrigatória" }),
        rating: z.number()
    })
})

const periodicalSchema = baseSchema.extend({
    type: z.literal(ItemType.PERIODICAL),
    data: z.object({
        issn: z.string().min(1, "ISSN é obrigatório"),
        issueNumber: z.string().min(1, "Número da edição é obrigatório"),
        volume: z.string().min(1, "Volume é obrigatório"),
        publicationDate: z.date({ required_error: "Data de publicação é obrigatória" }),
    })
})

const vhsSchema = baseSchema.extend({
    type: z.literal(ItemType.VHS),
    data: z.object({
        director: z.string().min(1, "Realizador é obrigatório"),
        duration: z.string().min(1, "Duração deve ser maior do que 0"),
    })
})

const cdSchema = baseSchema.extend({
    type: z.literal(ItemType.CD),
    data: z.object({
        artist: z.string().min(1, "Artista é obrigatório"),
        trackCount: z.string().min(1, "Número de faixas deve ser maior do que 0"),
        label: z.string().min(1, "Editora é obrigatório"),
        releaseYear: z.date({ required_error: "Data de lançamento é obrigatória" }),
    })
})

// Schema principal com discriminação
const schema = z.discriminatedUnion('type', [
    bookSchema,
    dvdSchema,
    periodicalSchema,
    vhsSchema,
    cdSchema,
])

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
            type: ItemType.BOOK,
            title: "",
            subTitle: "",
            isActive: true,
            data: {},
        }
    })

    // Observa mudanças no tipo para resetar os dados específicos
    const currentType = form.watch("type")

    // Reset do formulário quando o item ou o modal muda
    useEffect(() => {
        if (catalogItem) {
            form.reset({
                type: catalogItem.type as ItemType,
                title: catalogItem.title,
                subTitle: catalogItem.subTitle,
                isActive: catalogItem.isActive,
                data: catalogItem.data as any
            })
        } else if (!open) {
            form.reset({
                type: ItemType.BOOK,
                title: "",
                subTitle: "",
                isActive: true,
                data: {}
            })
        }
    }, [catalogItem, open, form])

    const handleOpenChange = (open: boolean) => {
        if (!open) {
            setError(null)
        }
        onOpenChange(open)
    }

    const onSubmit = async (values: FormValues) => {
        setError(null)
        try {
            if (isEditMode && catalogItem) {
                await updateCatalogItemAction(
                    catalogItem.id,
                    values.type,
                    values.data
                )
            } else {
                await createCatalogItemAction(
                    values.type,
                    catalogId,
                    values.title,
                    values.subTitle,
                    values.data
                )
            }

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
                        {isEditMode ? `Editar Item ${catalogItem?.title}` : `Adicionar Item para ${catalogName}`}
                    </DialogTitle>
                    <DialogDescription>
                        {isEditMode
                            ? "Atualize os dados do item"
                            : "Preencha os dados do novo item"}
                    </DialogDescription>
                </DialogHeader>

                {error && (
                    <Alert variant="destructive">
                        <AlertDescription>{error}</AlertDescription>
                    </Alert>
                )}

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="type"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Tipo de Item</FormLabel>
                                    <Select onValueChange={field.onChange} value={field.value}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Selecione o tipo" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectItem value={ItemType.BOOK}>Livro</SelectItem>
                                            <SelectItem value={ItemType.DVD}>DVD</SelectItem>
                                            <SelectItem value={ItemType.CD}>CD</SelectItem>
                                            <SelectItem value={ItemType.PERIODICAL}>Periódico</SelectItem>
                                            <SelectItem value={ItemType.VHS}>VHS</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="title"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Título</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Título do item" {...field} />
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
                                    <FormLabel>Subtítulo</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Subtítulo do item" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Campos condicionais */}
                        {currentType === ItemType.BOOK && (
                            <FormField
                                control={form.control}
                                name="data.author"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Autor</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Autor do livro" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        )}

                        {currentType === ItemType.DVD && (
                            <>
                                <FormField
                                    control={form.control}
                                    name="data.director"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Diretor</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Diretor do DVD" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="data.duration"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Duração (minutos)</FormLabel>
                                            <FormControl>
                                                <Input
                                                    type="number"
                                                    placeholder="Duração em minutos"
                                                    {...field}
                                                    onChange={e => field.onChange(Number(e.target.value))}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="data.studio"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Estúdio</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Estúdio do DVD" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="data.releaseYear"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Ano de Lançamento</FormLabel>
                                            <FormControl>
                                                <Input
                                                    type="date"
                                                    placeholder="Ano de Lançamento do DVD"
                                                    value={field.value ? field.value.toISOString().split('T')[0] : ''}
                                                    onChange={e => field.onChange(new Date(e.target.value))}
                                                    onBlur={field.onBlur}
                                                    name={field.name}
                                                    ref={field.ref}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="data.rating"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Avaliação</FormLabel>
                                            <FormControl>
                                                <Input
                                                    type="number"
                                                    placeholder="Avaliação (de 1 a 5)"
                                                    {...field}
                                                    onChange={e => field.onChange(Number(e.target.value))}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </>
                        )}

                        {/* Adicionar outros campos específicos aqui */}

                        <FormField
                            control={form.control}
                            name="isActive"
                            render={({ field }) => (
                                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                                    <div className="space-y-0.5">
                                        <FormLabel>Item ativo</FormLabel>
                                    </div>
                                    <FormControl>
                                        <Switch
                                            checked={field.value}
                                            onCheckedChange={field.onChange}
                                        />
                                    </FormControl>
                                </FormItem>
                            )}
                        />

                        <div className="flex justify-end gap-2 pt-4">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => handleOpenChange(false)}
                            >
                                Cancelar
                            </Button>
                            <Button type="submit" disabled={form.formState.isSubmitting}>
                                {form.formState.isSubmitting
                                    ? "Salvando..."
                                    : isEditMode ? "Atualizar" : "Criar"}
                            </Button>
                        </div>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}

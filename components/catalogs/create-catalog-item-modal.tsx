"use client"

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
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
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover"
import { format } from "date-fns"
import { Calendar } from "../ui/calendar"
import { cn } from "@/lib/utils"
import { CalendarIcon, X } from "lucide-react"
import { getActiveAuthors } from "@/lib/authors"
import { getBookStatuses, getCategories, getFormats, getLanguages, getPublishers, getTranslators } from "@/lib/books"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs"
import { Textarea } from "../ui/textarea"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "../ui/command"
import { Badge } from "../ui/badge"

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
        title: z.string().min(1, "Título é obrigatório"),
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
        categories: z.object({
            connect: z.array(z.object({ id: z.string() }))
        }),
        isActive: z.boolean(),
    })
})

const dvdSchema = baseSchema.extend({
    type: z.literal(ItemType.DVD),
    data: z.object({
        director: z.string().min(1, "Realizador é obrigatório"),
        duration: z.number().min(1, "Duração deve ser maior do que 0"),
        studio: z.string().min(1, "Estúdio é obrigatório"),
        releaseYear: z.number()
            .int("Deve ser um ano válido")
            .min(1900, "Ano deve ser após 1900")
            .max(new Date().getFullYear() + 1, "Ano não pode ser no futuro distante"),
        rating: z.string() // Agora definido como string
            .min(1, "Avaliação não pode ser vazia")
            .regex(/^[1-5]$/, "Avaliação deve ser entre 1 e 5")
    })
})

const periodicalSchema = baseSchema.extend({
    type: z.literal(ItemType.PERIODICAL),
    data: z.object({
        issn: z.string().min(1, "ISSN deve ter 8 dígitos"),
        issueNumber: z.string().min(1, "Número da edição é obrigatório"),
        volume: z.string().min(1, "Volume é obrigatório"),
        publicationDate: z.date({
            required_error: "Data de publicação é obrigatória",
        }),
    })
})

const vhsSchema = baseSchema.extend({
    type: z.literal(ItemType.VHS),
    data: z.object({
        director: z.string().min(1, "Realizador é obrigatório"),
        duration: z.number().min(1, "Duração deve ser maior do que 0"),
    })
})

const cdSchema = baseSchema.extend({
    type: z.literal(ItemType.CD),
    data: z.object({
        artist: z.string().min(1, "Artista é obrigatório"),
        trackCount: z.number().min(1, "Número de faixas deve ser maior do que 0"),
        label: z.string().min(1, "Editora é obrigatório"),
        releaseYear: z.number()
            .int("Deve ser um ano válido")
            .min(1900, "Ano deve ser após 1900")
            .max(new Date().getFullYear() + 1, "Ano não pode ser no futuro distante"),
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

    // Const para os dados relacionados
    const [authors, setAuthors] = useState<{ id: string; name: string }[]>([])
    const [formats, setFormats] = useState<{ id: string; name: string }[]>([])
    const [languages, setLanguages] = useState<{ id: string; name: string }[]>([])
    const [publishers, setPublishers] = useState<{ id: string; name: string }[]>([])
    const [categories, setCategories] = useState<{ id: string; name: string }[]>([])
    const [translators, setTranslators] = useState<{ id: string; name: string }[]>([])
    const [bookStatuses, setBookStatuses] = useState<{ id: string; name: string }[]>([])

    // Estado para o comando de categorias
    const [commandOpen, setCommandOpen] = useState(false)
    const [selectedCategories, setSelectedCategories] = useState<{ id: string; name: string }[]>([])

    // Carregar dados relacionados quando o modal abrir 
    useEffect(() => {
        if (open) {
            const loadRelatedData = async () => {
                try {
                    const [
                        authorsData,
                        formatsData,
                        languagesData,
                        publishersData,
                        categoriesData,
                        translatorsData,
                        bookStatusesData,
                    ] = await Promise.all([
                        getActiveAuthors(),
                        getFormats(),
                        getLanguages(),
                        getPublishers(),
                        getCategories(),
                        getTranslators(),
                        getBookStatuses(),
                    ])

                    setAuthors(authorsData)
                    setFormats(formatsData)
                    setLanguages(languagesData)
                    setPublishers(publishersData)
                    setCategories(categoriesData)
                    setTranslators(translatorsData)
                    setBookStatuses(bookStatusesData)
                } catch (error) {
                    console.error("Erro ao carregar dados relacionados:", error)

                    toast.error("Erro ao carregar dados", {
                        position: "top-right",
                        autoClose: 5000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                    })
                }
            }
            loadRelatedData()
        }
    }, [open])

    // Função para adicionar uma categoria
    const addCategory = (category: { id: string; name: string }) => {
        if (!selectedCategories.some((c) => c.id === category.id)) {
            const newSelectedCategories = [...selectedCategories, category];
            setSelectedCategories(newSelectedCategories);

            // Formato correto para o Prisma
            form.setValue("data.categories", {
                connect: newSelectedCategories.map((c) => ({ id: c.id }))
            });
        }
    }

    // Função para remover uma categoria
    const removeCategory = (categoryId: string) => {
        const newSelectedCategories = selectedCategories.filter((c) => c.id !== categoryId);
        setSelectedCategories(newSelectedCategories);

        // Formato correto para o Prisma
        form.setValue("data.categories", {
            connect: newSelectedCategories.map((c) => ({ id: c.id }))
        });
    }

    // Reset do formulário quando o item ou o modal muda
    useEffect(() => {
        if (catalogItem) {
            form.reset({
                type: catalogItem.type as ItemType,
                title: catalogItem.title,
                subTitle: catalogItem.subTitle,
                isActive: catalogItem.isActive,
                data: (catalogItem as any)?.data || {}
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
        console.log("Submitting form with values:", JSON.stringify(values, null, 2));

        setError(null)
        try {
            // Verificação adicional para PERIODICAL
            if (values.type === ItemType.PERIODICAL) {
                console.log("Periodical data:", values.data);
                if (!values.data.issn || !values.data.issueNumber || !values.data.publicationDate) {
                    throw new Error("Todos os campos do periódico são obrigatórios");
                }
            }

            if (isEditMode && catalogItem) {
                await updateCatalogItemAction(
                    catalogItem.id,
                    values.type,
                    values.data as DVDCreateInput | CDCreateInput | PeriodicalCreateInput | VHSCreateInput
                )
            } else {
                await createCatalogItemAction(
                    values.type,
                    catalogId,
                    values.title,
                    values.subTitle,
                    values.data as DVDCreateInput | CDCreateInput | PeriodicalCreateInput | VHSCreateInput
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
                console.error("Submission error:", error);
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
                            <>
                                <Tabs defaultValue="basic" className="w-full">
                                    <TabsList className="grid w-full grid-cols-3">
                                        <TabsTrigger value="basic">Informações Básicas</TabsTrigger>
                                        <TabsTrigger value="details">Detalhes</TabsTrigger>
                                        <TabsTrigger value="categories">Categorias</TabsTrigger>
                                    </TabsList>

                                    <TabsContent value="basic" className="space-y-4 mt-4">
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                            <div className="md:col-span-1 flex flex-col items-center justify-start">
                                                {/* Upload de imagem de capa */}
                                            </div>

                                            <div className="md:col-span-2 space-y-4">
                                                <FormField
                                                    control={form.control}
                                                    name="data.title"
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel>Título</FormLabel>
                                                            <FormControl>
                                                                <Input placeholder="Título do livro" {...field} />
                                                            </FormControl>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />

                                                <FormField
                                                    control={form.control}
                                                    name="data.isbn"
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel>ISBN</FormLabel>
                                                            <FormControl>
                                                                <Input placeholder="9780123456789" {...field} />
                                                            </FormControl>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />

                                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                    <FormField
                                                        control={form.control}
                                                        name="data.edition"
                                                        render={({ field }) => (
                                                            <FormItem>
                                                                <FormLabel>Edição</FormLabel>
                                                                <FormControl>
                                                                    <Input type="number" min="1" {...field} />
                                                                </FormControl>
                                                                <FormMessage />
                                                            </FormItem>
                                                        )}
                                                    />

                                                    <FormField
                                                        control={form.control}
                                                        name="data.pageCount"
                                                        render={({ field }) => (
                                                            <FormItem>
                                                                <FormLabel>Número de Páginas</FormLabel>
                                                                <FormControl>
                                                                    <Input type="number" min="1" {...field} />
                                                                </FormControl>
                                                                <FormMessage />
                                                            </FormItem>
                                                        )}
                                                    />
                                                </div>

                                                <FormField
                                                    control={form.control}
                                                    name="data.publishingDate"
                                                    render={({ field }) => (
                                                        <FormItem className="flex flex-col">
                                                            <FormLabel>Data de Publicação</FormLabel>
                                                            <Popover>
                                                                <PopoverTrigger asChild>
                                                                    <FormControl>
                                                                        <Button
                                                                            variant={"outline"}
                                                                            className={cn(
                                                                                "w-full pl-3 text-left font-normal",
                                                                                !field.value && "text-muted-foreground",
                                                                            )}
                                                                        >
                                                                            {field.value ? format(field.value, "dd/MM/yyyy") : <span>Selecione uma data</span>}
                                                                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                                                        </Button>
                                                                    </FormControl>
                                                                </PopoverTrigger>
                                                                <PopoverContent className="w-auto p-0" align="start">
                                                                    <Calendar mode="single" selected={field.value} onSelect={field.onChange} initialFocus />
                                                                </PopoverContent>
                                                            </Popover>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />


                                                <FormField
                                                    control={form.control}
                                                    name="data.isActive"
                                                    render={({ field }) => (
                                                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                                                            <div className="space-y-0.5">
                                                                <FormLabel>Status do Livro</FormLabel>
                                                                <FormDescription>{field.value ? "Livro ativo" : "Livro inativo"}</FormDescription>
                                                            </div>
                                                            <FormControl>
                                                                <Switch checked={field.value} onCheckedChange={field.onChange} />
                                                            </FormControl>
                                                        </FormItem>
                                                    )}
                                                />

                                            </div>
                                        </div>
                                    </TabsContent>

                                    <TabsContent value="details" className="space-y-4 mt-4">
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            <FormField
                                                control={form.control}
                                                name="data.authorId"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>Autor</FormLabel>
                                                        <Select onValueChange={field.onChange} value={field.value}>
                                                            <FormControl>
                                                                <SelectTrigger>
                                                                    <SelectValue placeholder="Selecione um autor" />
                                                                </SelectTrigger>
                                                            </FormControl>
                                                            <SelectContent>
                                                                {authors.map((author) => (
                                                                    <SelectItem key={author.id} value={author.id}>
                                                                        {author.name}
                                                                    </SelectItem>
                                                                ))}
                                                            </SelectContent>
                                                        </Select>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />

                                            <FormField
                                                control={form.control}
                                                name="data.publisherId"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>Editora</FormLabel>
                                                        <Select onValueChange={field.onChange} value={field.value}>
                                                            <FormControl>
                                                                <SelectTrigger>
                                                                    <SelectValue placeholder="Selecione uma editora" />
                                                                </SelectTrigger>
                                                            </FormControl>
                                                            <SelectContent>
                                                                {publishers.map((publisher) => (
                                                                    <SelectItem key={publisher.id} value={publisher.id}>
                                                                        {publisher.name}
                                                                    </SelectItem>
                                                                ))}
                                                            </SelectContent>
                                                        </Select>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />

                                            <FormField
                                                control={form.control}
                                                name="data.formatId"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>Formato</FormLabel>
                                                        <Select onValueChange={field.onChange} value={field.value}>
                                                            <FormControl>
                                                                <SelectTrigger>
                                                                    <SelectValue placeholder="Selecione um formato" />
                                                                </SelectTrigger>
                                                            </FormControl>
                                                            <SelectContent>
                                                                {formats.map((format) => (
                                                                    <SelectItem key={format.id} value={format.id}>
                                                                        {format.name}
                                                                    </SelectItem>
                                                                ))}
                                                            </SelectContent>
                                                        </Select>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />

                                            <FormField
                                                control={form.control}
                                                name="data.languageId"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>Idioma</FormLabel>
                                                        <Select onValueChange={field.onChange} value={field.value}>
                                                            <FormControl>
                                                                <SelectTrigger>
                                                                    <SelectValue placeholder="Selecione um idioma" />
                                                                </SelectTrigger>
                                                            </FormControl>
                                                            <SelectContent>
                                                                {languages.map((language) => (
                                                                    <SelectItem key={language.id} value={language.id}>
                                                                        {language.name}
                                                                    </SelectItem>
                                                                ))}
                                                            </SelectContent>
                                                        </Select>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />

                                            <FormField
                                                control={form.control}
                                                name="data.translatorId"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>Tradutor (opcional)</FormLabel>
                                                        <Select onValueChange={field.onChange} value={field.value}>
                                                            <FormControl>
                                                                <SelectTrigger>
                                                                    <SelectValue placeholder="Selecione um tradutor" />
                                                                </SelectTrigger>
                                                            </FormControl>
                                                            <SelectContent>
                                                                <SelectItem value="none">Nenhum</SelectItem>
                                                                {translators.map((translator) => (
                                                                    <SelectItem key={translator.id} value={translator.id}>
                                                                        {translator.name}
                                                                    </SelectItem>
                                                                ))}
                                                            </SelectContent>
                                                        </Select>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />

                                            <FormField
                                                control={form.control}
                                                name="data.bookStatusId"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>Status</FormLabel>
                                                        <Select onValueChange={field.onChange} value={field.value}>
                                                            <FormControl>
                                                                <SelectTrigger>
                                                                    <SelectValue placeholder="Selecione um status" />
                                                                </SelectTrigger>
                                                            </FormControl>
                                                            <SelectContent>
                                                                {bookStatuses.map((status) => (
                                                                    <SelectItem key={status.id} value={status.id}>
                                                                        {status.name}
                                                                    </SelectItem>
                                                                ))}
                                                            </SelectContent>
                                                        </Select>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                        </div>

                                        <FormField
                                            control={form.control}
                                            name="data.summary"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Resumo</FormLabel>
                                                    <FormControl>
                                                        <Textarea placeholder="Resumo do livro" className="resize-none" rows={6} {...field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </TabsContent>

                                    <TabsContent value="categories" className="space-y-4 mt-4">
                                        <FormField
                                            control={form.control}
                                            name="data.categories"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Categorias</FormLabel>
                                                    <FormControl>
                                                        <div className="space-y-4">
                                                            <Popover open={commandOpen} onOpenChange={setCommandOpen}>
                                                                <PopoverTrigger asChild>
                                                                    <Button
                                                                        variant="outline"
                                                                        role="combobox"
                                                                        aria-expanded={commandOpen}
                                                                        className="w-full justify-between"
                                                                    >
                                                                        Selecionar categorias
                                                                    </Button>
                                                                </PopoverTrigger>
                                                                <PopoverContent className="w-full p-0">
                                                                    <Command>
                                                                        <CommandInput placeholder="Buscar categoria..." />
                                                                        <CommandEmpty>Nenhuma categoria encontrada.</CommandEmpty>
                                                                        <CommandGroup>
                                                                            <CommandList>
                                                                                {categories.map((category) => (
                                                                                    <CommandItem
                                                                                        key={category.id}
                                                                                        onSelect={() => {
                                                                                            addCategory(category)
                                                                                            setCommandOpen(false)
                                                                                        }}
                                                                                    >
                                                                                        {category.name}
                                                                                    </CommandItem>
                                                                                ))}
                                                                            </CommandList>
                                                                        </CommandGroup>
                                                                    </Command>
                                                                </PopoverContent>
                                                            </Popover>

                                                            <div className="flex flex-wrap gap-2">
                                                                {selectedCategories.length === 0 ? (
                                                                    <div className="text-sm text-muted-foreground">Nenhuma categoria selecionada</div>
                                                                ) : (
                                                                    selectedCategories.map((category) => (
                                                                        <Badge key={category.id} variant="secondary" className="flex items-center gap-1">
                                                                            {category.name}
                                                                            <Button
                                                                                type="button"
                                                                                variant="ghost"
                                                                                size="icon"
                                                                                className="h-4 w-4 p-0 ml-1"
                                                                                onClick={() => removeCategory(category.id)}
                                                                            >
                                                                                <X className="h-3 w-3" />
                                                                                <span className="sr-only">Remover {category.name}</span>
                                                                            </Button>
                                                                        </Badge>
                                                                    ))
                                                                )}
                                                            </div>
                                                        </div>
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </TabsContent>
                                </Tabs>
                            </>
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
                                                    type="number"
                                                    min={1900}
                                                    max={new Date().getFullYear() + 1}
                                                    placeholder={`Entre 1900 e ${new Date().getFullYear() + 1}`}
                                                    value={typeof field.value === "number" ? field.value : ""}
                                                    onChange={e => field.onChange(Number(e.target.value))}
                                                    onBlur={field.onBlur}
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
                                            <FormLabel>Avaliação (1-5)</FormLabel>
                                            <FormControl>
                                                <Select onValueChange={field.onChange} value={field.value}>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Selecione a avaliação" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="1">1</SelectItem>
                                                        <SelectItem value="2">2</SelectItem>
                                                        <SelectItem value="3">3</SelectItem>
                                                        <SelectItem value="4">4</SelectItem>
                                                        <SelectItem value="5">5</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </>
                        )}

                        {currentType === ItemType.CD && (
                            <>
                                <FormField
                                    control={form.control}
                                    name="data.artist"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Artista</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Artista do CD" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="data.trackCount"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Número de Faixas</FormLabel>
                                            <FormControl>
                                                <Input
                                                    type="number"
                                                    placeholder="Número de faixas"
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
                                    name="data.label"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Editora</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Editora do CD" {...field} />
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
                                                    type="number"
                                                    min={1900}
                                                    max={new Date().getFullYear() + 1}
                                                    placeholder={`Entre 1900 e ${new Date().getFullYear() + 1}`}
                                                    value={typeof field.value === "number" ? field.value : ""}
                                                    onChange={e => field.onChange(Number(e.target.value))}
                                                    onBlur={field.onBlur}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </>
                        )}

                        {currentType === ItemType.VHS && (
                            <>
                                <FormField
                                    control={form.control}
                                    name="data.director"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Realizador</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Realizador do VHS" {...field} />
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
                                            <FormLabel>Duração</FormLabel>
                                            <FormControl>
                                                <Input
                                                    type="number"
                                                    placeholder="Duração do VHS"
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

                        {currentType === ItemType.PERIODICAL && (
                            <>
                                <FormField
                                    control={form.control}
                                    name="data.issn"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>ISSN</FormLabel>
                                            <FormControl>
                                                <Input placeholder="ISSN" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="data.issueNumber"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Número da Edição</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Número da edição" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="data.volume"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Volume</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Volume do períódico" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="data.publicationDate"
                                    render={({ field }) => (
                                        <FormItem className="flex flex-col">
                                            <FormLabel>Data da Publicação</FormLabel>
                                            <Popover>
                                                <PopoverTrigger asChild>
                                                    <FormControl>
                                                        <Button
                                                            variant={"outline"}
                                                            className={cn(
                                                                "w-full pl-3 text-left font-normal",
                                                                !field.value && "text-muted-foreground"
                                                            )}
                                                        >
                                                            {field.value ? format(field.value, "dd/MM/yyyy") : "Selecionar data"}
                                                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                                        </Button>
                                                    </FormControl>
                                                </PopoverTrigger>
                                                <PopoverContent className="w-auto p-0" align="start">
                                                    <Calendar
                                                        mode="single"
                                                        selected={field.value}
                                                        onSelect={(date) => {
                                                            field.onChange(date || undefined); // Alteração aqui
                                                        }}
                                                        initialFocus
                                                    />
                                                </PopoverContent>
                                            </Popover>
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
                                    ? "A salvar..."
                                    : isEditMode ? "Atualizar" : "Criar"}
                            </Button>
                        </div>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}

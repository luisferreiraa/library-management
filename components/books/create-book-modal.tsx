"use client"

import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { createBookAction, updateBookAction, uploadCoverImageAction } from "@/app/books/actions"
import { useBooks } from "@/contexts/books-context"
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "react-toastify"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ImageUpload } from "@/components/ui/image-upload"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon } from "lucide-react"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import { getActiveAuthors, getAuthors } from "@/lib/authors"
import { getFormats, getLanguages, getPublishers, getCategories, getTranslators, getBookStatuses, Book, BookWithRelations } from "@/lib/books"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Badge } from "@/components/ui/badge"
import { X } from "lucide-react"
import { useRouter } from "next/navigation"
import { Switch } from "../ui/switch"

// Definir UpdateBookInput
interface UpdateBookInput {
    id: string
    title: string
    isbn: string
    publishingDate: Date
    edition: number
    pageCount: number
    summary?: string | null
    coverImage?: string | null
    formatId: string
    languageId: string
    publisherId: string
    authorId: string
    translatorId?: string | null
    bookStatusId: string
    categoryIds?: string[]
    isActive: boolean
}

const formSchema = z.object({
    title: z.string().min(2, { message: "Título deve ter pelo menos 2 caracteres" }),
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
    isActive: z.boolean().default(true)
})

type FormValues = z.infer<typeof formSchema>

interface CreateBookModalProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    book?: BookWithRelations | null
    mode?: "create" | "edit"
    onSuccess?: () => void
}

export function CreateBookModal({ open, onOpenChange, book = null, mode = "create", onSuccess }: CreateBookModalProps) {
    const router = useRouter()
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [coverImageFile, setCoverImageFile] = useState<File | null>(null)
    const { addBook } = useBooks()
    const isEditMode = mode === "edit"

    // Estados para os dados relacionados
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

    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            title: "",
            isbn: "",
            edition: 1,
            pageCount: 0,
            summary: "",
            coverImage: "",
            formatId: "",
            languageId: "",
            publisherId: "",
            authorId: "",
            translatorId: "",
            bookStatusId: "",
            categoryIds: [],
            isActive: true,
        },
    })

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

    // Preencher o formulário quando estiver no modo de edição e o livro for fornecido
    useEffect(() => {
        if (isEditMode && book && open) {
            // Preencher as categorias selecionadas
            if (book.categories && book.categories.length > 0) {
                const bookCategories = book.categories.map((cat) => ({
                    id: cat.id,
                    name: cat.name,
                }))
                setSelectedCategories(bookCategories)
            }

            // Preencher o formulário com os dados do livro
            form.reset({
                title: book.title,
                isbn: book.isbn,
                publishingDate: new Date(book.publishingDate),
                edition: book.edition,
                pageCount: book.pageCount,
                summary: book.summary || "",
                coverImage: book.coverImage || "",
                formatId: book.formatId,
                languageId: book.languageId,
                publisherId: book.publisherId,
                authorId: book.authorId,
                translatorId: book.translatorId || "",
                bookStatusId: book.bookStatusId,
                categoryIds: book.categories?.map((cat) => cat.id) || [],
                isActive: book.isActive,
            })
        } else if (!isEditMode && open) {
            // Resetar o formulário quando abrir no modo de criação
            form.reset({
                title: "",
                isbn: "",
                edition: 1,
                pageCount: 0,
                summary: "",
                coverImage: "",
                formatId: "",
                languageId: "",
                publisherId: "",
                authorId: "",
                translatorId: "",
                bookStatusId: "",
                categoryIds: [],
                isActive: true,
            })
            setSelectedCategories([])
        }
    }, [form, book, isEditMode, open])

    // Função para adicionar uma categoria
    const addCategory = (category: { id: string; name: string }) => {
        if (!selectedCategories.some((c) => c.id === category.id)) {
            const newSelectedCategories = [...selectedCategories, category]
            setSelectedCategories(newSelectedCategories)
            form.setValue(
                "categoryIds",
                newSelectedCategories.map((c) => c.id),
            )
        }
    }

    // Função para remover uma categoria
    const removeCategory = (categoryId: string) => {
        const newSelectedCategories = selectedCategories.filter((c) => c.id !== categoryId)
        setSelectedCategories(newSelectedCategories)
        form.setValue(
            "categoryIds",
            newSelectedCategories.map((c) => c.id),
        )
    }

    async function onSubmit(values: FormValues) {
        setError(null)
        try {
            setIsSubmitting(true)

            // Se houver uma imagem para upload, processar primeiro
            if (coverImageFile) {
                const formData = new FormData()
                formData.append("file", coverImageFile)

                const imageUrl = await uploadCoverImageAction(formData)
                values.coverImage = imageUrl
            }

            if (isEditMode && book) {
                // Preparar os dados para atualização com o tipo correto
                const updateData: UpdateBookInput = {
                    id: book.id,
                    title: values.title,
                    isbn: values.isbn,
                    publishingDate: values.publishingDate,
                    edition: values.edition,
                    pageCount: values.pageCount,
                    summary: values.summary || null,
                    coverImage: values.coverImage || null,
                    formatId: values.formatId,
                    languageId: values.languageId,
                    publisherId: values.publisherId,
                    authorId: values.authorId,
                    translatorId: values.translatorId || null,
                    bookStatusId: values.bookStatusId,
                    categoryIds: values.categoryIds,
                    isActive: values.isActive,
                }

                // Atualizar livro existente
                const updatedBook = await updateBookAction(updateData)

                toast.success("Livro atualizado com sucesso", {
                    position: "top-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                })

                // Chamar o callback de sucesso se fornecido
                if (onSuccess) {
                    onSuccess()
                }

                // Atualizar a página se estivermos na página de detalhes do livro
                router.refresh()
            } else {
                // Criar livro via Server Action
                const newBook = await createBookAction(values)

                // Atualizar UI otimisticamente
                addBook(newBook)

                toast.success("Livro adicionado com sucesso", {
                    position: "top-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                })

                // Chamar o callback de sucesso se fornecido
                if (onSuccess) {
                    onSuccess()
                }
            }

            // Fechar modal e resetar formulário
            onOpenChange(false)
            form.reset()
            setCoverImageFile(null)
            setSelectedCategories([])
        } catch (error: any) {
            console.error("Erro ao processar livro:", error)
            setError(error.message || `Ocorreu um erro ao ${isEditMode ? "atualizar" : "criar"} o livro`)

            toast.error(`Erro ao ${isEditMode ? "atualizar" : "adicionar"} livro`, {
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
            <DialogContent className="sm:max-w-[800px]">
                <DialogHeader>
                    <DialogTitle>{isEditMode ? "Editar Livro" : "Adicionar Novo Livro"}</DialogTitle>
                    <DialogDescription>
                        {isEditMode
                            ? "Atualize os dados do livro e clique em salvar quando terminar."
                            : "Preencha os dados do livro e clique em salvar quando terminar."}
                    </DialogDescription>
                </DialogHeader>

                {error && (
                    <Alert variant="destructive" className="mt-4">
                        <AlertDescription>{error}</AlertDescription>
                    </Alert>
                )}

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <Tabs defaultValue="basic" className="w-full">
                            <TabsList className="grid w-full grid-cols-3">
                                <TabsTrigger value="basic">Informações Básicas</TabsTrigger>
                                <TabsTrigger value="details">Detalhes</TabsTrigger>
                                <TabsTrigger value="categories">Categorias</TabsTrigger>
                            </TabsList>

                            <TabsContent value="basic" className="space-y-4 mt-4">
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    <div className="md:col-span-1 flex flex-col items-center justify-start">
                                        <FormField
                                            control={form.control}
                                            name="coverImage"
                                            render={({ field }) => (
                                                <FormItem className="w-full flex flex-col items-center">
                                                    <FormLabel className="text-center mb-2">Capa do Livro</FormLabel>
                                                    <FormControl>
                                                        <ImageUpload
                                                            value={field.value}
                                                            onChange={(file) => {
                                                                setCoverImageFile(file)
                                                                // Manter o valor atual se o arquivo for nulo
                                                                if (file === null && field.value) {
                                                                    return
                                                                }
                                                                // Limpar o valor se o arquivo for nulo
                                                                if (file === null) {
                                                                    field.onChange("")
                                                                }
                                                            }}
                                                            onClear={() => {
                                                                field.onChange("")
                                                                setCoverImageFile(null)
                                                            }}
                                                            disabled={isSubmitting}
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>

                                    <div className="md:col-span-2 space-y-4">
                                        <FormField
                                            control={form.control}
                                            name="title"
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
                                            name="isbn"
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
                                                name="edition"
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
                                                name="pageCount"
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
                                            name="publishingDate"
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

                                        {isEditMode && (
                                            <FormField
                                                control={form.control}
                                                name="isActive"
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
                                        )}
                                    </div>
                                </div>
                            </TabsContent>

                            <TabsContent value="details" className="space-y-4 mt-4">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <FormField
                                        control={form.control}
                                        name="authorId"
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
                                        name="publisherId"
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
                                        name="formatId"
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
                                        name="languageId"
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
                                        name="translatorId"
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
                                        name="bookStatusId"
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
                                    name="summary"
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
                                    name="categoryIds"
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


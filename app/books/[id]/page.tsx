import { notFound } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { format } from "date-fns"
import { ChevronLeft, BookIcon, User, Building, Calendar, Hash, Languages, BookOpen, Tag, PlusCircle } from "lucide-react"
import { getBookById } from "@/lib/books"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CreateBarcodeButton } from "@/components/barcodes/create-barcode-button"

interface BookPageProps {
    params: {
        id: string
    }
}

export default async function BookPage({ params }: BookPageProps) {
    const { id } = params
    const book = await getBookById(id)

    if (!book) {
        notFound()
    }

    // Função para formatar a data
    const formatDate = (dateValue: Date | string | null) => {
        if (!dateValue) return "-"
        const date = typeof dateValue === "string" ? new Date(dateValue) : dateValue
        return format(date, "dd/MM/yyyy")
    }

    return (
        <div className="container mx-auto px-4 py-10 max-w-6xl">
            <div className="mb-6">
                <Button variant="ghost" size="sm" asChild>
                    <Link href="/books" className="flex items-center gap-1">
                        <ChevronLeft className="h-4 w-4" />
                        Voltar para a lista
                    </Link>
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="md:col-span-1">
                    <div className="flex flex-col items-center">
                        {book.coverImage ? (
                            <div className="relative aspect-[2/3] w-full max-w-[300px] overflow-hidden rounded-md mb-4">
                                <Image
                                    src={book.coverImage || "/placeholder.svg"}
                                    alt={book.title}
                                    fill
                                    className="object-cover"
                                    sizes="(max-width: 768px) 100vw, 300px"
                                    priority
                                />
                            </div>
                        ) : (
                            <div className="flex items-center justify-center aspect-[2/3] w-full max-w-[300px] bg-muted rounded-md mb-4">
                                <BookIcon className="h-16 w-16 text-muted-foreground" />
                            </div>
                        )}

                        <div className="flex flex-col gap-2 w-full max-w-[300px]">
                            <Button variant="outline" className="w-full">
                                Editar Livro
                            </Button>
                            <Button variant="destructive" className="w-full">
                                Excluir Livro
                            </Button>
                        </div>
                    </div>
                </div>

                <div className="md:col-span-2">
                    <Tabs defaultValue="details" className="w-full">
                        <TabsList className="grid w-full grid-cols-3">
                            <TabsTrigger value="details">Detalhes</TabsTrigger>
                            <TabsTrigger value="barcodes">Exemplares</TabsTrigger>
                            <TabsTrigger value="reviews">Avaliações</TabsTrigger>
                        </TabsList>

                        <TabsContent value="details" className="space-y-6 mt-6">
                            <div>
                                <h1 className="text-3xl font-bold tracking-tight">{book.title}</h1>
                                <div className="flex flex-wrap gap-2 mt-2">
                                    <Badge variant="secondary">{book.edition}ª Edição</Badge>
                                    <Badge variant="secondary">{book.pageCount} páginas</Badge>
                                    {book.isActive ? (
                                        <Badge variant="success">Ativo</Badge>
                                    ) : (
                                        <Badge variant="destructive">Inativo</Badge>
                                    )}
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <Card>
                                    <CardHeader className="pb-2">
                                        <CardTitle className="text-lg">Informações Básicas</CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-3">
                                        <div className="flex items-start gap-2">
                                            <Hash className="h-4 w-4 mt-0.5 text-muted-foreground" />
                                            <div>
                                                <div className="text-sm font-medium">ISBN</div>
                                                <div className="text-sm text-muted-foreground">{book.isbn}</div>
                                            </div>
                                        </div>
                                        <div className="flex items-start gap-2">
                                            <User className="h-4 w-4 mt-0.5 text-muted-foreground" />
                                            <div>
                                                <div className="text-sm font-medium">Autor</div>
                                                <Link href={`/authors/${book.authorId}`} className="text-sm text-primary hover:underline">
                                                    {book.author.name}
                                                </Link>
                                            </div>
                                        </div>
                                        <div className="flex items-start gap-2">
                                            <Building className="h-4 w-4 mt-0.5 text-muted-foreground" />
                                            <div>
                                                <div className="text-sm font-medium">Editora</div>
                                                <div className="text-sm text-muted-foreground">{book.publisher.name}</div>
                                            </div>
                                        </div>
                                        <div className="flex items-start gap-2">
                                            <Calendar className="h-4 w-4 mt-0.5 text-muted-foreground" />
                                            <div>
                                                <div className="text-sm font-medium">Data de Publicação</div>
                                                <div className="text-sm text-muted-foreground">{formatDate(book.publishingDate)}</div>
                                            </div>
                                        </div>
                                        <div className="flex items-start gap-2">
                                            <Languages className="h-4 w-4 mt-0.5 text-muted-foreground" />
                                            <div>
                                                <div className="text-sm font-medium">Idioma</div>
                                                <div className="text-sm text-muted-foreground">{book.language.name}</div>
                                            </div>
                                        </div>
                                        <div className="flex items-start gap-2">
                                            <BookOpen className="h-4 w-4 mt-0.5 text-muted-foreground" />
                                            <div>
                                                <div className="text-sm font-medium">Formato</div>
                                                <div className="text-sm text-muted-foreground">{book.format.name}</div>
                                            </div>
                                        </div>
                                        {book.translator && (
                                            <div className="flex items-start gap-2">
                                                <User className="h-4 w-4 mt-0.5 text-muted-foreground" />
                                                <div>
                                                    <div className="text-sm font-medium">Tradutor</div>
                                                    <div className="text-sm text-muted-foreground">{book.translator.name}</div>
                                                </div>
                                            </div>
                                        )}
                                    </CardContent>
                                </Card>

                                <Card>
                                    <CardHeader className="pb-2">
                                        <CardTitle className="text-lg">Categorias</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="flex flex-wrap gap-2">
                                            {book.categories.length > 0 ? (
                                                book.categories.map((category) => (
                                                    <Badge key={category.id} variant="outline" className="flex items-center gap-1">
                                                        <Tag className="h-3 w-3" />
                                                        {category.name}
                                                    </Badge>
                                                ))
                                            ) : (
                                                <div className="text-sm text-muted-foreground">Nenhuma categoria atribuída</div>
                                            )}
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>

                            <Card>
                                <CardHeader className="pb-2">
                                    <CardTitle className="text-lg">Resumo</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="text-sm text-muted-foreground whitespace-pre-line">
                                        {book.summary || "Nenhum resumo disponível."}
                                    </div>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader className="pb-2">
                                    <CardTitle className="text-lg">Metadados</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div>
                                            <dt className="text-sm font-medium text-muted-foreground">ID</dt>
                                            <dd className="mt-1 text-sm">{book.id}</dd>
                                        </div>
                                        <div>
                                            <dt className="text-sm font-medium text-muted-foreground">Status</dt>
                                            <dd className="mt-1 text-sm">{book.bookStatus.name}</dd>
                                        </div>
                                        <div>
                                            <dt className="text-sm font-medium text-muted-foreground">Registado em</dt>
                                            <dd className="mt-1 text-sm">{formatDate(book.createdAt)}</dd>
                                        </div>
                                        <div>
                                            <dt className="text-sm font-medium text-muted-foreground">Última atualização</dt>
                                            <dd className="mt-1 text-sm">{formatDate(book.updatedAt)}</dd>
                                        </div>
                                    </dl>
                                </CardContent>
                            </Card>
                        </TabsContent>

                        <TabsContent value="barcodes" className="mt-6">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Exemplares</CardTitle>
                                    <CardDescription>Lista de exemplares disponíveis deste livro</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    {book.barcodes && book.barcodes.length > 0 ? (
                                        <div className="space-y-4">
                                            {book.barcodes.map((barcode) => (
                                                <div key={barcode.id} className="flex items-center justify-between border-b pb-2">
                                                    <div>
                                                        <div className="font-medium">{barcode.code}</div>
                                                        <div className="text-sm text-muted-foreground">
                                                            Criado em: {formatDate(barcode.createdAt)}
                                                        </div>
                                                    </div>
                                                    <Badge variant={barcode.isActive ? "success" : "destructive"}>
                                                        {barcode.isActive ? "Ativo" : "Inativo"}
                                                    </Badge>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="flex flex-col items-center text-center py-6 text-muted-foreground">
                                            <p>Nenhum exemplar registado para este livro.</p>

                                            <CreateBarcodeButton bookId={book.id} />
                                        </div>

                                    )}
                                </CardContent>
                            </Card>
                        </TabsContent>

                        <TabsContent value="reviews" className="mt-6">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Avaliações</CardTitle>
                                    <CardDescription>Avaliações dos utilizadores sobre este livro</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    {book.reviews && book.reviews.length > 0 ? (
                                        <div className="space-y-4">
                                            {book.reviews.map((review) => (
                                                <div key={review.id} className="border rounded-md p-4">
                                                    <div className="flex items-center justify-between mb-2">
                                                        <div className="font-medium">
                                                            {review.user.firstName} {review.user.lastName}
                                                        </div>
                                                        <div className="flex items-center">
                                                            {Array.from({ length: 5 }).map((_, i) => (
                                                                <span
                                                                    key={i}
                                                                    className={`text-lg ${i < review.rating ? "text-yellow-500" : "text-gray-300"}`}
                                                                >
                                                                    ★
                                                                </span>
                                                            ))}
                                                        </div>
                                                    </div>
                                                    <div className="text-sm text-muted-foreground">
                                                        Avaliado em: {formatDate(review.createdAt)}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="text-center py-6 text-muted-foreground">Nenhuma avaliação para este livro.</div>
                                    )}
                                </CardContent>
                            </Card>
                        </TabsContent>
                    </Tabs>
                </div>
            </div>
        </div>
    )
}


"use client"

import { useState } from "react"
import Image from "next/image"
import { format } from "date-fns"
import { Book, PlusCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import type { AuthorWithBooks } from "@/lib/authors"
import type { Book as BookType } from "@/lib/books"
import { EmptyState } from "@/components/ui/empty-state"
import Link from "next/link"

interface AuthorBooksProps {
    author: AuthorWithBooks
    books: BookType[]
}

export function AuthorBooks({ author, books }: AuthorBooksProps) {
    // No futuro, aqui teremos o estado para o modal de adição de livros
    const [isAddingBook, setIsAddingBook] = useState(false)

    if (books.length === 0) {
        return (
            <EmptyState
                icon={<Book className="h-10 w-10" />}
                title="Nenhum livro encontrado"
                description="Este autor ainda não possui livros registados."
                action={
                    <Button onClick={() => setIsAddingBook(true)}>
                        <PlusCircle className="mr-2 h-4 w-4" />
                        Adicionar Livro
                    </Button>
                }
            />
        )
    }

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h3 className="text-lg font-medium">Lista de Livros</h3>
                    <p className="text-sm text-muted-foreground">
                        {books.length} {books.length === 1 ? "livro encontrado" : "livros encontrados"}
                    </p>
                </div>
                <Button onClick={() => setIsAddingBook(true)}>
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Adicionar Livro
                </Button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {books.map((book) => (
                    <Card key={book.id}>
                        <CardHeader>
                            <CardTitle className="line-clamp-1">{book.title}</CardTitle>
                            {book.publishedAt && (
                                <CardDescription>Publicado em {format(new Date(book.publishedAt), "dd/MM/yyyy")}</CardDescription>
                            )}
                        </CardHeader>
                        <CardContent>
                            {book.coverImage ? (
                                <div className="relative aspect-[2/3] w-full overflow-hidden rounded-md mb-4">
                                    <Image src={book.coverImage || "/placeholder.svg"} alt={book.title} fill className="object-cover" />
                                </div>
                            ) : (
                                <div className="flex items-center justify-center aspect-[2/3] w-full bg-muted rounded-md mb-4">
                                    <Book className="h-12 w-12 text-muted-foreground" />
                                </div>
                            )}
                            <p className="text-sm text-muted-foreground line-clamp-3">
                                {book.summary || "Sem resumo disponível."}
                            </p>
                        </CardContent>
                        <CardFooter>
                            <Link href={`/books/${book.id}`} className="w-full">
                                <Button variant="outline" size="sm" className="w-full">
                                    Ver Detalhes
                                </Button>
                            </Link>
                        </CardFooter>
                    </Card>
                ))}
            </div>
        </div>
    )
}


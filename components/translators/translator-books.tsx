"use client"

import { useState } from "react"
import Image from "next/image"
import { format } from "date-fns"
import { Book, PlusCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { EmptyState } from "../ui/empty-state"
import Link from "next/link"
import { BooksProvider } from "@/contexts/books-context"
import { CreateTranslatorBookModal } from "@/components/translators/create-translator-book-modal"
import type { TranslatorWithBooks } from "@/lib/translators"

interface TranslatorBooksProps {
    translator: TranslatorWithBooks
}

export function TranslatorBooks({ translator }: TranslatorBooksProps) {
    const [isAddingBook, setIsAddingBook] = useState(false)
    const books = translator.books

    if (books.length === 0) {
        return (
            <>
                <EmptyState
                    icon={<Book className="h-10 w-10" />}
                    title="Nenhum livro encontrado"
                    description="Este tradutor ainda não possui livros registrados."
                    action={
                        <Button onClick={() => setIsAddingBook(true)}>
                            <PlusCircle className="mr-2 h-4 w-4" />
                        </Button>
                    }
                />

                <BooksProvider initialBooks={[]}>
                    <CreateTranslatorBookModal
                        open={isAddingBook}
                        onOpenChange={setIsAddingBook}
                        translatorId={translator.id}
                        translatorname={translator.name}
                    />
                </BooksProvider>
            </>
        )
    }
}
import { Suspense } from "react"
import { getBooks } from "@/lib/books"
import { BooksTable } from "@/components/books/books-table"
import { BooksSearch } from "@/components/books/book-search"
import { CreateBookButton } from "@/components/books/create-book-button"
import { TableSkeleton } from "@/components/ui/table-skeleton"
import { BooksProvider } from "@/contexts/books-context"

export default async function BooksPage() {
    // Buscar dados no servidor
    const books = await getBooks()

    return (
        <div className="container mx-auto px-4 py-10 max-w-6xl">
            <BooksProvider initialBooks={books}>
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-3xl font-bold tracking-tight">Livros</h1>
                    <CreateBookButton />
                </div>

                <div className="mb-6 max-w-sm">
                    <BooksSearch />
                </div>

                <Suspense fallback={<TableSkeleton columns={7} rows={5} />}>
                    <BooksTable />
                </Suspense>
            </BooksProvider>
        </div>
    )
}


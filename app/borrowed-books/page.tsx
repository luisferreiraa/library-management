import { Suspense } from "react"
import { TableSkeleton } from "@/components/ui/table-skeleton"
import { getBorrowedBooks } from "@/lib/borrowed-books"
import { BorrowedBooksProvider } from "@/contexts/borrowed-books-context"
import { CreateBorrowedBookButton } from "@/components/borrowed-books/create-borrowed-book-button"
import { BorrowedBooksSearch } from "@/components/borrowed-books/borrowed-books-search"
import { BorrowedBooksTable } from "@/components/borrowed-books/borrowed-books-table"

export default async function BorrowedBooksPage() {
    // Buscar dados no servidor
    const borrowedBooks = await getBorrowedBooks()

    return (
        <div className="container mx-auto px-4 py-10 max-w-6xl">
            <BorrowedBooksProvider initialBorrowedBooks={borrowedBooks}>
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-3xl font-bold tracking-tight">Empréstimos</h1>
                    <CreateBorrowedBookButton />
                </div>

                <div className="mb-6 max-w-sm">
                    <BorrowedBooksSearch />
                </div>

                <Suspense fallback={<TableSkeleton columns={4} rows={5} />}>
                    <BorrowedBooksTable />
                </Suspense>
            </BorrowedBooksProvider>
        </div>
    )
}


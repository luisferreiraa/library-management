import { Suspense } from "react"
import { getAuthors } from "@/lib/authors"
import { AuthorsTable } from "@/components/authors/authors-table"
import { AuthorsSearch } from "@/components/authors/authors-search"
import { CreateAuthorButton } from "@/components/authors/create-author-button"
import { TableSkeleton } from "@/components/ui/table-skeleton"
import { AuthorsProvider } from "@/contexts/authors-context"
import { OrderAuthorsBy } from "@/components/authors/order-authors-by"
import { FilterAuthors } from "@/components/authors/filter-authors"

export default async function AuthorsPage() {
  // Buscar dados no servidor
  const authors = await getAuthors()

  return (
    <div className="container mx-auto px-4 py-10 max-w-6xl">
      <AuthorsProvider initialAuthors={authors}>
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold tracking-tight">Autores</h1>
          <CreateAuthorButton />
        </div>

        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="w-full sm:max-w-sm">
            <AuthorsSearch />
          </div>
          <div className="w-full sm:max-w-xs">
            <OrderAuthorsBy />
          </div>
          <div className="w-full sm:max-w-xs">
            <FilterAuthors />
          </div>
        </div>

        <Suspense fallback={<TableSkeleton columns={5} rows={5} />}>
          <AuthorsTable />
        </Suspense>
      </AuthorsProvider>
    </div>
  )
}

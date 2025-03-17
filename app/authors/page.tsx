import { Suspense } from "react"
import { getAuthors } from "@/lib/authors"
import { AuthorsTable } from "@/components/authors/authors-table"
import { AuthorsSearch } from "@/components/authors/authors-search"
import { CreateAuthorButton } from "@/components/authors/create-author-button"
import { TableSkeleton } from "@/components/ui/table-skeleton"
import { AuthorsProvider } from "@/contexts/authors-context"

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

        <div className="mb-6 max-w-sm">
          <AuthorsSearch />
        </div>

        <Suspense fallback={<TableSkeleton columns={5} rows={5} />}>
          <AuthorsTable />
        </Suspense>
      </AuthorsProvider>
    </div>
  )
}

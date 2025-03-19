import { Suspense } from "react"
import { getUsers } from "@/lib/users"
import { UsersTable } from "@/components/users/users-table"
import { UsersSearch } from "@/components/users/users-search"
import { CreateUserButton } from "@/components/users/create-user-button"
import { TableSkeleton } from "@/components/ui/table-skeleton"
import { UsersProvider } from "@/contexts/users-context"

export default async function UsersPage() {
    // Buscar dados no servidor
    const users = await getUsers()

    return (
        <div className="container mx-auto px-4 py-10 max-w-6xl">
            <UsersProvider initialUsers={users}>
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-3xl font-bold tracking-tight">Utilizadores</h1>
                    <CreateUserButton />
                </div>

                <div className="mb-6 max-w-sm">
                    <UsersSearch />
                </div>

                <Suspense fallback={<TableSkeleton columns={7} rows={5} />}>
                    <UsersTable />
                </Suspense>
            </UsersProvider>
        </div>
    )
}


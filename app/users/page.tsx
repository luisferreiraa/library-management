import { Suspense } from "react"
import { getUsers } from "@/lib/users"
import { UsersTable } from "@/components/users/users-table"
import { UsersSearch } from "@/components/users/users-search"
import { CreateUserButton } from "@/components/users/create-user-button"
import { TableSkeleton } from "@/components/ui/table-skeleton"
import { UsersProvider } from "@/contexts/users-context"
import { OrderUsersBy } from "@/components/users/order-users-by"
import { FilterUsers } from "@/components/users/filter-users"

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

                <div className="flex flex-col sm:flex-row gap-4 mb-6">
                    <div className="w-full sm:max-w-sm">
                        <UsersSearch />
                    </div>
                    <div className="w-full sm:max-w-xs">
                        <OrderUsersBy />
                    </div>
                    <div className="w-full sm:max-w-xs">
                        <FilterUsers />
                    </div>
                </div>

                <Suspense fallback={<TableSkeleton columns={7} rows={5} />}>
                    <UsersTable />
                </Suspense>
            </UsersProvider>
        </div>
    )
}


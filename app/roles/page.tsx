import { Suspense } from "react"
import { getRoles } from "@/lib/roles"
import { RolesTable } from "@/components/roles/roles-table"
import { CreateRoleButton } from "@/components/roles/create-role-button"
import { TableSkeleton } from "@/components/ui/table-skeleton"
import { RolesProvider } from "@/contexts/roles-context"
import { RolesSearch } from "@/components/roles/roles-search"

export default async function RolesPage() {
    // Buscar dados no servidor
    const roles = await getRoles()

    return (
        <div className="container mx-auto px-4 py-10 max-w-6xl">
            <RolesProvider initialRoles={roles}>
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-3xl font-bold tracking-tight">Roles</h1>
                    <CreateRoleButton />
                </div>

                <div className="mb-6 max-w-sm">
                    <RolesSearch />
                </div>

                <Suspense fallback={<TableSkeleton columns={4} rows={5} />}>
                    <RolesTable />
                </Suspense>
            </RolesProvider>
        </div>
    )
}


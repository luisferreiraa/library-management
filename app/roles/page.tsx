import { Suspense } from "react"
import { getRoles } from "@/lib/roles"
import { RolesTable } from "@/components/roles/roles-table"
import { CreateRoleButton } from "@/components/roles/create-role-button"
import { TableSkeleton } from "@/components/ui/table-skeleton"
import { RolesProvider } from "@/contexts/roles-context"
import { RolesSearch } from "@/components/roles/roles-search"
import { OrderRolesBy } from "@/components/roles/order-roles-by"

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

                <div className="flex flex-col sm:flex-row gap-4 mb-6">
                    <div className="w-full sm:max-w-sm">
                        <RolesSearch />
                    </div>
                    <div className="w-full sm:max-w-xs">
                        <OrderRolesBy />
                    </div>
                </div>

                <Suspense fallback={<TableSkeleton columns={4} rows={5} />}>
                    <RolesTable />
                </Suspense>
            </RolesProvider>
        </div>
    )
}


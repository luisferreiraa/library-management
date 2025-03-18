import { Suspense } from "react"
import { getPenaltyRules } from "@/lib/penaltyrules"
import { PenaltyRulesTable } from "@/components/penaltyRules/penaltyrules-table"
import { CreatePenaltyRuleButton } from "@/components/penaltyRules/create-penaltyrule-button"
import { TableSkeleton } from "@/components/ui/table-skeleton"
import { PenaltyRulesProvider } from "@/contexts/penaltyrules-context"
import { PenaltyRulesSearch } from "@/components/penaltyRules/penaltyrules-search"

export default async function PenaltyRulesPage() {
    // Buscar dados no servidor
    const penaltyRules = await getPenaltyRules()

    return (
        <div className="container mx-auto px-4 py-10 max-w-6xl">
            <PenaltyRulesProvider initialPenaltyRules={penaltyRules}>
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-3xl font-bold tracking-tight">Regras</h1>
                    <CreatePenaltyRuleButton />
                </div>

                <div className="mb-6 max-w-sm">
                    <PenaltyRulesSearch />
                </div>

                <Suspense fallback={<TableSkeleton columns={4} rows={5} />}>
                    <PenaltyRulesTable />
                </Suspense>
            </PenaltyRulesProvider>
        </div>
    )
}


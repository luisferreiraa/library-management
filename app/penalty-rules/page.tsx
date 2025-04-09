import { Suspense } from "react"
import { getPenaltyRules } from "@/lib/penaltyrules"
import { PenaltyRulesTable } from "@/components/penaltyRules/penaltyrules-table"
import { CreatePenaltyRuleButton } from "@/components/penaltyRules/create-penaltyrule-button"
import { TableSkeleton } from "@/components/ui/table-skeleton"
import { PenaltyRulesProvider } from "@/contexts/penaltyrules-context"
import { PenaltyRulesSearch } from "@/components/penaltyRules/penaltyrules-search"
import { OrderPenaltyRulesBy } from "@/components/penaltyRules/order-penalty-rules-by"
import { FilterPenaltyRules } from "@/components/penaltyRules/filter-penalty-rules"

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

                <div className="flex flex-col sm:flex-row gap-4 mb-6">
                    <div className="w-full sm:max-w-sm">
                        <PenaltyRulesSearch />
                    </div>
                    <div className="w-full sm:max-w-xs">
                        <OrderPenaltyRulesBy />
                    </div>
                    <div className="w-full sm:max-w-xs">
                        <FilterPenaltyRules />
                    </div>
                </div>

                <Suspense fallback={<TableSkeleton columns={4} rows={5} />}>
                    <PenaltyRulesTable />
                </Suspense>
            </PenaltyRulesProvider>
        </div>
    )
}


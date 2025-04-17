"use client"

import createEntityContext from "./global-entity-context"
import type { PenaltyRule } from "@/lib/penaltyrules"

const {
    Provider: PenaltyRulesProvider,
    useEntityContext: usePenaltyRules,
} = createEntityContext<PenaltyRule>()

export { PenaltyRulesProvider, usePenaltyRules }
"use client"

import createEntityContext from "./global-entity-context"
import type { Translator } from "@/lib/translators"

const {
    Provider: TranslatorsProvider,
    useEntityContext: useTranslators,
} = createEntityContext<Translator>()

export { TranslatorsProvider, useTranslators }
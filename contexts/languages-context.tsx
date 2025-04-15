"use client"

import createEntityContext from "./global-entity-context"
import type { Language } from "@/lib/languages"

const {
    Provider: LanguagesProvider,
    useEntityContext: useLanguages,
} = createEntityContext<Language>()

export { LanguagesProvider, useLanguages }
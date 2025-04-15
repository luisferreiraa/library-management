"use client"

import createEntityContext from "./global-entity-context"
import type { Library } from "@/lib/libraries"

const {
    Provider: LibraryProvider,
    useEntityContext: useLibraries,
} = createEntityContext<Library>()

export { LibraryProvider, useLibraries }
"use client"

import createEntityContext from "./global-entity-context"
import type { LibraryNetwork } from "@/lib/library-networks"

const {
    Provider: LibraryNetworkProvider,
    useEntityContext: useLibraryNetworks,
} = createEntityContext<LibraryNetwork>()

export { LibraryNetworkProvider, useLibraryNetworks }
"use client"

import createEntityContext from "./global-entity-context"
import type { Publisher } from "@/lib/publishers"

const {
    Provider: PublishersProvider,
    useEntityContext: usePublishers,
} = createEntityContext<Publisher>()

export { PublishersProvider, usePublishers }
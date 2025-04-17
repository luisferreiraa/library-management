"use client"

import createEntityContext from "./global-entity-context"
import type { BookStatus } from "@/lib/bookstatus"

const {
    Provider: BookStatusProvider,
    useEntityContext: useBookStatus,
} = createEntityContext<BookStatus>()

export { BookStatusProvider, useBookStatus }
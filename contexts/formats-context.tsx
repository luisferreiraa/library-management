"use client"

import { Format } from "@/lib/formats"
import createEntityContext from "./global-entity-context"

const {
    Provider: FormatsProvider,
    useEntityContext: useFormats,
} = createEntityContext<Format>()

export { FormatsProvider, useFormats }
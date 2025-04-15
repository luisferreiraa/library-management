"use client"

import createEntityContext from "./global-entity-context"
import type { Role } from "@/lib/roles"

const {
    Provider: RolesProvider,
    useEntityContext: useRoles,
} = createEntityContext<Role>()

export { RolesProvider, useRoles }
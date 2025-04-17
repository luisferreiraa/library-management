"use client"

import createEntityContext from "./global-entity-context"
import type { Catalog, CatalogWithRelations } from "@/lib/catalogs"

const {
    Provider: CatalogsProvider,
    useEntityContext: useCatalogs,
} = createEntityContext<CatalogWithRelations>()

export { CatalogsProvider, useCatalogs }
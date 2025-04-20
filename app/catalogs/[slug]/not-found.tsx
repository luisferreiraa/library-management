import EntityNotFound from "@/components/global-entities/entity-not-found"

export default function CatalogNotFound() {
    return (
        <EntityNotFound
            entityName="Catálogo"
            backHref="/catalogs"
            listHref="/catalogs"
        />
    )
}
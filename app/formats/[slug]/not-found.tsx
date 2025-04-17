import EntityNotFound from "@/components/global-entities/entity-not-found"

export default function FormatNotFound() {
    return (
        <EntityNotFound
            entityName="Formato"
            backHref="/formats"
            listHref="/formats"
        />
    )
}
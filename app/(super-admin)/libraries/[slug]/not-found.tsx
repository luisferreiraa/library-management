import EntityNotFound from "@/components/global-entities/entity-not-found"

export default function LibraryNotFound() {
    return (
        <EntityNotFound
            entityName="Biblioteca"
            entityGender="feminino"
            backHref="/libraries"
            listHref="/libraries"
        />
    )
}


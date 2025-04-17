import EntityNotFound from "@/components/global-entities/entity-not-found"

export default function AuthorNotFound() {
    return (
        <EntityNotFound
            entityName="Autor"
            entityPlural="Autores"
            backHref="/authors"
            listHref="/authors"
        />
    )
}


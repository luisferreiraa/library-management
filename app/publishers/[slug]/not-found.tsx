import EntityNotFound from "@/components/global-entities/entity-not-found"

export default function PublisherNotFound() {
    return (
        <EntityNotFound
            entityName="Editora"
            entityGender="feminino"
            backHref="/publishers"
            listHref="/publishers"
        />
    )
}


import EntityNotFound from "@/components/global-entities/entity-not-found"

export default function UserNotFound() {
    return (
        <EntityNotFound
            entityName="Utilizador"
            entityPlural="Utilizadores"
            backHref="/users"
            listHref="/users"
        />
    )
}


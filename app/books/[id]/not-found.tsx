import EntityNotFound from "@/components/global-entities/entity-not-found"

export default function BookNotFound() {
    return (
        <EntityNotFound
            entityName="Livro"
            backHref="/books"
            listHref="/books"
        />
    )
}


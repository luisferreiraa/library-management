import EntityNotFound from "@/components/global-entities/entity-not-found"

export default function CategoryNotFound() {
    return (
        <EntityNotFound
            entityName="Categoria"
            entityGender="feminino"
            backHref="/categories"
            listHref="/categories"
        />
    )
}


import EntityNotFound from "@/components/global-entities/entity-not-found"

export default function RecordNotFound() {
    return (
        <EntityNotFound
            entityName="Registo"
            backHref="/records"
            listHref="/records"
        />
    )
}


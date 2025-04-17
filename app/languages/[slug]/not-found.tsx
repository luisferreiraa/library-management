import EntityNotFound from "@/components/global-entities/entity-not-found"

export default function LanguageNotFound() {
    return (
        <EntityNotFound
            entityName="Idioma"
            backHref="/languages"
            listHref="/languages"
        />
    )
}
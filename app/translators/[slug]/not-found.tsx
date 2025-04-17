import EntityNotFound from "@/components/global-entities/entity-not-found"

export default function TranslatorNotFound() {
    return (
        <EntityNotFound
            entityName="Tradutor"
            entityPlural="Tradutores"
            backHref="/translators"
            listHref="/translators"
        />
    )
}
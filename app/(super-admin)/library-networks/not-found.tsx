import EntityNotFound from "@/components/global-entities/entity-not-found"

export default function LibraryNetworkNotFound() {
    return (
        <EntityNotFound
            entityName="Rede de Bibliotecas"
            entityGender="feminino"
            entityPlural="Redes de Bibliotecas"
            backHref="/library-networks"
            listHref="/library-networks"
        />
    )
}
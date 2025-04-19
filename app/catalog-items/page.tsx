'use client'
import { useEffect, useState } from 'react'
import { getItemsByCatalogAction } from '@/app/catalog-items/actions'
import { getAllCatalogIds } from '../catalogs/actions'

export default function CatalogPage() {
    const [catalogId, setCatalogId] = useState<string | undefined>(undefined)
    const [catalogItems, setCatalogItems] = useState<any[]>([])
    const [catalogList, setCatalogList] = useState<{ id: string; name: string }[]>([])

    // Buscar lista de IDs no início
    useEffect(() => {
        const fetchCatalogs = async () => {
            const ids = await getAllCatalogIds()
            setCatalogList(ids)
        }

        fetchCatalogs()
    }, [])

    // Buscar itens ao mudar o catálogo selecionado
    useEffect(() => {
        if (!catalogId) return

        const fetchItems = async () => {
            const items = await getItemsByCatalogAction(catalogId)
            setCatalogItems(items)
            console.log(items)
        }

        fetchItems()
    }, [catalogId])

    return (
        <div>
            <h1>Catálogos</h1>

            <select
                value={catalogId}
                onChange={(e) => setCatalogId(e.target.value)}
            >
                <option value="">Selecione um catálogo</option>
                {catalogList.map((catalog) => (
                    <option key={catalog.id} value={catalog.id}>
                        {catalog.name}
                    </option>
                ))}
            </select>

            <ul>
                {catalogItems.map((item) => (
                    <li key={item.id}>{item.cd.artist}</li>
                ))}
            </ul>
        </div>
    )
}

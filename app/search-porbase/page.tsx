import { SearchForm } from "@/components/search-porbase/search-form"
import { searchByISBN } from "@/app/search-porbase/actions"

export default function Home() {
    return (
        <main className="container mx-auto py-10 px-4">
            <h1 className="text-3xl font-bold mb-6 text-center">Pesquisa Bibliográfica por ISBN</h1>
            <div className="max-w-2xl mx-auto">
                <SearchForm searchAction={searchByISBN} />
            </div>
        </main>
    )
}


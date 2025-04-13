// lib/fetchFromPorbase.ts
export async function fetchFromPorbase(isbn: string): Promise<string> {
    const url = `http://urn.porbase.org/isbn/dc/xml?id=${isbn}&agente=urn.porbase.org`

    const response = await fetch(url, {
        headers: {
            "User-Agent":
                "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
            Accept: "application/xml,text/xml,*/*;q=0.8",
        },
        cache: "no-store",
    })

    if (!response.ok) {
        if (response.status === 404) {
            throw new Error("Nenhum resultado encontrado para este ISBN.")
        }
        throw new Error(`Erro na API externa: ${response.status} ${response.statusText}`)
    }

    const xmlData = await response.text()

    if (!xmlData || xmlData.trim() === "") {
        throw new Error("A API retornou um resultado vazio.")
    }

    return xmlData
}

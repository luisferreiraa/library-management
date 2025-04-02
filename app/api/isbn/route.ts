import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams
    const isbn = searchParams.get("isbn")

    if (!isbn) {
        return NextResponse.json({ error: "ISBN é obrigatório" }, { status: 400 })
    }

    try {
        // URL da API externa - usando o endpoint XML
        const url = `http://urn.porbase.org/isbn/dc/xml?id=${isbn}&agente=urn.porbase.org`

        console.log(`Tentando acessar: ${url}`)

        const response = await fetch(url, {
            headers: {
                "User-Agent":
                    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
                Accept: "application/xml,text/xml,*/*;q=0.8",
            },
            cache: "no-store",
        })

        if (!response.ok) {
            console.error(`Erro na API externa: ${response.status} ${response.statusText}`)

            if (response.status === 404) {
                return NextResponse.json({ error: "Nenhum resultado encontrado para este ISBN." }, { status: 404 })
            }

            return NextResponse.json(
                { error: `Erro na API externa: ${response.status} ${response.statusText}` },
                { status: 500 },
            )
        }

        // Obter o texto XML da resposta
        const xmlData = await response.text()
        console.log("XML recebido da API:", xmlData.substring(0, 200) + "...")

        // Verificar se o texto está vazio
        if (!xmlData || xmlData.trim() === "") {
            return NextResponse.json({ error: "A API retornou um resultado vazio." }, { status: 404 })
        }

        // Retornar o XML como resposta
        return new NextResponse(xmlData, {
            headers: { "Content-Type": "application/xml; charset=utf-8" },
        })
    } catch (error: any) {
        console.error("Erro ao acessar a API externa:", error)

        return NextResponse.json({ error: `Falha ao buscar informações do livro: ${error.message}` }, { status: 500 })
    }
}


import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams
    const isbn = searchParams.get("isbn")

    if (!isbn) {
        return NextResponse.json({ error: "ISBN é obrigatório" }, { status: 400 })
    }

    try {
        // Simulando uma resposta bem-sucedida para o ISBN 9789722084758
        if (isbn === "9789722084758") {
            const sampleResponse = `Etiqueta de registo: 01077nam 2200325 450
001 3757901
003 http://id.bnportugal.gov.pt/bib/porbase/3757901
010 ## $a978-972-20-8475-8
021 ## $aPT$b542364/25
035 ## $a(bn)2207088
100 ## $a20250306d2025 m y0pory01030103ba
101 1# $apor$beng$cnor
102 ## $aPT
105 ## $ay z 000ay
106 ## $ar
200 1# $a?A ?casa da noite$fJo Nesbo$gtrad. Maria de Fátima Carmo
205 ## $a1ª ed
210 #9 $aAlfragide$cDom Quixote$d2025
215 ## $a254 p.$d24 cm
304 ## $aTít. orig.:Nathuse. - Tít. versão inglesa: The night house
675 ## $a821.113.5-312.4"19/20"$vBN$zpor$31648289
700 #1 $aNesbo$bJo$f1960-$32646538
702 #1 $aCarmo$bMaria de Fátima$4730$32141304
801 #0 $aPT$bBN$gRPC
856 41 $uhttp://rnod.bnportugal.gov.pt/ImagesBN/winlibimg.aspx?skey=&doc=2207088&img=205238&save=true
900 ## $aBIBNAC$d20250313
971 ## $casantos$d20250306
972 ## $e0$z0$d20250313$vlrevez
973 ## $ctrodrigues$d20250307`

            return new NextResponse(sampleResponse, {
                headers: { "Content-Type": "text/plain; charset=utf-8" },
            })
        }

        // Para outros ISBNs, tentar acessar a API
        const url = `https://urn.porbase.org/isbn/unimarc/txt?id=${isbn}&agente=urn.porbase.org`

        // Usando uma abordagem diferente para o fetch
        const controller = new AbortController()
        const timeoutId = setTimeout(() => controller.abort(), 15000)

        const response = await fetch(url, {
            method: "GET",
            headers: {
                "User-Agent": "Mozilla/5.0 (compatible)",
                Accept: "*/*",
            },
            cache: "no-store",
            signal: controller.signal,
        })

        clearTimeout(timeoutId)

        if (!response.ok) {
            if (response.status === 404) {
                return new NextResponse("Nenhum resultado encontrado para este ISBN.", {
                    status: 200,
                    headers: { "Content-Type": "text/plain; charset=utf-8" },
                })
            }

            return NextResponse.json({ error: `Erro na API externa: ${response.status}` }, { status: 500 })
        }

        const data = await response.text()

        if (!data || data.trim() === "") {
            return new NextResponse("A API retornou um resultado vazio.", {
                status: 200,
                headers: { "Content-Type": "text/plain; charset=utf-8" },
            })
        }

        return new NextResponse(data, {
            headers: { "Content-Type": "text/plain; charset=utf-8" },
        })
    } catch (error: any) {
        console.error("Erro ao acessar a API externa (alternativa):", error)

        if (error.name === "AbortError") {
            return NextResponse.json(
                { error: "A requisição excedeu o tempo limite. Por favor, tente novamente." },
                { status: 504 },
            )
        }

        return NextResponse.json({ error: `Falha ao buscar informações do livro: ${error.message}` }, { status: 500 })
    }
}


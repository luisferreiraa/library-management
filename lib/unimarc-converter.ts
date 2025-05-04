/**
 * Converte os campos estruturados para o formato UNIMARC
 */
export function convertToUnimarc(
    data: {
        controlFields: {
            definitionId: string
            value: string
            definition?: { tag: string; name: string }
        }[]
        dataFields: {
            definitionId: string
            ind1: string
            ind2: string
            definition?: { tag: string; name: string }
            subFields: {
                value: string
            }[]
        }[]
    },
    definitions: {
        controlFieldDefinitions: { id: string; tag: string; name: string }[]
        dataFieldDefinitions: { id: string; tag: string; name: string }[]
    },
): Record<string, any> {
    const unimarcRecord: Record<string, any> = {
        leader: generateLeader(),
        fields: {},
    }

    // Processar campos de controle
    data.controlFields.forEach((field) => {
        // Encontrar a definição do campo para obter a tag
        const definition =
            field.definition || definitions.controlFieldDefinitions.find((def) => def.id === field.definitionId)

        if (definition) {
            unimarcRecord.fields[definition.tag] = field.value
        }
    })

    // Processar campos de dados
    data.dataFields.forEach((field) => {
        // Encontrar a definição do campo para obter a tag
        const definition = field.definition || definitions.dataFieldDefinitions.find((def) => def.id === field.definitionId)

        if (definition) {
            const tag = definition.tag
            const indicators = `${field.ind1 || " "}${field.ind2 || " "}`

            // Processar subcampos
            const subfields: Record<string, string> = {}
            field.subFields.forEach((subfield, index) => {
                // No UNIMARC, os subcampos são identificados por letras (a, b, c, etc.)
                // Como não temos o código do subcampo, vamos usar letras em sequência
                const subfieldCode = String.fromCharCode(97 + (index % 26)) // 'a', 'b', 'c', ...
                subfields[subfieldCode] = subfield.value
            })

            // Adicionar campo ao registro UNIMARC
            unimarcRecord.fields[tag] = {
                indicators,
                subfields,
            }
        }
    })

    return unimarcRecord
}

/**
 * Gera um líder UNIMARC básico
 */
function generateLeader(): string {
    // Formato do líder UNIMARC (24 caracteres)
    // Posições:
    // 00-04: Tamanho do registro (preenchido posteriormente)
    // 05: Status do registro (n = novo)
    // 06: Tipo de registro (a = material textual)
    // 07: Nível bibliográfico (m = monografia)
    // 08: Nível hierárquico (# = não especificado)
    // 09: Indefinido (#)
    // 10: Comprimento dos indicadores (2)
    // 11: Comprimento do código de subcampo (2)
    // 12-16: Endereço base dos dados (preenchido posteriormente)
    // 17: Nível de codificação (# = completo)
    // 18: Forma de catalogação descritiva (a = AACR2)
    // 19: Indefinido (#)
    // 20: Comprimento da parte "comprimento do campo" (4)
    // 21: Comprimento da parte "posição inicial do campo" (5)
    // 22: Comprimento da parte definida pela implementação (0)
    // 23: Indefinido (#)

    return "00000nam  2200000   450 "
}

/**
 * Extrai informações básicas do registro UNIMARC para exibição
 */
export function extractBasicInfoFromUnimarc(unimarcRecord: Record<string, any>): {
    title: string
    author: string
    year: string
} {
    let title = ""
    let author = ""
    let year = ""

    // Extrair título (campo 200, subcampo a)
    if (unimarcRecord.fields["200"] && unimarcRecord.fields["200"].subfields?.a) {
        title = unimarcRecord.fields["200"].subfields.a
    }

    // Extrair autor (campo 700, subcampo a)
    if (unimarcRecord.fields["700"] && unimarcRecord.fields["700"].subfields?.a) {
        author = unimarcRecord.fields["700"].subfields.a
    } else if (unimarcRecord.fields["710"] && unimarcRecord.fields["710"].subfields?.a) {
        // Autor corporativo
        author = unimarcRecord.fields["710"].subfields.a
    }

    // Extrair ano de publicação (campo 210, subcampo d)
    if (unimarcRecord.fields["210"] && unimarcRecord.fields["210"].subfields?.d) {
        year = unimarcRecord.fields["210"].subfields.d
    }

    return {
        title: title || "Sem título",
        author: author || "Autor desconhecido",
        year: year || "Ano desconhecido",
    }
}

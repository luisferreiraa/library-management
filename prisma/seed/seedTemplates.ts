import { PrismaClient } from "@prisma/client"
import { promise } from "zod"
const prisma = new PrismaClient()

const templates = [
    {
        name: 'Livro (Monografia)',
        description: 'Obras textuais publicadas individualmente.',
        controlFields: [
            { tag: '001' },
            { tag: '005' }
        ],
        dataFields: [
            { tag: '008', ind1: '#', ind2: '#' }, // Dados codificados (data, país, idioma)
            { tag: '010', ind1: '#', ind2: '#' }, // ISBN
            { tag: '100', ind1: '#', ind2: '#' }, // Dados gerais de processamento (obrigatório)
            { tag: '101', ind1: '#', ind2: '#' }, // Código do idioma da obra (ex: 0=português)
            { tag: '102', ind1: '#', ind2: '#' }, // Código do país de publicação
            { tag: '200', ind1: '1', ind2: '#' }, // Título e menção de responsabilidade (obrigatório)
            { tag: '205', ind1: '1', ind2: '#' }, // Edição
            { tag: '210', ind1: '#', ind2: '#' }, // Editora, distribuidor
            { tag: '215', ind1: '#', ind2: '#' }, // Descrição física (páginas, dimensões)
            { tag: '225', ind1: '#', ind2: '#' }, // Coleção (se aplicável)
            { tag: '300', ind1: '#', ind2: '#' }, // Notas gerais
            { tag: '606', ind1: '#', ind2: '#' }, // Assuntos (nome comum)
            { tag: '676', ind1: '#', ind2: '#' }, // Classicação Dewey
            { tag: '700', ind1: '1', ind2: ' ' }, // Autor pessoal (responsabilidade principal)
            { tag: '701', ind1: '1', ind2: ' ' }, // Coautor/ colaborador (esponsável secundário)
            { tag: '801', ind1: '#', ind2: '#' } // Fonte do registo (ex: $a PT $b BN $c 20240501)
        ]
    },
    {
        name: 'Publicação Periódica',
        description: 'Jornais, revistas e outros periódicos.',
        controlFields: [
            { tag: '001' },
            { tag: '005' }
        ],
        dataFields: [
            { tag: '011', ind1: '#', ind2: '#' }, // ISSN
            { tag: '100', ind1: '#', ind2: '#' }, // Dados gerais de processamento
            { tag: '101', ind1: '#', ind2: '#' }, // Idioma da obra
            { tag: '200', ind1: '1', ind2: '#' }, // Título e menção de responsabilidade
            { tag: '207', ind1: '0', ind2: '#' }, // Designação numérica/ cronológica (para periódicos)
            { tag: '210', ind1: '#', ind2: '#' }, // Publicação, distribuição, etc
            { tag: '215', ind1: '#', ind2: '#' }, // Descrição física
            { tag: '225', ind1: '#', ind2: '#' }, // Coleção (opcional)
            { tag: '300', ind1: '#', ind2: '#' }, // Notas gerais
            { tag: '326', ind1: '#', ind2: '#' }, // Periodicidade
            { tag: '430', ind1: '1', ind2: '#' }, // Continuação de (para periódicos que são continuações)
            { tag: '430', ind1: '1', ind2: '#' }, // Continuação de (obrigatório se aplicável)
            { tag: '431', ind1: '1', ind2: '#' }, // Continua em parte (opcional)
            { tag: '434', ind1: '1', ind2: '#' }, // Absorvido por (opcional)
            { tag: '446', ind1: '1', ind2: '#' }, // Dividido em (opcional)
            { tag: '447', ind1: '1', ind2: '#' }, // Fundido com para formar (opcional)
            { tag: '606', ind1: '#', ind2: ' ' }, // Assunto
            { tag: '676', ind1: '#', ind2: '#' }, // Classificação Dewey
            { tag: '856', ind1: '4', ind2: '#' }, // Acesso online (se aplicável)
            { tag: '801', ind1: '#', ind2: '#' } // Origem do registo
        ]
    },
    {
        name: 'Artigo de Revista',
        description: 'Parte analítica de uma publicação periódica.',
        controlFields: [
            { tag: '001' },
            { tag: '005' }
        ],
        dataFields: [
            { tag: '011', ind1: '#', ind2: '#' }, // ISSN
            { tag: '100', ind1: '#', ind2: '#' }, // Dados gerais de processamento
            { tag: '101', ind1: '#', ind2: '#' }, // Idioma da obra
            { tag: '200', ind1: '1', ind2: '#' }, // Título e menção de responsabilidade
            { tag: '210', ind1: '#', ind2: '#' }, // Publicação, distribuição, etc
            { tag: '300', ind1: '#', ind2: '#' }, // Notas gerais (resumo, referências, etc)
            { tag: '330', ind1: '#', ind2: '#' }, // Resumo estruturado
            { tag: '461', ind1: '1', ind2: '#' }, // Link para a revista-mãe
            { tag: '463', ind1: '1', ind2: '#' }, // Níveis de unidade (para vincar ao registo da revista)
            { tag: '517', ind1: '#', ind2: '#' }, // Título alternativo (ex: em inglês)
            { tag: '606', ind1: '#', ind2: '#' }, // Assunto do artigo
            { tag: '700', ind1: '1', ind2: '#' }, // Autor do artigo
            { tag: '701', ind1: '1', ind2: '#' }, // Coautor (se aplicável)
            { tag: '801', ind1: '#', ind2: '#' } // Origem do registo
        ]
    },
    {
        name: 'CD (Gravação Sonora)',
        description: 'Áudio gravado em suporte físico.',
        controlFields: [
            { tag: '001' },
            { tag: '005' }
        ],
        dataFields: [
            { tag: '010', ind1: '#', ind2: '#' }, // ISBN
            { tag: '100', ind1: '#', ind2: '#' }, // Dados gerais de processamento
            { tag: '101', ind1: '#', ind2: '#' }, // Idioma (se relevante, como audiobooks)
            { tag: '102', ind1: '#', ind2: '#' }, // País de produção
            { tag: '200', ind1: '1', ind2: '#' }, // Título e menção de responsabilidade
            { tag: '210', ind1: '#', ind2: '#' }, // Publicação, distribuição, etc
            { tag: '215', ind1: '#', ind2: '#' }, // Descrição física (número de CDs, duração)
            { tag: '230', ind1: '#', ind2: '#' }, // Características do recurso (formato digital, ex: "CD áudio")
            { tag: '327', ind1: '#', ind2: '#' }, // Lista de faixas
            { tag: '454', ind1: '#', ind2: '#' }, // Título original
            { tag: '475', ind1: '1', ind2: '#' }, // Intérprete (campo específico para música)
            { tag: '606', ind1: '#', ind2: '#' }, // Assunto do artigo
            { tag: '676', ind1: '#', ind2: '#' }, // Classificação (se aplicável)
            { tag: '686', ind1: '#', ind2: '#' }, // Género musical
            { tag: '700', ind1: '1', ind2: '#' }, // Compositor
            { tag: '701', ind1: '1', ind2: '#' }, // Artista secundário
            { tag: '711', ind1: '1', ind2: '#' }, // Grupo/ Orquestra
            { tag: '801', ind1: '#', ind2: '#' } // Origem do registo
        ]
    },
    {
        name: 'DVD (Vídeo)',
        description: 'Filmes, documentários, gravações visuais.',
        controlFields: [
            { tag: '001' },
            { tag: '005' }
        ],
        dataFields: [
            { tag: '010', ind1: '#', ind2: '#' }, // ISBN
            { tag: '100', ind1: '#', ind2: '#' },
            { tag: '101', ind1: '#', ind2: '#' }, // Idioma (áudio/legendas)
            { tag: '102', ind1: '#', ind2: '#' }, // País
            { tag: '200', ind1: '1', ind2: '#' }, // Título principal
            { tag: '205', ind1: '#', ind2: '#' }, // Edição
            { tag: '210', ind1: '#', ind2: '#' }, // Publicação
            { tag: '215', ind1: '#', ind2: '#' }, // Descrição física
            { tag: '230', ind1: '#', ind2: '#' }, // Formato (ex: "DVD-9")
            { tag: '300', ind1: '#', ind2: '#' }, // Notas técnicas
            { tag: '330', ind1: '#', ind2: '#' }, // Sinopse
            { tag: '517', ind1: '1', ind2: '#' }, // Título original
            { tag: '606', ind1: '#', ind2: '#' }, // Gênero
            { tag: '700', ind1: '1', ind2: '#' }, // Diretor (com $4=drt)
            { tag: '701', ind1: '1', ind2: '#' }, // Atores (com $4=act)
            { tag: '702', ind1: '1', ind2: '#' }, // Outros colaboradores (ex: roteirista)
            { tag: '856', ind1: '4', ind2: '#' }, // Link 
            { tag: '801', ind1: '#', ind2: '#' }  // Origem
        ]
    },
    {
        name: 'Mapa (Material Cartográfico)',
        description: 'Representações geográficas.',
        controlFields: [
            { tag: '001' },
            { tag: '005' }
        ],
        dataFields: [
            { tag: '100', ind1: '#', ind2: '#' }, // Dados gerais de processamento
            { tag: '101', ind1: '#', ind2: '#' }, // Idioma
            { tag: '102', ind1: '#', ind2: '#' }, // País de produção
            { tag: '120', ind1: '#', ind2: '#' }, // Tipo de mapa
            { tag: '200', ind1: '1', ind2: '#' }, // Título e menção de responsabilidade
            { tag: '206', ind1: '#', ind2: '#' }, // Dados matemáticos (escala, projeção)
            { tag: '210', ind1: '#', ind2: '#' }, // Publicação
            { tag: '215', ind1: '#', ind2: '#' }, // Descrição física (tamanho, cor, suporte)
            { tag: '300', ind1: '#', ind2: '#' }, // Notas (abrangência geográfica)
            { tag: '454', ind1: '1', ind2: '#' }, // Título paralelo
            { tag: '607', ind1: '#', ind2: '#' }, // Assunto geográfico
            { tag: '686', ind1: '#', ind2: '#' }, // Classificação
            { tag: '701', ind1: '1', ind2: '#' }, // Cartógrafo
            { tag: '702', ind1: '1', ind2: '#' }, // Outros colaboradores (ex: editor)
            { tag: '801', ind1: '#', ind2: '#' }  // Origem
        ]
    },
    {
        name: 'Material Eletrónico',
        description: 'Recursos digitais, websites, ficheiros multimédia.',
        controlFields: [
            { tag: '001' },
            { tag: '005' }
        ],
        dataFields: [
            { tag: '010', ind1: '#', ind2: '#' }, // ISBN (se aplicável)
            { tag: '100', ind1: '#', ind2: '#' }, // Dados gerais de processamento
            { tag: '101', ind1: '#', ind2: '#' }, // Idioma
            { tag: '200', ind1: '1', ind2: '#' }, // Título e menção de responsabilidade
            { tag: '206', ind1: '#', ind2: '#' }, // Dados matemáticos (escala, projeção)
            { tag: '210', ind1: '#', ind2: '#' }, // Publicação
            { tag: '215', ind1: '#', ind2: '#' }, // Descrição física (tamanho, cor, suporte)
            { tag: '300', ind1: '#', ind2: '#' }, // Notas (abrangência geográfica)
            { tag: '454', ind1: '1', ind2: '#' }, // Título paralelo
            { tag: '607', ind1: '#', ind2: '#' }, // Assunto geográfico
            { tag: '686', ind1: '#', ind2: '#' }, // Classificação
            { tag: '701', ind1: '1', ind2: '#' }, // Cartógrafo
            { tag: '702', ind1: '1', ind2: '#' }, // Outros colaboradores (ex: editor)
            { tag: '801', ind1: '#', ind2: '#' }  // Origem
        ]
    },
    {
        name: 'Imagem Estática',
        description: 'Fotografias, gravuras, pinturas.',
        controlFields: [
            { tag: '001' },
            { tag: '005' }
        ],
        dataFields: [
            { tag: '100', ind1: '#', ind2: '#' }, // Dados gerais de processamento
            { tag: '102', ind1: '#', ind2: '#' }, // País de origem
            { tag: '120', ind1: '#', ind2: '#' }, // Tipo codificado
            { tag: '200', ind1: '1', ind2: '#' }, // Título e menção de responsabilidade
            { tag: '215', ind1: '#', ind2: '#' }, // Descrição física (técnica: "1 fotigrafia: p&b")
            { tag: '300', ind1: '#', ind2: '#' }, // Notas
            { tag: '330', ind1: '#', ind2: '#' }, // Descrição do conteúdo
            { tag: '454', ind1: '1', ind2: '#' }, // Título paralelo
            { tag: '606', ind1: '#', ind2: '#' }, // Assunto (ex: "Retratos")
            { tag: '607', ind1: '#', ind2: '#' }, // Localização geográfica
            { tag: '686', ind1: '#', ind2: '#' }, // Classificação
            { tag: '700', ind1: '1', ind2: '#' }, // Fotógrafo/ artista
            { tag: '702', ind1: '1', ind2: '#' }, // Outros (ex: proprietário)
            { tag: '801', ind1: '#', ind2: '#' }  // Origem
        ]
    },
    {
        name: 'Material Projetável',
        description: 'Slides, filmes de projetos, multimédia.',
        controlFields: [
            { tag: '001' },
            { tag: '005' }
        ],
        dataFields: [
            { tag: '100', ind1: '#', ind2: '#' }, // Dados gerais de processamento
            { tag: '102', ind1: '#', ind2: '#' }, // País de origem
            { tag: '120', ind1: '#', ind2: '#' }, // Tipo codificado
            { tag: '200', ind1: '1', ind2: '#' }, // Título e menção de responsabilidade
            { tag: '205', ind1: '#', ind2: '#' }, // Edição
            { tag: '215', ind1: '#', ind2: '#' }, // Descrição física (técnica: "1 fotigrafia: p&b")
            { tag: '230', ind1: '#', ind2: '#' }, // Características (ex: "Diapositivos")
            { tag: '300', ind1: '#', ind2: '#' }, // Notas (conteúdo)
            { tag: '327', ind1: '#', ind2: '#' }, // Conteúdo detalhado
            { tag: '330', ind1: '#', ind2: '#' }, // Resumo
            { tag: '606', ind1: '#', ind2: '#' }, // Assunto
            { tag: '686', ind1: '#', ind2: '#' }, // Classificação
            { tag: '700', ind1: '1', ind2: '#' }, // Autor principal
            { tag: '701', ind1: '1', ind2: '#' }, // Colaboradores
            { tag: '702', ind1: '1', ind2: '#' }, // Produtor/Editor
            { tag: '801', ind1: '#', ind2: '#' }  // Origem
        ]
    },
    {
        name: 'Objeto Tridimensional',
        description: 'Kits, maquetes, peças físicas.',
        controlFields: [
            { tag: '001' },
            { tag: '005' }
        ],
        dataFields: [
            { tag: '100', ind1: '#', ind2: '#' }, // Dados gerais de processamento
            { tag: '102', ind1: '#', ind2: '#' }, // País
            { tag: '200', ind1: '1', ind2: '#' }, // Título e menção de responsabilidade
            { tag: '215', ind1: '#', ind2: '#' }, // Descrição física
            { tag: '230', ind1: '#', ind2: '#' }, // Tipo de objeto 
            { tag: '300', ind1: '#', ind2: '#' }, // Notas (conteúdo)
            { tag: '330', ind1: '#', ind2: '#' }, // Descrição do conteúdo
            { tag: '606', ind1: '#', ind2: '#' }, // Assunto
            { tag: '607', ind1: '#', ind2: '#' }, // Local associado
            { tag: '686', ind1: '#', ind2: '#' }, // Classificação
            { tag: '700', ind1: '1', ind2: '#' }, // Criador/ Designer
            { tag: '701', ind1: '1', ind2: '#' }, // Fabricante
            { tag: '702', ind1: '1', ind2: '#' }, // Doador
            { tag: '801', ind1: '#', ind2: '#' }  // Origem
        ]
    },
    {
        name: 'Arquivo/ Coleção',
        description: 'Conjuntos de documentos ou obras.',
        controlFields: [
            { tag: '001' },
            { tag: '005' }
        ],
        dataFields: [
            { tag: '100', ind1: '#', ind2: '#' }, // Dados gerais de processamento
            { tag: '102', ind1: '#', ind2: '#' }, // País
            { tag: '200', ind1: '1', ind2: '#' }, // Título e menção de responsabilidade
            { tag: '215', ind1: '#', ind2: '#' }, // Descrição física
            { tag: '300', ind1: '#', ind2: '#' }, // Notas (conteúdo)
            { tag: '323', ind1: '#', ind2: '#' }, // Notas de participantes (para coleções pessoais)
            { tag: '351', ind1: '#', ind2: '#' }, // Arranjo
            { tag: '545', ind1: '#', ind2: '#' }, // Nota biográfica 
            { tag: '555', ind1: '#', ind2: '#' }, // Índice
            { tag: '606', ind1: '#', ind2: '#' }, // Assunto
            { tag: '686', ind1: '#', ind2: '#' }, // Classificação
            { tag: '700', ind1: '1', ind2: '#' }, // Colecionador
            { tag: '710', ind1: '1', ind2: '#' }, // Instituição
            { tag: '801', ind1: '#', ind2: '#' }  // Origem
        ]
    },
    {
        name: 'Tese/ Dissertação',
        description: 'Trabalhos académicos (mestrado, doutoramento).',
        controlFields: [
            { tag: '001' },
            { tag: '005' }
        ],
        dataFields: [
            { tag: '010', ind1: '#', ind2: '#' }, // ISBN
            { tag: '100', ind1: '#', ind2: '#' }, // Dados gerais de processamento
            { tag: '101', ind1: '#', ind2: '#' }, // Idioma
            { tag: '200', ind1: '1', ind2: '#' }, // Título e menção de responsabilidade
            { tag: '210', ind1: '#', ind2: '#' }, // Publicação 
            { tag: '215', ind1: '#', ind2: '#' }, // Descrição física
            { tag: '300', ind1: '#', ind2: '#' }, // Notas (conteúdo)
            { tag: '328', ind1: '#', ind2: '#' }, // Nota de tese (grau, instituição)
            { tag: '330', ind1: '#', ind2: '#' }, // Resumo
            { tag: '463', ind1: '1', ind2: '#' }, // Link institucional
            { tag: '502', ind1: '#', ind2: '#' }, // Grau
            { tag: '606', ind1: '#', ind2: '#' }, // Assunto
            { tag: '700', ind1: '1', ind2: '#' }, // Autor
            { tag: '701', ind1: '1', ind2: '#' }, // Orientador
            { tag: '702', ind1: '1', ind2: '#' }, // Co-orientador
            { tag: '801', ind1: '#', ind2: '#' }  // Origem
        ]
    },
    {
        name: 'Partitura Musical',
        description: 'Partituras impressas ou manuscritas.',
        controlFields: [
            { tag: '001' },
            { tag: '005' }
        ],
        dataFields: [
            { tag: '010', ind1: '#', ind2: '#' }, // ISBN
            { tag: '100', ind1: '#', ind2: '#' }, // Dados gerais de processamento
            { tag: '101', ind1: '#', ind2: '#' }, // Idioma do texto musical
            { tag: '125', ind1: '#', ind2: '#' }, // Forma musical 
            { tag: '200', ind1: '1', ind2: '#' }, // Título e menção de responsabilidade
            { tag: '208', ind1: '1', ind2: '#' }, // Dados específicos (formato da partitura)
            { tag: '210', ind1: '#', ind2: '#' }, // Editora musical
            { tag: '215', ind1: '#', ind2: '#' }, // Descrição física
            { tag: '327', ind1: '#', ind2: '#' }, // Estrutura da obra 
            { tag: '475', ind1: '1', ind2: '#' }, // Intérprete/ Instrumentação
            { tag: '606', ind1: '#', ind2: '#' }, // Género musical
            { tag: '686', ind1: '#', ind2: '#' }, // Classificação
            { tag: '700', ind1: '1', ind2: '#' }, // Compositor
            { tag: '702', ind1: '1', ind2: '#' }, // Arranjador
            { tag: '801', ind1: '#', ind2: '#' }  // Origem
        ]
    },
]

export async function seedTemplates() {
    for (const templateData of templates) {
        const template = await prisma.template.upsert({
            where: { name: templateData.name },
            update: {},
            create: {
                name: templateData.name,
                description: templateData.description,
            },
        })

        for (const field of templateData.controlFields) {
            const definition = await prisma.controlFieldDefinition.findFirst({
                where: { tag: field.tag },
            })

            if (!definition) {
                console.warn(`⚠️ Definição para tag ${field.tag} não encontrada. A saltar.`)
                continue
            }

            await prisma.templateControlField.create({
                data: {
                    templateId: template.id,
                    definitionId: definition.id,
                }
            })
        }

        for (const field of templateData.dataFields) {
            const definition = await prisma.dataFieldDefinition.findFirst({
                where: { tag: field.tag },
            })

            if (!definition) {
                console.warn(`⚠️ Definição para tag ${field.tag} não encontrada. A saltar.`)
                continue
            }

            await prisma.templateDataField.create({
                data: {
                    templateId: template.id,
                    definitionId: definition.id,
                    defaultInd1: field.ind1,
                    defaultInd2: field.ind2,
                },
            })
        }

        console.log(`✅ Template "${templateData.name}" criado com sucesso.`)
    }
}


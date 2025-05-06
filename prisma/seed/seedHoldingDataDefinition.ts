import { PrismaClient } from "@prisma/client"
const prisma = new PrismaClient()

const holdingDataDefinitionsData = [
    {
        tag: "035",
        name: "OTHER SYSTEMS CONTROL NUMBER",
        ind1Tips: ["0 - Number of a Holdings Record, 1 - Number of a Bibliographic Record"],
        ind2Tips: ["Em branco (não definido)"],
        tips: ["O campo contém o número de controlo de um registo de acervo ou de um registo bibliográfico obtido a partir de outras fontes."],
        subFieldDef: [
            { code: "a", label: "System Control Number", repeatable: false, mandatory: false, tips: ["Um código para a organização entre parênteses seguido do número de controlo do sistema para a registo na base de dados daquela organização. O nome completo da agência ou um código nacional pode ser usado. Não repetível."] },
            { code: "z", label: "Canceled or Invalid Control Number", repeatable: true, mandatory: false }
        ]
    },
    {
        tag: "070",
        name: "INVENTORY NUMBER",
        ind1Tips: ["# - Unspecified Number Type, 1 - Accession Number, 2 - Storage Number, 3 - Loan Number, 8 - Other"],
        ind2Tips: ["# - No defined relation, 1 - Same as Shelf-Mark"],
        tips: ["Este campo contém números de aquisição, armazenamento, empréstimo ou outros, bem como identificadores de volume e cópia, atribuído pela instituição detentora e considerado importante para o controlo dos artigos."],
        subFieldDef: [
            { code: "a", label: "Number", repeatable: false, mandatory: false },
            { code: "b", label: "Volume Identifier", repeatable: true, mandatory: false },
            { code: "c", label: "Copy Identifier", repeatable: true, mandatory: false }
        ]
    },
    {
        tag: "100",
        name: "GENERAL PROCESSING DATA",
        ind1Tips: ["Em branco (não definido)"],
        ind2Tips: ["Em branco (não definido)"],
        tips: ["Este campo contém dados codificados básicos aplicáveis a todos os tipos de registos de coleções."],
        subFieldDef: [
            { code: "a", label: "General processing data", repeatable: false, mandatory: true }
        ]
    },
    {
        tag: "170",
        name: "CODED DATA FIELD: ACQUISITION STATUS",
        ind1Tips: ["Em branco (não definido)"],
        ind2Tips: ["Em branco (não definido)"],
        tips: ["Este campo contém dados codificados aplicáveis a todos os tipos de registos de coleções que indicam se um unidade bibliográfica foi ou será adquirida para a instituição relatora."],
        subFieldDef: [
            { code: "a", label: "Acquisition status designator", repeatable: false, mandatory: true, tips: ["Situação específica de aquisição da unidade à data do relatório de participações que indica se uma unidade foi ou será adquirida para a instituição relatora."] }
        ]
    },
    {
        tag: "171",
        name: "CODED DATA FIELD: COLLECTION MANAGEMENT",
        ind1Tips: ["Em branco (não definido)"],
        ind2Tips: ["Em branco (não definido)"],
        tips: ["Este campo contém dados codificados aplicáveis a todos os tipos de registos de coleções que indicam se um unidade bibliográfica foi ou será adquirida para a instituição relatora."],
        subFieldDef: [
            { code: "a", label: "Coded data", repeatable: false, mandatory: true }
        ]
    },
    {
        tag: "172",
        name: "CODED DATA FIELD: INFORMATION SERVICE POLICY",
        ind1Tips: ["Em branco (não definido)"],
        ind2Tips: ["Em branco (não definido)"],
        tips: ["Este campo contém dados codificados aplicáveis a todos os tipos de registos de coleções, que indicam o caráter geral política de consulta, empréstimo externo ou reprodução de uma unidade bibliográfica em geral ou de uma das suas unidades físicas especificadas no registo de coleções."],
        subFieldDef: [
            { code: "a", label: "Coded data", repeatable: false, mandatory: true }
        ]
    },
    {
        tag: "252",
        name: "LOCATION AND CALL NUMBER",
        ind1Name: "Shelving scheme",
        ind1Tips: ["Um valor que indica o esquema de classificação ou de arquivo utilizado."],
        ind2Name: "Shelving order",
        ind2Tips: ["Um valor que indica se um item está arquivado sob uma numeração primária ou alternativa esquema."],
        tips: ["Este campo é utilizado para identificar a organização que detém o artigo ou onde está disponível. Este campo também pode conter informações detalhadas sobre como localizar o artigo numa coleção."],
        subFieldDef: [
            { code: "a", label: "Institution Identifier", repeatable: false, mandatory: true, tips: ["Identifica a instituição ou indivíduo que detém o item ou a quem é concedido o acesso. O subcampo contém um código de organização ou o nome da instituição ou indivíduo."] },
            { code: "b", label: "Sub-Location Identifier", repeatable: false, mandatory: true, tips: ["O departamento específico, biblioteca, coleção ou localização de estantes, dentro do acervo organização na qual o artigo está localizado ou onde está disponível.", "Pode indicar o localização física dentro da coleção ou sublocalização."] },
            { code: "c", label: "Address", repeatable: false, mandatory: false, tips: ["Endereço da rua, cidade, estado/condado etc., código postal etc. e informações do país para o localização física atual do artigo.", "Forneça o endereço do sublocal ($b) quando presente e diferente da do edifício principal."] },
            { code: "d", label: "Coded Location Qualifier", repeatable: false, mandatory: false, tips: ["Um código de dois ou três caracteres que identifica os problemas específicos do artigo que estão localizados para além das principais participações do mesmo item."] },
            { code: "e", label: "Non-coded Location Qualifier", repeatable: false, mandatory: false, tips: ["Texto livre que é utilizado quando os códigos no subcampo $d são inadequados para descrever a unidade que está localizado longe dos principais acervos do mesmo item."] },
            { code: "g", label: "Call Number Prefix", repeatable: false, mandatory: false, tips: ["Termo que precede um número de chamada."] },
            { code: "j", label: "Call Number", repeatable: false, mandatory: false, tips: ["Este subcampo contém o número de chamada, incluindo pontuação, espaçamento e capitalização, bem como especificado pela instituição detentora do artigo.", "O número de chamada pode também incluir um número implícito ou Identificador de cópia explícito, ou um número de cópia, ou um número de volume, ou arquivo ou custódia localização.", "Quando estes assumem a forma de elementos separáveis, utilize os subcampos adequados para eles."] },
            { code: "k", label: "Shelving Form of Title, Author, Author/ Title", repeatable: false, mandatory: false, tips: ["A parte do título da prateleira, nome do autor ou autor/título de um item não classificado que é arquivado por esses dados. (Indicador 1 = 3)."] },

        ]
    },
]
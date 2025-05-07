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
        tag: "130",
        name: "CODED DATA FIELD: MICROFORMS",
        ind1Tips: ["Em branco (não definido)"],
        ind2Tips: ["Em branco (não definido)"],
        tips: [
            "Este campo contém dados codificados relativos à reprodução em microforma da cópia e pode ser utilizado tanto em Registos bibliográficos da UNIMARC ou em registos de acervos da UNIMARC, de acordo com a utilização do agência bibliográfica.",
            "Caso o documento exista apenas em microforma deverá ser utilizado o campo 130 do formato bibliográfico UNIMARC.",
            "A utilização deste campo no formato de coleções do UNIMARC está de acordo com a utilização do mesmo campo no formato bibliográfico UNIMARC.",
            "Contém dados codificados sobre atributos físicos de microformas.",
            "Inclui suporte, polaridade, redução, cor, emulsão, geração e base do filme."
        ],
        subFieldDef: [
            { code: "a", label: "Microform Coded Data - Physical Attributes", repeatable: false, mandatory: false, tips: ["11 posições codificadas. Ex: tipo de microforma, polaridade, redução, cor, emulsão, base, etc."] }
        ]
    },
    {
        tag: "135",
        name: "CODED DATA FIELD: ELECTRONIC RESOURCES",
        ind1Tips: ["Em branco (não definido)"],
        ind2Tips: ["Em branco (não definido)"],
        tips: [
            "Este campo contém dados codificados relativos a recursos eletrónicos e pode ser utilizado tanto no UNIMARC registo bibliográfico ou no registo de acervo da UNIMARC, de acordo com a utilização do registo bibliográfico da agência.",
            "Se o documento existir apenas como recurso eletrónico, o campo 135 do formato bibliográfico UNIMARC deve ser utilizado.",
            "A utilização deste campo no formato de coleções UNIMARC é de acordo com a utilização do mesmo campo em o formato bibliográfico UNIMARC.",
            "Contém dados codificados relativos a recursos eletrônicos.",
            "Cada posição do subcampo $a descreve um atributo técnico do recurso."
        ],
        subFieldDef: [
            { code: "a", label: "Coded Data for Electronic Resource", repeatable: false, mandatory: false, tips: ["13 posições codificadas. Inclui tipo de recurso, material especial, cor, dimensões, som, profundidade de bits de imagem, número de formatos de ficheiro, qualidade de digitalização, fonte, compressão e qualidade de reformatagem."] }
        ]
    },
    {
        tag: "141",
        name: "CODED DATA FIELD: COPY SPECIFIC ATTRIBUTES",
        ind1Tips: ["Em branco (não definido)"],
        ind2Tips: ["Em branco (não definido)"],
        tips: [
            "Este campo contém dados relativos aos atributos específicos da cópia e pode ser utilizado tanto no Registo bibliográfico do UNIMARC e no registo de acervo do UNIMARC, de acordo com a utilização do agência bibliográfica.",
            "A utilização deste campo no formato de coleções UNIMARC é de acordo com a utilização do mesmo campo no Formato bibliográfico UNIMARC.",
            "Dados codificados sobre características específicas de encadernação e corpo do exemplar físico de um livro.",
            "Repetível para diferentes exemplares no mesmo registo."
        ],
        subFieldDef: [
            { code: "a", label: "Coded Data - Item Specific Attributes", repeatable: false, mandatory: false, tips: [] },
            { code: "b", label: "Binding Specific Characteristics", repeatable: false, mandatory: false, tips: [] },
            { code: "c", label: "Age", repeatable: false, mandatory: false, tips: [] },
            { code: "d", label: "Binding State of Preservation Code - Specific", repeatable: false, mandatory: false, tips: [] },
            { code: "e", label: "Body of the Book Specific Characteristics", repeatable: false, mandatory: false, tips: [] },
            { code: "f", label: "Body of the Book State of Preservation Code - Specific", repeatable: false, mandatory: false, tips: [] },
            { code: "5", label: "Institution to which the Field Applies", repeatable: false, mandatory: false, tips: [] }

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
            { code: "l", label: "Call Number Suffix", repeatable: false, mandatory: false, tips: ["Termo que se segue ao número de chamada."] },
            { code: "m", label: "Item Identifier", repeatable: false, mandatory: false, tips: ["O subcampo contém a identificação de uma única peça, ou seja, uma peça bibliográfica fisicamente separada item.", "A designação pode ser um número de identificação, como um número de código de barras ou um número de registo número."] },
            { code: "n", label: "Copy Identifier", repeatable: false, mandatory: false, tips: ["Se utilizado, o elemento Identificador de Cópia deverá ser reportado em conjunto com a Sublocalização Identificador ou Identificador da Instituição ou ambos.", "Em alguns casos, o Identificador de Cópia pode ser presente explícita ou implicitamente como parte do Número de Chamada."] },
            { code: "p", label: "Country", repeatable: false, mandatory: false, tips: ["Contém o código do país para a localização principal identificada no subcampo $a. Os códigos são para pode ser obtido a partir dos códigos de dois caracteres da norma ISO 3166."] },
            { code: "t", label: "Copy Number", repeatable: false, mandatory: false, tips: ["Um número de cópia ou um intervalo de números para cópias que têm o mesmo local."] },
            { code: "x", label: "Non-public Note", repeatable: true, mandatory: false, tips: ["Informações que não estão escritas num formato adequado para exibição pública."] },
            { code: "y", label: "Public Note", repeatable: true, mandatory: false },
            { code: "2", label: "System Code", repeatable: true, mandatory: false, tips: ["A classificação específica ou outro esquema e edição utilizados para a organização de materiais."] }
        ]
    },
    {
        tag: "255",
        name: "PAST LOCATION AND CALL NUMBER",
        ind1Name: "Shelving scheme",
        ind1Tips: ["Um valor que indica o esquema de classificação ou de arquivo utilizado."],
        ind2Name: "Shelving order",
        ind2Tips: ["Um valor que indica se um item está arquivado sob uma numeração primária ou alternativa esquema."],
        tips: ["Este campo contém informações detalhadas sobre a localização anterior do artigo numa coleção."],
        subFieldDef: [
            { code: "a", label: "Institution Identifier", repeatable: false, mandatory: true, tips: ["Identifica a instituição ou indivíduo que detém o item ou a quem é concedido o acesso. O subcampo contém um código de organização ou o nome da instituição ou indivíduo."] },
            { code: "b", label: "Sub-Location Identifier", repeatable: false, mandatory: true, tips: ["O departamento específico, biblioteca, coleção ou localização de estantes, dentro do acervo organização na qual o artigo está localizado ou onde está disponível.", "Pode indicar o localização física dentro da coleção ou sublocalização."] },
            { code: "c", label: "Address", repeatable: false, mandatory: false, tips: ["Endereço da rua, cidade, estado/condado etc., código postal etc. e informações do país para o localização física atual do artigo.", "Forneça o endereço do sublocal ($b) quando presente e diferente da do edifício principal."] },
            { code: "d", label: "Coded Location Qualifier", repeatable: false, mandatory: false, tips: ["Um código de dois ou três caracteres que identifica os problemas específicos do artigo que estão localizados para além das principais participações do mesmo item."] },
            { code: "e", label: "Non-coded Location Qualifier", repeatable: false, mandatory: false, tips: ["Texto livre que é utilizado quando os códigos no subcampo $d são inadequados para descrever a unidade que está localizado longe dos principais acervos do mesmo item."] },
            { code: "g", label: "Call Number Prefix", repeatable: false, mandatory: false, tips: ["Termo que precede um número de chamada."] },
            { code: "j", label: "Call Number", repeatable: false, mandatory: false, tips: ["Este subcampo contém o número de chamada, incluindo pontuação, espaçamento e capitalização, bem como especificado pela instituição detentora do artigo.", "O número de chamada pode também incluir um número implícito ou Identificador de cópia explícito, ou um número de cópia, ou um número de volume, ou arquivo ou custódia localização.", "Quando estes assumem a forma de elementos separáveis, utilize os subcampos adequados para eles."] },
            { code: "k", label: "Shelving Form of Title, Author, Author/ Title", repeatable: false, mandatory: false, tips: ["A parte do título da prateleira, nome do autor ou autor/título de um item não classificado que é arquivado por esses dados. (Indicador 1 = 3)."] },
            { code: "l", label: "Call Number Suffix", repeatable: false, mandatory: false, tips: ["Termo que se segue ao número de chamada."] },
            { code: "m", label: "Item Identifier", repeatable: false, mandatory: false, tips: ["O subcampo contém a identificação de uma única peça, ou seja, uma peça bibliográfica fisicamente separada item.", "A designação pode ser um número de identificação, como um número de código de barras ou um número de registo número."] },
            { code: "n", label: "Copy Identifier", repeatable: false, mandatory: false, tips: ["Se utilizado, o elemento Identificador de Cópia deverá ser reportado em conjunto com a Sublocalização Identificador ou Identificador da Instituição ou ambos.", "Em alguns casos, o Identificador de Cópia pode ser presente explícita ou implicitamente como parte do Número de Chamada."] },
            { code: "p", label: "Country", repeatable: false, mandatory: false, tips: ["Contém o código do país para a localização principal identificada no subcampo $a. Os códigos são para pode ser obtido a partir dos códigos de dois caracteres da norma ISO 3166."] },
            { code: "t", label: "Copy Number", repeatable: false, mandatory: false, tips: ["Um número de cópia ou um intervalo de números para cópias que têm o mesmo local."] },
            { code: "x", label: "Non-public Note", repeatable: true, mandatory: false, tips: ["Informações que não estão escritas num formato adequado para exibição pública."] },
            { code: "y", label: "Public Note", repeatable: true, mandatory: false },
            { code: "2", label: "System Code", repeatable: true, mandatory: false, tips: ["A classificação específica ou outro esquema e edição utilizados para a organização de materiais."] }
        ]
    },
    {
        tag: "256",
        name: "ELECTRONIC LOCATION AND ACCESS",
        ind1Name: "Access Method",
        ind1Tips: ["0 - Email, 1 - FTP, 2 - Remote login (Telnet), 3 - Dial-up, 4 - HTTP, 7 - Method specified in subfield $y"],
        ind2Tips: ["Em branco (não definido)"],
        tips: ["Este campo é utilizado para identificar a organização que detém o artigo ou onde está disponível. Este campo também pode conter informações detalhadas sobre como localizar o artigo numa coleção."],
        subFieldDef: [
            { code: "a", label: "Host name", repeatable: true, mandatory: true },
            { code: "b", label: "Access number", repeatable: true, mandatory: true, tips: ["O número de acesso associado a um host.", "Pode conter o número de Protocolo de Internet (IP) endereço se o item for um recurso da Internet ou um número de telefone se o acesso por marcação for fornecido através de uma linha telefónica.", "Estes dados podem mudar frequentemente e podem ser gerados pelo sistema, em vez de armazenados estaticamente."] },
            { code: "c", label: "Compression information", repeatable: true, mandatory: true },
            { code: "d", label: "Path", repeatable: true, mandatory: true },
            { code: "e", label: "Date and Hour of Consultation and Access", repeatable: false, mandatory: true, tips: ["The time, in the form YYYYMMDDHHMM, at which the electronic item was last accessed."] },
            { code: "f", label: "Electronic name", repeatable: true, mandatory: true, tips: ["O nome eletrónico de um ficheiro tal como existe no diretório/subdiretório indicado no subcampo $d em o host identificado no subcampo $a."] },
            { code: "h", label: "Processor of request", repeatable: false, mandatory: true, tips: ["O nome de utilizador ou processador do pedido; geralmente os dados que precedem o sinal de arroba ('@') em o endereço do host."] },
            { code: "i", label: "Instruction", repeatable: false, mandatory: true, tips: ["Uma instrução ou comando necessário para o host remoto processar um pedido."] },
            { code: "j", label: "Bits per second", repeatable: false, mandatory: true, tips: ["O menor e o maior número de bits (unidades binárias) de dados que podem ser transmitidos por segundo quando ligado a um host."] },
            { code: "k", label: "Password", repeatable: false, mandatory: true, tips: ["Utilizado para registar palavras-passe de uso geral e não deve conter palavras-passe que exijam segurança."] },
            { code: "l", label: "Logon/login", repeatable: false, mandatory: true, tips: ["Sequências de caracteres de logon/login de utilização geral que não requerem segurança especial."] },
            { code: "m", label: "Contact for access assistance", repeatable: true, mandatory: true },
            { code: "n", label: "Name of location of host in subfield $a", repeatable: false, mandatory: true },
            { code: "o", label: "Operating system", repeatable: false, mandatory: true, tips: ["Para informação, o sistema operativo utilizado pelo host especificado no subcampo $a é indicado neste subcampo."] },
            { code: "p", label: "Port", repeatable: false, mandatory: true, tips: ["A parte do endereço que identifica um processo ou serviço no host."] },
            { code: "q", label: "Electronic Format Type", repeatable: false, mandatory: true, tips: ["Contém uma identificação do tipo de formato eletrónico, que determina a forma como os dados são transferidos através de uma rede."] },
            { code: "r", label: "Settings", repeatable: false, mandatory: true, tips: ["As definições utilizadas para transferir dados."] },
            { code: "s", label: "File size", repeatable: true, mandatory: true, tips: ["O tamanho do ficheiro armazenado sob o nome de ficheiro indicado no subcampo $f."] },
            { code: "t", label: "Terminal emulation", repeatable: true, mandatory: true },
            { code: "u", label: "Uniform Resource Identifier", repeatable: false, mandatory: true, tips: ["O URI, que fornece a sintaxe padrão para localizar um objeto utilizando os protocolos de Internet existentes."] },
            { code: "v", label: "Hours access method available", repeatable: true, mandatory: true, tips: ["Os horários em que o acesso a um recurso eletrónico está disponível no local indicado neste campo."] },
            { code: "w", label: "Record control number", repeatable: true, mandatory: true },
            { code: "x", label: "Non-public note", repeatable: true, mandatory: true },
            { code: "y", label: "Access method", repeatable: false, mandatory: true, tips: ["O método de acesso quando a primeira posição do indicador contém o valor 7 (Método especificado na subcampo $y)."] },
            { code: "z", label: "Public note", repeatable: true, mandatory: true },
            { code: "2", label: "Link text", repeatable: true, mandatory: true, tips: ["Utilizado para apresentação no lugar do URL no subcampo $u (Uniform Resource Identifier)."] }
        ]
    },
    {
        tag: "300",
        name: "GENERAL NOTES",
        ind1Tips: ["Em branco (não definido)"],
        ind2Tips: ["Em branco (não definido)"],
        tips: ["O campo contém uma nota sobre qualquer aspeto do item ou registo relacionado com o mesmo."],
        subFieldDef: [
            { code: "a", label: "Text of Note", repeatable: true, mandatory: false }
        ]
    },
    {
        tag: "301",
        name: "NOTES PERTAINING TO IDENTIFICATION NUMBERS",
        ind1Tips: ["Em branco (não definido)"],
        ind2Tips: ["Em branco (não definido)"],
        tips: ["Este campo contém uma nota sobre qualquer número de identificação que apareça no item ou no registo."],
        subFieldDef: [
            { code: "a", label: "Text of Note", repeatable: true, mandatory: false }
        ]
    },
    {
        tag: "302",
        name: "NOTES PERTAINING TO CODED INFORMATION",
        ind1Tips: ["Em branco (não definido)"],
        ind2Tips: ["Em branco (não definido)"],
        tips: ["O campo continha uma nota sobre elementos de dados que estão codificados em 1-- CODED INFORMATION BLOCK."],
        subFieldDef: [
            { code: "a", label: "Text of Note", repeatable: true, mandatory: false }
        ]
    },
    {
        tag: "310",
        name: "NOTES PERTAINING TO BINDING AND AVAILABILITY",
        ind1Tips: ["# - Não definido"],
        ind2Tips: ["# - Não definido"],
        tips: [
            "Este campo pode ser utilizado tanto no registo bibliográfico do UNIMARC como no registo de acervos do UNIMARC, de acordo com o recurso à agência bibliográfica.",
            "A utilização deste campo no formato de coleções UNIMARC é de acordo com a utilização do mesmo campo em Formato bibliográfico UNIMARC.",
            "Contém notas sobre a encadernação ou disponibilidade do recurso.",
            "Inclui informações sobre edições especiais, cópias limitadas, condições de compra, etc."
        ],
        subFieldDef: [
            { code: "a", label: "Text of Note", repeatable: false, mandatory: false, tips: ["Texto livre da nota sobre encadernação ou disponibilidade."] }
        ]
    },
    {
        tag: "316",
        name: "NOTES RELATING TO THE COPY IN HAND",
        ind1Tips: ["# - Não definido"],
        ind2Tips: ["# - Não definido"],
        tips: [
            "Este campo contém uma nota relativa ao exemplar em mãos para publicações monográficas mais antigas (antiquário). Corresponde às Notas ISBD(A) relativas ao elemento Cópia em mãos na Área de observação.",
            "Este campo pode ser utilizado tanto no registo bibliográfico do UNIMARC como nos acervos do UNIMARC registo, conforme utilização da agência bibliográfica.",
            "A utilização deste campo no formato de coleções UNIMARC é de acordo com a utilização do mesmo campo em Formato bibliográfico UNIMARC.",
            "Contém uma nota relativa às características específicas de um exemplar do recurso.",
            "Inclui notas sobre encadernações, cópias numeradas, falhas, entre outros."
        ],
        subFieldDef: [
            { code: "a", label: "Text of Note", repeatable: true, mandatory: false, tips: ["Nota textual sobre características específicas do exemplar."] },
            { code: "u", label: "Uniform Resource Identifier (URI)", repeatable: true, mandatory: false, tips: ["URI para aceder eletronicamente à informação do exemplar."] },
            { code: "5", label: "Institution to which the Field Applies", repeatable: false, mandatory: false, tips: ["Código da instituição a que o campo se aplica."] },
            { code: "6", label: "Interfield Linking Data", repeatable: true, mandatory: false, tips: ["Dados de ligação entre campos."] }
        ]
    },
    {
        tag: "317",
        name: "PROVENANCE NOTE",
        ind1Name: ["Type of Provenance Information"],
        ind1Tips: ["# - Não especificado, 0 -  Archeological provenance"],
        ind2Tips: ["# - Não definido"],
        tips: [
            "Este campo pode ser utilizado tanto no registo bibliográfico do UNIMARC como no registo de acervos do UNIMARC, de acordo com o recurso à agência bibliográfica.",
            "A utilização deste campo no formato de coleções UNIMARC é de acordo com a utilização do mesmo campo em Formato bibliográfico UNIMARC.",
            "Contém uma nota relativa à proveniência do exemplar.",
            "Pode incluir inscrições, ex-libris, históricos de propriedade, etc."
        ],
        subFieldDef: [
            { code: "a", label: "Text of Note", repeatable: false, mandatory: false, tips: ["Texto da nota sobre proveniência."] },
            { code: "u", label: "Uniform Resource Identifier (URI)", repeatable: true, mandatory: false, tips: ["URI para imagens ou documentos de proveniência."] },
            { code: "5", label: "Institution to which the Field Applies", repeatable: false, mandatory: false, tips: ["Código da instituição a que o campo se aplica."] },
            { code: "6", label: "Interfield Linking Data", repeatable: true, mandatory: false, tips: ["Dados para ligar campos relacionados no registo."] },
            { code: "8", label: "Materials Specified", repeatable: false, mandatory: false, tips: ["Parte específica dos materiais descritos a que a nota de proveniência se aplica."] }
        ]
    },
    {
        tag: "318",
        name: "ACTION NOTE",
        ind1Tips: ["# - Não definido"],
        ind2Tips: ["# - Não definido"],
        tips: [
            "Este campo pode ser utilizado tanto no registo bibliográfico do UNIMARC como no registo de acervos do UNIMARC, de acordo com o recurso à agência bibliográfica.",
            "A utilização deste campo no formato de coleções UNIMARC é de acordo com a utilização do mesmo campo em Formato bibliográfico UNIMARC.",
            "Campo utilizado para registar informações sobre preservação e tratamento de materiais.",
            "Descreve ações realizadas no recurso ou necessárias, como conservação, reparação ou descarte."
        ],
        subFieldDef: [
            { code: "a", label: "Action", repeatable: false, mandatory: false, tips: ["Descrição da ação tomada ou prevista."] },
            { code: "b", label: "Action Identification", repeatable: true, mandatory: false, tips: ["Código ou designação para identificar a ação."] },
            { code: "c", label: "Time of Action", repeatable: true, mandatory: false, tips: ["Código para o tempo da ação (formato ISO)."] },
            { code: "d", label: "Action Interval", repeatable: true, mandatory: false, tips: ["Intervalo de tempo se a data exata não puder ser especificada."] },
            { code: "e", label: "Contingency for Action", repeatable: true, mandatory: false, tips: ["Evento imprevisível ligado à execução da ação."] },
            { code: "f", label: "Authorisation", repeatable: true, mandatory: false, tips: ["Texto ou referência à autorização para a ação."] },
            { code: "h", label: "Jurisdiction", repeatable: true, mandatory: false, tips: ["Entidade ou pessoa responsável pela ação."] },
            { code: "i", label: "Method of Action", repeatable: true, mandatory: false, tips: ["Técnica utilizada para realizar a ação."] },
            { code: "j", label: "Site of Action", repeatable: true, mandatory: false, tips: ["Local onde a ação ocorre."] },
            { code: "k", label: "Action Agent", repeatable: true, mandatory: false, tips: ["Pessoa ou organização que executa a ação."] },
            { code: "l", label: "Status", repeatable: true, mandatory: false, tips: ["Estado dos materiais descritos após a ação."] },
            { code: "n", label: "Extent", repeatable: true, mandatory: false, tips: ["Parte do item afetada pela ação."] },
            { code: "o", label: "Type of Unit", repeatable: true, mandatory: false, tips: ["Tipo de unidade afetada pela ação."] },
            { code: "p", label: "Non-public Note", repeatable: true, mandatory: false, tips: ["Notas não exibidas ao público sobre a ação."] },
            { code: "r", label: "Public Note", repeatable: true, mandatory: false, tips: ["Notas públicas relativas à ação."] },
            { code: "u", label: "Uniform Resource Identifier (URI)", repeatable: true, mandatory: false, tips: ["Link ou referência eletrónica relacionada à ação."] },
            { code: "5", label: "Institution to which the Field Applies", repeatable: false, mandatory: true, tips: ["Instituição a que a ação se aplica."] }
        ]
    },
    {
        tag: "345",
        name: "ACQUISITION INFORMATION NOTE",
        ind1Tips: ["# - Não definido"],
        ind2Tips: ["# - Não definido"],
        tips: [
            "Este campo pode ser utilizado tanto no registo bibliográfico do UNIMARC como no registo de acervos do UNIMARC, de acordo com o recurso à agência bibliográfica.",
            "A utilização deste campo no formato de coleções UNIMARC é de acordo com a utilização do mesmo campo em Formato bibliográfico UNIMARC.",
            "Este campo pode conter o nome e o endereço do editor, distribuidor ou outra fonte de aquisição."
        ],
        subFieldDef: [
            { code: "a", label: "Source for Acquisition/ Subscription Address", repeatable: false, mandatory: false, tips: ["O nome e/ou endereço de uma fonte para aquisição, incluindo o endereço de assinatura, do recurso."] },
            { code: "b", label: "Stock Number", repeatable: true, mandatory: false, tips: ["O número associado ao artigo pelo fornecedor para facilitar a distribuição do artigo."] },
            { code: "c", label: "Medium", repeatable: true, mandatory: false, tips: ["O(s) meio(s) em que o artigo está disponível."] },
            { code: "d", label: "Terms of Availability", repeatable: true, mandatory: false, tips: ["O preço do artigo em unidades monetárias ou outras unidades."] },
            { code: "u", label: "Uniform Resource Identifier (URI)", repeatable: true, mandatory: false, tips: ["Um Identificador Uniforme de Recursos (URI), como um URL (Uniform Resource Locator) ou URN (Uniform Nome do Recurso), serve como uma sequência padronizada que identifica um recurso e fornece acesso eletrónico através de protocolos de internet."] },
            { code: "5", label: "Institution to which the Field Applies", repeatable: false, mandatory: false, tips: ["Nome da instituição à qual o campo se aplica no formulário codificado, se for considerado necessário pela agência que cria o registo para identificar atributos específicos de um item."] }
        ]
    },
    {
        tag: "371",
        name: "NOTES ON INFORMATION SERVICE POLICY",
        ind1Tips: ["Em branco (não definido)"],
        ind2Tips: ["Em branco (não definido)"],
        tips: ["O campo continha uma nota sobre elementos de dados que estão codificados em 1-- CODED INFORMATION BLOCK."],
        subFieldDef: [
            { code: "a", label: "Terms governing use and reproduction", repeatable: false, mandatory: false, tips: ["O texto de uma declaração legal ou oficial de restrições."] },
            { code: "b", label: "Jurisdiction", repeatable: false, mandatory: false, tips: ["O nome de uma pessoa, de uma organização ou de um cargo ou função dentro da organização, por a quem ou quais os termos que regem o uso e a reprodução são impostos e aplicados e a a quem a restrição pode ser apelada."] },
            { code: "c", label: "Authorization", repeatable: false, mandatory: false, tips: ["Uma citação da fonte específica que é a autoridade para a restrição."] },
            { code: "d", label: "Authorized users", repeatable: false, mandatory: false, tips: ["A classe de utilizadores ou indivíduos específicos aos quais as restrições no subcampo $a não se aplicam."] },
            { code: "z", label: "Materials specified", repeatable: false, mandatory: false, tips: ["Este subcampo fornece um meio de restringir o âmbito de um campo a parte da bibliografia artigo descrito."] }
        ]
    },
    {
        tag: "372",
        name: "NOTES ON PHYSICAL CHARACTERISTICS OF AN ITEM",
        ind1Tips: ["Em branco (não definido)"],
        ind2Tips: ["Em branco (não definido)"],
        tips: ["Este campo contém uma nota sobre o meio físico, forma ou tipo de material do item."],
        subFieldDef: [
            { code: "a", label: "Text of note", repeatable: false, mandatory: false }
        ]
    },
    {
        tag: "373",
        name: "NOTES PERTAINING TO COPY HISTORY",
        ind1Tips: ["Em branco (não definido)"],
        ind2Tips: ["Em branco (não definido)"],
        tips: ["Este campo contém uma nota sobre o histórico de custódia e propriedade dos materiais descritos, desde desde a sua criação até ao momento da sua incorporação, incluindo o seu arranjo ou coleção atual."],
        subFieldDef: [
            { code: "a", label: "History", repeatable: false, mandatory: false },
            { code: "b", label: "Chronology", repeatable: false, mandatory: false }
        ]
    },
    {
        tag: "375",
        name: "NOTES PERTAINING TO COPY AND VERSION IDENTIFICATION",
        ind1Tips: ["Em branco (não definido)"],
        ind2Tips: ["Em branco (não definido)"],
        tips: ["Este campo contém informação que distingue a cópia ou versão dos materiais, quando mais de uma cópia ou versão existe ou poderia existir."],
        subFieldDef: [
            { code: "a", label: "Identifying markings", repeatable: false, mandatory: false },
            { code: "b", label: "Copy identification", repeatable: false, mandatory: false, tips: ["Informação que distingue uma cópia dos materiais descritos de outras cópias."] },
            { code: "c", label: "Version identification", repeatable: false, mandatory: false, tips: ["Informação que identifica uma versão."] },
            { code: "d", label: "Presentation format", repeatable: false, mandatory: false, tips: ["O formato em que o material deveria ser utilizado, visto ou ouvido."] },
            { code: "e", label: "Number of copies", repeatable: false, mandatory: false }

        ]
    },
    {
        tag: "500",
        name: "CAPTIONS AND PATTERN - BASIC BIBLIOGRAPHIC UNIT",
        ind1Name: "Compressibility and expandability",
        ind1Tips: ["# - No information available, 0 - Cannot compress or expand, 1 - Can compress but not expand, 2 - Can compress or expand"],
        ind2Name: "Caption evaluation",
        ind2Tips: ["# - No information available, 0 - Captions unverified: all levels may not be present, 1 - Captions unverified: all levels present, 2 - Captions verified: all levels present, 3 -  Captions verified: all levels my not be present"],
        tips: ["O campo contém informações de legenda e padrão para as quais a enumeração e a cronologia são gravado em 510 0 ENUMERATION AND CHRONOLOGY - BASIC BIBLIOGRAPHIC UNIT"],
        subFieldDef: [
            { code: "a", label: "First level of enumeration", repeatable: false, mandatory: true, tips: ["Contém legenda e padrão associados à enumeração."] },
            { code: "b", label: "Second level of enumeration.", repeatable: false, mandatory: true },
            { code: "c", label: "Third level of enumeration", repeatable: false, mandatory: true },
            { code: "d", label: "Alternative numbering scheme, first level of enumeration", repeatable: false, mandatory: true },
            { code: "e", label: "Alternative numbering scheme, second level of enumeration", repeatable: false, mandatory: true },
            { code: "f", label: "First level of chronology", repeatable: false, mandatory: true, tips: ["Contém legenda e padrão associados à cronologia."] },
            { code: "g", label: "Second level of chronology", repeatable: false, mandatory: false },
            { code: "h", label: "Third level of chronology", repeatable: false, mandatory: false },
            { code: "i", label: "Alternative chronological scheme, first level of chronology", repeatable: false, mandatory: true },
            { code: "j", label: "Name of unit", repeatable: false, mandatory: false, tips: ["Utilizado para registar a extensão das coleções de uma unidade bibliográfica básica ou secundária, como como parte de um kit, material de acompanhamento ou suplementos quando é necessário identificar o unidade que está a ser especificada."] },
            { code: "k", label: "Extent of unit", repeatable: false, mandatory: false, tips: ["Utilizado para registar itens sem designações sequenciais. É utilizado principalmente para não serial unidades."] },
            { code: "l", label: "Specific extent note", repeatable: false, mandatory: false, tips: ["Consiste em informação que esclarece ou amplia a extensão do elemento de dados do acervo."] },
            { code: "6", label: "Interfield linking data", repeatable: false, mandatory: true, tips: ["O subcampo 6 é utilizado para ligar o campo de legenda e padrão (500) à enumeração e cronologia campo (510)."] }
        ]
    },
    {
        tag: "501",
        name: "CAPTIONS AND PATTERN - SECONDARY BIBLIOGRAPHIC UNIT: SUPPLEMENTARY MATERIALS",
        ind1Name: "Compressibility and expandability",
        ind1Tips: ["# - No information available, 0 - Cannot compress or expand, 1 - Can compress but not expand, 2 - Can compress or expand"],
        ind2Name: "Caption evaluation",
        ind2Tips: ["# - No information available, 0 - Captions unverified: all levels may not be present, 1 - Captions unverified: all levels present, 2 - Captions verified: all levels present, 3 -  Captions verified: all levels my not be present"],
        tips: ["O campo contém informações de legenda e padrão para as quais a enumeração e a cronologia são gravado em 511 ENUMERATION AND CHRONOLOGY - SECONDARY BIBLIOGRAPHIC UNIT : SUPPLEMENTARY MATERIALS."],
        subFieldDef: [
            { code: "a", label: "First level of enumeration", repeatable: false, mandatory: true, tips: ["Contém legenda e padrão associados à enumeração."] },
            { code: "b", label: "Second level of enumeration.", repeatable: false, mandatory: true },
            { code: "c", label: "Third level of enumeration", repeatable: false, mandatory: true },
            { code: "d", label: "Alternative numbering scheme, first level of enumeration", repeatable: false, mandatory: true },
            { code: "e", label: "Alternative numbering scheme, second level of enumeration", repeatable: false, mandatory: true },
            { code: "f", label: "First level of chronology", repeatable: false, mandatory: true, tips: ["Contém legenda e padrão associados à cronologia."] },
            { code: "g", label: "Second level of chronology", repeatable: false, mandatory: false },
            { code: "h", label: "Third level of chronology", repeatable: false, mandatory: false },
            { code: "i", label: "Alternative chronological scheme, first level of chronology", repeatable: false, mandatory: true },
            { code: "j", label: "Name of unit", repeatable: false, mandatory: false, tips: ["Utilizado para registar a extensão das coleções de uma unidade bibliográfica básica ou secundária, como como parte de um kit, material de acompanhamento ou suplementos quando é necessário identificar o unidade que está a ser especificada."] },
            { code: "k", label: "Extent of unit", repeatable: false, mandatory: false, tips: ["Utilizado para registar itens sem designações sequenciais. É utilizado principalmente para não serial unidades."] },
            { code: "l", label: "Specific extent note", repeatable: false, mandatory: false, tips: ["Consiste em informação que esclarece ou amplia a extensão do elemento de dados do acervo."] },
            { code: "6", label: "Interfield linking data", repeatable: false, mandatory: true, tips: ["O subcampo 6 é utilizado para ligar o campo de legenda e padrão (500) à enumeração e cronologia campo (510)."] }
        ]
    },
    {
        tag: "502",
        name: "CAPTIONS AND PATTERN - SECONDARY BIBLIOGRAPHIC UNIT: INDEXES",
        ind1Name: "Compressibility and expandability",
        ind1Tips: ["# - No information available, 0 - Cannot compress or expand, 1 - Can compress but not expand, 2 - Can compress or expand"],
        ind2Name: "Caption evaluation",
        ind2Tips: ["# - No information available, 0 - Captions unverified: all levels may not be present, 1 - Captions unverified: all levels present, 2 - Captions verified: all levels present, 3 -  Captions verified: all levels my not be present"],
        tips: ["O campo contém informações de legenda e padrão para as quais a enumeração e a cronologia são gravado em 512 ENUMERATION AND CHRONOLOGY - SECONDARY BIBLIOGRAPHIC UNIT: INDEXES "],
        subFieldDef: [
            { code: "a", label: "First level of enumeration", repeatable: false, mandatory: true, tips: ["Contém legenda e padrão associados à enumeração."] },
            { code: "b", label: "Second level of enumeration.", repeatable: false, mandatory: true },
            { code: "c", label: "Third level of enumeration", repeatable: false, mandatory: true },
            { code: "d", label: "Alternative numbering scheme, first level of enumeration", repeatable: false, mandatory: true },
            { code: "e", label: "Alternative numbering scheme, second level of enumeration", repeatable: false, mandatory: true },
            { code: "f", label: "First level of chronology", repeatable: false, mandatory: true, tips: ["Contém legenda e padrão associados à cronologia."] },
            { code: "g", label: "Second level of chronology", repeatable: false, mandatory: false },
            { code: "h", label: "Third level of chronology", repeatable: false, mandatory: false },
            { code: "i", label: "Alternative chronological scheme, first level of chronology", repeatable: false, mandatory: true },
            { code: "j", label: "Name of unit", repeatable: false, mandatory: false, tips: ["Utilizado para registar a extensão das coleções de uma unidade bibliográfica básica ou secundária, como como parte de um kit, material de acompanhamento ou suplementos quando é necessário identificar o unidade que está a ser especificada."] },
            { code: "k", label: "Extent of unit", repeatable: false, mandatory: false, tips: ["Utilizado para registar itens sem designações sequenciais. É utilizado principalmente para não serial unidades."] },
            { code: "l", label: "Specific extent note", repeatable: false, mandatory: false, tips: ["Consiste em informação que esclarece ou amplia a extensão do elemento de dados do acervo."] },
            { code: "6", label: "Interfield linking data", repeatable: false, mandatory: true, tips: ["O subcampo 6 é utilizado para ligar o campo de legenda e padrão (500) à enumeração e cronologia campo (510)."] }
        ]
    },
    {
        tag: "510",
        name: "ENUMERATION AND CHRONOLOGY - BASIC BIBLIOGRAPHIC UNIT",
        ind1Name: "Holdings Statement",
        ind1Tips: ["# - No information available, 0 - Summary Level, 1 - Detailed Level"],
        ind2Name: "Compressed statement",
        ind2Tips: ["# - No information available, 0 - No compression, 1 - Compression, 2 - Uncompressed"],
        tips: ["O campo contém enumeração e cronologia para as quais a legenda e o padrão são registados em 500 CAPTION AND PATTERN - BASIC BIBLIOGRAPHIC UNIT"],
        subFieldDef: [
            { code: "a", label: "First level of enumeration", repeatable: false, mandatory: true, tips: ["Contém uma designação sequencial enumerativa."] },
            { code: "b", label: "Second level of enumeration", repeatable: false, mandatory: true },
            { code: "c", label: "Third level of enumeration", repeatable: false, mandatory: true },
            { code: "d", label: "Alternative numbering scheme, first level of enumeration", repeatable: false, mandatory: true },
            { code: "e", label: "Alternative numbering scheme, second level of enumeration", repeatable: false, mandatory: true },
            { code: "f", label: "First level of chronology", repeatable: false, mandatory: true, tips: ["Contém designação sequencial cronológica.", "Quando apenas uma designação cronológica é presente, a cronologia especifica as participações."] },
            { code: "g", label: "Second level of chronology", repeatable: false, mandatory: true },
            { code: "h", label: "Third level of chronology", repeatable: false, mandatory: true },
            { code: "i", label: "Alternative chronological scheme, first level of chronology", repeatable: false, mandatory: true },
            { code: "w", label: "Gap indicator", repeatable: false, mandatory: true, tips: ["a = Gap break", "b = Non-gap break"] },
            { code: "x", label: "Non-public note", repeatable: false, mandatory: true },
            { code: "z", label: "Public note", repeatable: false, mandatory: true },
            { code: "6", label: "Interfield linking data", repeatable: false, mandatory: true, tips: ["O subcampo 6 é utilizado para ligar o campo de legenda e padrão (500) à enumeração e cronologia campo (510)."] }
        ]
    },
    {
        tag: "511",
        name: "ENUMERATION AND CHRONOLOGY - SECONDARY BIBLIOGRAPHIC UNIT: SUPPLEMENTARY MATERIALS",
        ind1Name: "Holdings Statement",
        ind1Tips: ["# - No information available, 0 - Summary Level, 1 - Detailed Level"],
        ind2Name: "Compressed statement",
        ind2Tips: ["# - No information available, 0 - No compression, 1 - Compression, 2 - Uncompressed"],
        tips: ["O campo contém enumeração e cronologia para as quais a legenda e o padrão são registados em 501 CAPTION AND PATTERN - SECONDARY BIBLIOGRAPHIC UNIT: SUPPLEMENTARY MATERIALS."],
        subFieldDef: [
            { code: "a", label: "First level of enumeration", repeatable: false, mandatory: true, tips: ["Contém uma designação sequencial enumerativa."] },
            { code: "b", label: "Second level of enumeration", repeatable: false, mandatory: true },
            { code: "c", label: "Third level of enumeration", repeatable: false, mandatory: true },
            { code: "d", label: "Alternative numbering scheme, first level of enumeration", repeatable: false, mandatory: true },
            { code: "e", label: "Alternative numbering scheme, second level of enumeration", repeatable: false, mandatory: true },
            { code: "f", label: "First level of chronology", repeatable: false, mandatory: true, tips: ["Contém designação sequencial cronológica.", "Quando apenas uma designação cronológica é presente, a cronologia especifica as participações."] },
            { code: "g", label: "Second level of chronology", repeatable: false, mandatory: true },
            { code: "h", label: "Third level of chronology", repeatable: false, mandatory: true },
            { code: "i", label: "Alternative chronological scheme, first level of chronology", repeatable: false, mandatory: true },
            { code: "w", label: "Gap indicator", repeatable: false, mandatory: true, tips: ["a = Gap break", "b = Non-gap break"] },
            { code: "x", label: "Non-public note", repeatable: false, mandatory: true },
            { code: "z", label: "Public note", repeatable: false, mandatory: true },
            { code: "6", label: "Interfield linking data", repeatable: false, mandatory: true, tips: ["O subcampo 6 é utilizado para ligar o campo de legenda e padrão (500) à enumeração e cronologia campo (510)."] }
        ]
    },
    {
        tag: "512",
        name: "ENUMERATION AND CHRONOLOGY - BASIC BIBLIOGRAPHIC UNIT: INDEXES",
        ind1Name: "Holdings Statement",
        ind1Tips: ["# - No information available, 0 - Summary Level, 1 - Detailed Level"],
        ind2Name: "Compressed statement",
        ind2Tips: ["# - No information available, 0 - No compression, 1 - Compression, 2 - Uncompressed"],
        tips: ["O campo contém enumeração e cronologia para as quais a legenda e o padrão são registados em 502 CAPTION AND PATTERN - SECONDARY BIBLIOGRAPHIC UNIT : INDEXES"],
        subFieldDef: [
            { code: "a", label: "First level of enumeration", repeatable: false, mandatory: true, tips: ["Contém uma designação sequencial enumerativa."] },
            { code: "b", label: "Second level of enumeration", repeatable: false, mandatory: true },
            { code: "c", label: "Third level of enumeration", repeatable: false, mandatory: true },
            { code: "d", label: "Alternative numbering scheme, first level of enumeration", repeatable: false, mandatory: true },
            { code: "e", label: "Alternative numbering scheme, second level of enumeration", repeatable: false, mandatory: true },
            { code: "f", label: "First level of chronology", repeatable: false, mandatory: true, tips: ["Contém designação sequencial cronológica.", "Quando apenas uma designação cronológica é presente, a cronologia especifica as participações."] },
            { code: "g", label: "Second level of chronology", repeatable: false, mandatory: true },
            { code: "h", label: "Third level of chronology", repeatable: false, mandatory: true },
            { code: "i", label: "Alternative chronological scheme, first level of chronology", repeatable: false, mandatory: true },
            { code: "w", label: "Gap indicator", repeatable: false, mandatory: true, tips: ["a = Gap break", "b = Non-gap break"] },
            { code: "x", label: "Non-public note", repeatable: false, mandatory: true },
            { code: "z", label: "Public note", repeatable: false, mandatory: true },
            { code: "6", label: "Interfield linking data", repeatable: false, mandatory: true, tips: ["O subcampo 6 é utilizado para ligar o campo de legenda e padrão (500) à enumeração e cronologia campo (510)."] }
        ]
    },
    {
        tag: "520",
        name: "TEXTUAL HOLDINGS - BASIC BIBLIOGRAPHIC UNIT",
        ind1Name: "Field encoding level",
        ind1Tips: ["# - No information available, 0 - Summary Level, 1 - Detailed Level"],
        ind2Name: "Type of notation",
        ind2Tips: ["# - No information available, 0 - Non-standard, 1 - ISO 10324, 2 - ANSI Z39.42"],
        tips: ["O campo é utilizado para registar a descrição textual a) para itens de partes únicas e b) em vez de ou em adição para a legenda, padrão, enumeração e informação cronológica para os itens multipartes e seriais."],
        subFieldDef: [
            { code: "a", label: "Textual holdings", repeatable: false, mandatory: true },
            { code: "x", label: "Non-public note", repeatable: false, mandatory: true },
            { code: "z", label: "Public note", repeatable: false, mandatory: true },
            { code: "6", label: "Interfield linking data", repeatable: false, mandatory: true, tips: ["O subcampo 6 é utilizado para ligar o campo de legenda e padrão (500) e enumeração e campo da cronologia (510) para o campo das coleções textuais (520)."] }
        ]
    },
    {
        tag: "521",
        name: "TEXTUAL HOLDINGS - SECONDARY BIBLIOGRAPHIC UNIT: SUPPLEMENTARY MATERIALS",
        ind1Name: "Field encoding level",
        ind1Tips: ["# - No information available, 0 - Summary Level, 1 - Detailed Level"],
        ind2Name: "Type of notation",
        ind2Tips: ["# - No information available, 0 - Non-standard, 1 - ISO 10324, 2 - ANSI Z39.42"],
        tips: ["O campo contém descrição textual para itens de partes individuais e, em vez ou para além da legenda e informação de padrão, enumeração e cronologia para itens multipartes e seriais."],
        subFieldDef: [
            { code: "a", label: "Textual holdings", repeatable: false, mandatory: true },
            { code: "x", label: "Non-public note", repeatable: false, mandatory: true },
            { code: "z", label: "Public note", repeatable: false, mandatory: true },
            { code: "6", label: "Interfield linking data", repeatable: false, mandatory: true, tips: ["O subcampo 6 é utilizado para ligar o campo de legenda e padrão (500) e enumeração e campo da cronologia (510) para o campo das coleções textuais (520)."] }
        ]
    },
    {
        tag: "522",
        name: "TEXTUAL HOLDINGS - SECONDARY BIBLIOGRAPHIC UNIT: INDEXES",
        ind1Name: "Field encoding level",
        ind1Tips: ["# - No information available, 0 - Summary Level, 1 - Detailed Level"],
        ind2Name: "Type of notation",
        ind2Tips: ["# - No information available, 0 - Non-standard, 1 - ISO 10324, 2 - ANSI Z39.42"],
        tips: ["O campo contém descrição textual para itens de partes individuais e, em vez ou para além da legenda e informação de padrão, enumeração e cronologia para itens multipartes e seriais."],
        subFieldDef: [
            { code: "a", label: "Textual holdings", repeatable: false, mandatory: true },
            { code: "x", label: "Non-public note", repeatable: false, mandatory: true },
            { code: "z", label: "Public note", repeatable: false, mandatory: true },
            { code: "6", label: "Interfield linking data", repeatable: false, mandatory: true, tips: ["O subcampo 6 é utilizado para ligar o campo de legenda e padrão (500) e enumeração e campo da cronologia (510) para o campo das coleções textuais (520)."] }
        ]
    },
    {
        tag: "530",
        name: "ITEM INFORMATION - BASIC BIBLIOGRAPHIC UNIT",
        ind1Tips: ["Em branco (não definido)"],
        ind2Tips: ["Em branco (não definido)"],
        tips: ["O campo contém informação ao nível do item sobre as peças do item especificado no registo de coleções.", "Os elementos de dados especificados podem ser utilizados em aplicações de aquisição ou circulação."],
        subFieldDef: [
            { code: "a", label: "Internal item number", repeatable: false, mandatory: false },
            { code: "b", label: "Invalid or cancelled internal item number", repeatable: false, mandatory: false },
            { code: "c", label: "Cost", repeatable: true, mandatory: false },
            { code: "d", label: "Date acquired", repeatable: true, mandatory: false },
            { code: "e", label: "Source of acquisition", repeatable: true, mandatory: false },
            { code: "h", label: "Use restrictions", repeatable: true, mandatory: false },
            { code: "j", label: "Item status", repeatable: true, mandatory: false },
            { code: "l", label: "Temporary location", repeatable: true, mandatory: false },
            { code: "p", label: "Item identification", repeatable: true, mandatory: false },
            { code: "r", label: "Invalid or cancelled item identification", repeatable: true, mandatory: false },
            { code: "t", label: "Copy number", repeatable: true, mandatory: false },
            { code: "z", label: "Public note", repeatable: true, mandatory: false }
        ]
    },
    {
        tag: "531",
        name: "ITEM INFORMATION - SECONDARY BIBLIOGRAPHIC UNIT: SUPPLEMENTARY MATERIALS",
        ind1Tips: ["Em branco (não definido)"],
        ind2Tips: ["Em branco (não definido)"],
        tips: ["O campo contém informações ao nível do item sobre as peças do item especificadas no registo de coleções.", "Os elementos de dados especificados podem ser utilizados em aplicações de aquisição ou circulação."],
        subFieldDef: [
            { code: "a", label: "Internal item number", repeatable: false, mandatory: false },
            { code: "b", label: "Invalid or cancelled internal item number", repeatable: false, mandatory: false },
            { code: "c", label: "Cost", repeatable: true, mandatory: false },
            { code: "d", label: "Date acquired", repeatable: true, mandatory: false },
            { code: "e", label: "Source of acquisition", repeatable: true, mandatory: false },
            { code: "h", label: "Use restrictions", repeatable: true, mandatory: false },
            { code: "j", label: "Item status", repeatable: true, mandatory: false },
            { code: "l", label: "Temporary location", repeatable: true, mandatory: false },
            { code: "p", label: "Item identification", repeatable: true, mandatory: false },
            { code: "r", label: "Invalid or cancelled item identification", repeatable: true, mandatory: false },
            { code: "t", label: "Copy number", repeatable: true, mandatory: false },
            { code: "z", label: "Public note", repeatable: true, mandatory: false }
        ]
    },
    {
        tag: "532",
        name: "ITEM INFORMATION - SECONDARY BIBLIOGRAPHIC UNIT: INDEXES",
        ind1Tips: ["Em branco (não definido)"],
        ind2Tips: ["Em branco (não definido)"],
        tips: ["O campo contém informação ao nível do item sobre as peças do item especificado no registo de coleções.", "Os elementos de dados especificados podem ser utilizados em aplicações de aquisição ou circulação."],
        subFieldDef: [
            { code: "a", label: "Internal item number", repeatable: false, mandatory: false },
            { code: "b", label: "Invalid or cancelled internal item number", repeatable: false, mandatory: false },
            { code: "c", label: "Cost", repeatable: true, mandatory: false },
            { code: "d", label: "Date acquired", repeatable: true, mandatory: false },
            { code: "e", label: "Source of acquisition", repeatable: true, mandatory: false },
            { code: "h", label: "Use restrictions", repeatable: true, mandatory: false },
            { code: "j", label: "Item status", repeatable: true, mandatory: false },
            { code: "l", label: "Temporary location", repeatable: true, mandatory: false },
            { code: "p", label: "Item identification", repeatable: true, mandatory: false },
            { code: "r", label: "Invalid or cancelled item identification", repeatable: true, mandatory: false },
            { code: "t", label: "Copy number", repeatable: true, mandatory: false },
            { code: "z", label: "Public note", repeatable: true, mandatory: false }
        ]
    },
    {
        tag: "702",
        name: "PERSONAL NAME - SECONDARY RESPONSABILITY (RELATED TO COPY)",
        ind1Tips: ["# - Em branco (não definido)"],
        ind2Name: "Form of name indicator",
        ind2Tips: ["0 - Name entered under forename or direct order, 1 - Name entered under surname (family name, patronymic, etc.)"],
        tips: [
            "Este campo pode ser utilizado tanto no registo bibliográfico do UNIMARC como no registo de acervos do UNIMARC, de acordo com o recurso à agência bibliográfica.",
            "A utilização deste campo no formato de coleções UNIMARC é de acordo com a utilização do mesmo campo em Formato bibliográfico UNIMARC.",
            "Este campo contém o nome de uma pessoa considerada como tendo responsabilidade secundária pelo trabalho, no acesso forma de ponto."
        ],
        subFieldDef: [
            { code: "a", label: "Entry Element", repeatable: false, mandatory: true, tips: ["Elemento principal do nome pessoal com responsabilidade secundária"] },
            { code: "b", label: "Part of Name Other than Entry Element", repeatable: false, mandatory: false, tips: ["Parte do nome que não é o elemento de entrada"] },
            { code: "c", label: "Additions to Names Other than Dates", repeatable: false, mandatory: false, tips: ["Informações adicionais ao nome que não sejam datas"] },
            { code: "d", label: "Roman Numerals", repeatable: false, mandatory: false, tips: ["Numerais romanos associados ao nome"] },
            { code: "f", label: "Dates", repeatable: false, mandatory: false, tips: ["Datas relevantes associadas ao nome (nascimento, morte, etc.)"] },
            { code: "g", label: "Expansion of Initials of Forename", repeatable: false, mandatory: false, tips: ["Expansão de iniciais do prenome quando aplicável"] },
            { code: "k", label: "Attribution Qualifier", repeatable: true, mandatory: false, tips: ["Qualificadores de atribuição do nome"] },
            { code: "o", label: "International Standard Identifier for the Name", repeatable: true, mandatory: false, tips: ["Identificador padrão internacional para o nome (ex: ISNI)"] },
            { code: "p", label: "Affiliation/Address", repeatable: false, mandatory: false, tips: ["Afiliação institucional ou endereço associado"] },
            { code: "r", label: "Part or Role Played", repeatable: true, mandatory: false, tips: ["Parte ou papel desempenhado na obra"] },
            { code: "2", label: "Source", repeatable: false, mandatory: false, tips: ["Fonte de autoridade utilizada para o nome"] },
            { code: "3", label: "Authority Record Identifier or Standard Number", repeatable: false, mandatory: false, tips: ["Identificador do registro de autoridade correspondente"] },
            { code: "4", label: "Relator Code", repeatable: true, mandatory: false, tips: ["Código que especifica a natureza da responsabilidade"] },
            { code: "5", label: "Institution to which the Field Applies", repeatable: false, mandatory: false, tips: ["Instituição à qual o campo se aplica"] },
            { code: "6", label: "Interfield Linking Data", repeatable: true, mandatory: false, tips: ["Dados de ligação entre campos"] },
            { code: "8", label: "Materials Specified", repeatable: true, mandatory: false, tips: ["Identificação de materiais específicos a que se aplica"] }
        ]
    },
    {
        tag: "712",
        name: "CORPORATE BODY NAME - SECONDARY RESPONSABILITY (RELATED TO COPY)",
        ind1Name: "Specifies the Kind of Name of a Body",
        ind1Tips: ["0 - Corporate name, 1 - Meeting name"],
        ind2Name: "Form of name indicator",
        ind2Tips: ["0 - Name in inverted form, 1 - Name entered under place or jurisdiction, 2 - Name entered under name in direct order"],
        tips: [
            "Este campo pode ser utilizado tanto no registo bibliográfico do UNIMARC como no registo de acervos do UNIMARC, de acordo com o recurso à agência bibliográfica.",
            "A utilização deste campo no formato de coleções UNIMARC é de acordo com a utilização do mesmo campo em Formato bibliográfico UNIMARC.",
            "Este campo contém o nome de uma entidade jurídica considerada como tendo responsabilidade secundária por uma obra, em formato de ponto de acesso."
        ],
        subFieldDef: [
            { code: "a", label: "Entry Element", repeatable: false, mandatory: true, tips: ["Elemento principal do nome da entidade coletiva com responsabilidade secundária"] },
            { code: "b", label: "Subdivision", repeatable: true, mandatory: false, tips: ["Subdivisão hierárquica da entidade coletiva"] },
            { code: "c", label: "Addition to Name or Qualifier", repeatable: true, mandatory: false, tips: ["Qualificadores ou adições ao nome da entidade"] },
            { code: "d", label: "Number of Meeting and/or Number of Part of Meeting", repeatable: false, mandatory: false, tips: ["Número da reunião ou parte da reunião"] },
            { code: "e", label: "Location of Meeting", repeatable: false, mandatory: false, tips: ["Localização da reunião"] },
            { code: "f", label: "Date of Meeting", repeatable: false, mandatory: false, tips: ["Data da reunião"] },
            { code: "g", label: "Inverted Element", repeatable: false, mandatory: false, tips: ["Elemento invertido do nome"] },
            { code: "h", label: "Part of Name Other than Entry Element and Inverted Element", repeatable: false, mandatory: false, tips: ["Parte do nome que não é o elemento de entrada nem o elemento invertido"] },
            { code: "o", label: "International Standard Identifier for the Name", repeatable: true, mandatory: false, tips: ["Identificador padrão internacional para o nome (ex: ISNI)"] },
            { code: "p", label: "Affiliation/Address", repeatable: false, mandatory: false, tips: ["Afiliação institucional ou endereço associado"] },
            { code: "r", label: "Part or Role Played", repeatable: true, mandatory: false, tips: ["Parte ou papel desempenhado na obra"] },
            { code: "2", label: "Source", repeatable: false, mandatory: false, tips: ["Fonte de autoridade utilizada para o nome"] },
            { code: "3", label: "Authority Record Identifier or Standard Number", repeatable: false, mandatory: false, tips: ["Identificador do registro de autoridade correspondente"] },
            { code: "4", label: "Relator Code", repeatable: true, mandatory: false, tips: ["Código que especifica a natureza da responsabilidade secundária"] },
            { code: "5", label: "Institution to which the Field Applies", repeatable: false, mandatory: false, tips: ["Instituição à qual o campo se aplica"] },
            { code: "8", label: "Materials Specified", repeatable: true, mandatory: false, tips: ["Identificação de materiais específicos a que se aplica"] }
        ]
    },
    {
        tag: "722",
        name: "FAMILY NAME - SECONDARY RESPONSABILITY (RELATED TO COPY)",
        ind1Tips: ["# - Em branco (não definido)"],
        ind2Tips: ["# - Em branco (não definido)"],
        tips: [
            "Este campo pode ser utilizado tanto no registo bibliográfico do UNIMARC como no registo de acervos do UNIMARC, de acordo com o recurso à agência bibliográfica.",
            "A utilização deste campo no formato de coleções UNIMARC é de acordo com a utilização do mesmo campo em Formato bibliográfico UNIMARC.",
            "Este campo contém o nome de uma família considerada como tendo responsabilidade secundária sobre uma obra, no acesso forma de ponto."
        ],
        subFieldDef: [
            { code: "a", label: "Entry Element", repeatable: false, mandatory: true, tips: ["Nome da família em forma de ponto de acesso com responsabilidade secundária"] },
            { code: "c", label: "Type of Family", repeatable: false, mandatory: true, tips: ["Categoria ou tipo da família (ex: clã, dinastia)"] },
            { code: "d", label: "Places Associated with the Family", repeatable: true, mandatory: false, tips: ["Locais associados à família"] },
            { code: "f", label: "Dates", repeatable: false, mandatory: false, tips: ["Datas relevantes associadas à família"] },
            { code: "o", label: "International Standard Identifier for the Name", repeatable: true, mandatory: false, tips: ["Identificador padrão internacional para o nome"] },
            { code: "r", label: "Part or Role Played", repeatable: true, mandatory: false, tips: ["Parte ou papel desempenhado pela família"] },
            { code: "2", label: "Source", repeatable: false, mandatory: false, tips: ["Fonte de autoridade utilizada"] },
            { code: "3", label: "Authority Record Identifier or Standard Number", repeatable: false, mandatory: false, tips: ["Identificador do registro de autoridade"] },
            { code: "4", label: "Relator Code", repeatable: true, mandatory: false, tips: ["Código de relator para responsabilidade secundária"] },
            { code: "5", label: "Institution to which the Field Applies", repeatable: false, mandatory: false, tips: ["Instituição à qual o campo se aplica"] },
            { code: "8", label: "Materials Specified", repeatable: true, mandatory: false, tips: ["Materiais específicos a que se aplica"] }
        ]
    },
    {
        tag: "801",
        name: "ORIGINATING SOURCE",
        ind1Tips: ["Em branco (não definido)"],
        ind2Name: "Function indicator",
        ind2Tips: ["0 - Original cataloguing agency, 1 - Transcribing agency, 2 - Modifying agency, 3 - Issuing agency"],
        tips: ["Este campo contém uma indicação da origem do registo, incluindo um dos seguintes: a agência que criou os dados, a agência que transcreveu os dados para um formato legível por máquina, qualquer agência que modificou o registo/dados originais e a agência que emitiu o registo atual."],
        subFieldDef: [
            { code: "a", label: "Country", repeatable: false, mandatory: false, tips: ["O país da agência emissora em formato codificado de dois caracteres."] },
            { code: "b", label: "Agency", repeatable: false, mandatory: false, tips: ["Como não existem códigos aceites internacionalmente, os códigos da Lista de Códigos USMARC para as organizações são recomendadas."] },
            { code: "c", label: "Date of transaction", repeatable: false, mandatory: false, tips: ["Este subcampo é utilizado quando possível para indicar quando foi feita uma modificação ou um registo foi emitido."] }
        ]
    },
    {
        tag: "830",
        name: "GENERAL CATALOGUER'S NOTE",
        ind1Tips: ["Em branco (não definido)"],
        ind2Tips: ["Em branco (não definido)"],
        tips: ["Este campo é utilizado para registar informações biográficas, históricas ou outras sobre o registo"],
        subFieldDef: [
            { code: "a", label: "Text of note", repeatable: false, mandatory: false }
        ]
    },
]
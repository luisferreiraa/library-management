import { PrismaClient } from "@prisma/client"
import bcrypt from "bcryptjs"

const prisma = new PrismaClient()

async function main() {

    // Criar hash de senha
    const hashedPassword = await bcrypt.hash("123456789", 10)

    // Criar os Roles
    const adminRole = await prisma.role.create({
        data: {
            name: "ADMIN",
            slug: "admin",
        },
    })

    const userRole = await prisma.role.create({
        data: {
            name: "USER",
            slug: "user",
        },
    })

    // Criar um utilizador ADMIn
    const adminUser = await prisma.user.create({
        data: {
            username: "luiscarneiroferreira",
            email: "luiscarneiroferreira@gmail.com",
            password: hashedPassword,
            firstName: "Luís",
            lastName: "Ferreira",
            address: "Rua Dom Henrique de Cernache, 490",
            phoneNumber: "911099269",
            idNumber: "130080640ZY7",
            nifNumber: 226460207,
            roleId: adminRole.id,
        }
    })

    // Criar ControlFields
    const controlFieldDefinitions = await prisma.controlFieldDefinition.createMany({
        data: [
            {
                tag: "001",
                name: "Record Identifier",
                tips: [
                    "Este campo contém caracteres associados exclusivamente ao registo, ou seja, o identificador do registo da agência que o preparou.",
                    "Em conformidade com a norma ISO 2709, este campo não contém subcampos.",
                    "Em conformidade com a norma ISO 2709, este campo não contém indicadores.",
                    "Quando consiste ou incorpora qualquer forma de um ISN, a informação deve ser inserida no campo especificado para estes dados, além de as registar como identificador de registo neste campo."
                ]
            },
            {
                tag: "003",
                name: "Persistent Record Identifier",
                tips: [
                    "Este campo contém contém o identificador persistente do registo atribuído pela agência que cria, utiliza ou emite o registo.",
                    "É o identificador persistente para o registo bibliográfico, e não o recurso em si.",
                    "Em conformidade com a norma ISO 2709, este campo não contém subcampos.",
                    "Em conformidade com a norma ISO 2709, este campo não contém indicadores.",
                    "São endereços de internet específicos que permitem referenciar um recurso eletrónico com o auxílio de um link de hipertexto, garantindo que esse link não se altera.",
                    "Existem vários sistemas que permitem a criação de identificadores persistentes."
                ]
            },
            {
                tag: "005",
                name: "Version Identifier",
                tips: [
                    "O campo contém a data e a hora da útlima transação de registo.",
                    "Permite que os sistemas de máquina determinem se a versão do registo que está a ser processado é posterior, anterior ou igual a uma processada anteriormente.",
                    "Em conformidade com a norma ISO 2709, este campo não contém subcampos.",
                    "Em conformidade com a norma ISO 2709, este campo não contém indicadores.",
                    "Introduzir no formato standard (ISO 8601-1): AAAAMMDD. O tempo é introduzido no formato HHMMSS. Em todos os casos, é adicionado um 0 inicial, se necessário."
                ]
            },


        ]
    })

    const dataFieldDefinitionsData = [
        {
            tag: "010",
            name: "International Standard Book Number (ISBN)",
            ind1Tips: ["#: Em branco (não definido)"],
            ind2Tips: ["#: Em branco (não definido)"],
            tips: [
                "Este campo contém um ISBN e uma qualificação que o distingue quando mais do que um está contido num registo.",
                "Área de Identificação de Recursos e Termos de Disponibilidade. O campo pode conter os termos de disponibilidade e ou preço, mesmo que não contenha ISBN."
            ],
            subFieldDef: [
                { code: "a", label: "Number (ISBN)", repeatable: false, mandatory: true, tips: ["Um ISBN definido corretamente, incluindo hífens.", "O ISBN é definido pela entidade designada em cada país."] },
                { code: "b", label: "Qualification", repeatable: true, mandatory: false, tips: ["Uma indicação do âmbito do ISBN no subcampo $a (se presente), geralmente o nome de um editor, uma indicação da encadernação do recurso, ou uma indicação da relação de um ISBN com um conjunto ou com um volume em particular."] },
                { code: "d", label: "Terms of Availability and/ or Price", repeatable: false, mandatory: false, tips: ["O preço do recurso e qualquer comentário sobre a sua disponibilidade."] },
                { code: "z", label: "Erroneous ISBN", repeatable: true, mandatory: false, tips: ["Um ISBN que foi identificado como tendo sido incorretamente aplicado ao recurso ou que não é válido.", "Pode ter sido atribuído a duas publicações diferentes e, neste caso, cancelado ou pode ter sido incorretamente impresso."] },
                { code: "6", label: "Interfield Linking Data", repeatable: true, mandatory: false, tips: ["Este subcampo contém informações que permitem que o campo seja ligado, para efeitos de processamento, a outros campos no registo."] }
            ]
        },
        {
            tag: "011",
            name: "International Standard Serial Number (ISSN)",
            ind1Name: "Level of Interest Indicator",
            ind1Tips: ["#: Não especificado/ Não aplicável, 0: Continuing resource of international or national interest, 1: Continuing resource of local interest"],
            ind2Name: "Cluster Identifier Indicator",
            ind2Tips: ["#: Não especificado/ Não aplicável, 0: ISSN-L, 1: ISSN-H"],
            tips: [
                "Este campo contém um ISBN e uma qualificação que o distingue quando mais do que um está contido num registo.",
                "Área de Identificação de Recursos e Termos de Disponibilidade. O campo pode conter os termos de disponibilidade e ou preço, mesmo que não contenha ISBN."
            ],
            subFieldDef: [
                { code: "a", label: "Number (ISSN)", repeatable: false, mandatory: true, tips: ["Um ISBN definido corretamente, incluindo hífens entre o quarto e quinto dígitos."] },
                { code: "b", label: "Qualification", repeatable: false, mandatory: false, tips: ["Utilizado para distinguir entre ISSN se um registo contiver mais do que um.", "Não utilizado pelo ISSN International Center."] },
                { code: "d", label: "Terms of Availability and/ or Price", repeatable: true, mandatory: false, tips: ["O preço do recurso e qualquer comentário sobre a sua disponibilidade."] },
                { code: "f", label: "Cluster ISSN Identifier", repeatable: false, mandatory: false, tips: ["Um ISSN designado pela rede ISSN para ligar recursos com relações específicas entre si como as versões média (ISSN-L) e os títulos anteriores (ISSN-H).", "O prefixo adequado para o tipo de ISSN indicado pelo segundo valor do indicador pode ser gerado para display."] },
                { code: "g", label: "Cancelled Cluster ISSN", repeatable: true, mandatory: false, tips: ["Um ISSN de agrupamento que foi associado ao recurso, mas que foi posteriormente anulado, frequentemente porque foi atribuído um ISSN de agrupamento duplicado.", "Cada ISSN de agrupamento anulado está contido num ficheiro separado $g."] },
                { code: "y", label: "Cancelled ISSN", repeatable: true, mandatory: false, tips: ["Inclui qualquer ISSN que tenha sido válido anteriormente, mas que tenha sido anulado por um centro ISSN."] },
                { code: "z", label: "Erroneous ISSN or Cluster ISSN", repeatable: true, mandatory: false, tips: ["Inclui qualquer ISSN ou Cluster ISSN incorreto, não registado em $g ou $y.", "Normalmente resultado de um erro de impressão."] },
                { code: "2", label: "Source", repeatable: false, mandatory: false, tips: ["Uma identificação sob a forma codificada para o sistema de onde provém o identificador", "O ISSN Center responsável pela atribuição e manutenção dos ISSN e/ ou Cluster ISSN."] },
                {
                    code: "3", label: "Authority Record Identifier or Standard Number", repeatable: false, mandatory: false,
                    tips: [
                        "O identificador ou o número normalizado do registo de autoridade ou do registo de classificação correspondente, ou o identificador normalizado.",
                        "O identificador pode ter a forma de texto ou de um identificador Uniforme de Recursos (URI).",
                        "Se o identificador for texto, o número de controlo ou identificador é precedido pelo código de organização adequado do Identificador Internacional Normalizado para Bibliotecas e Organizações Relacionadas (ISIL) ou da Lista de Códigos MARC para Organizações.",
                        " Não é utilizado um parêntesis anterior quando o identificador é fornecido como protocolo de recuperação da Web, por exemplo, HTTP URI.",
                        "O subcampo pode conter um URI que identifica um nome ou etiqueta de uma entidade. Quando desreferenciado, o URI aponta para informações que descrevem esse nome. Um URI que identifica diretamente a própria entidade está contido em $R."
                    ]
                },
                { code: "r", label: "Real World Object URI", repeatable: true, mandatory: false, tips: ["Um URI que identifica uma entidade, é por vezes referido como uma Coisa, um Objeto do Mundo Real ou RWO, quer seja real ou conceptual.", "Um URI que identifica um nome ou rótulo para uma entidade está contido em $3."] }


            ]
        },
        {
            tag: "012",
            name: "Fingerprint Identifier",
            ind1Tips: [
                "#: Em branco (não definido)",
            ],
            ind2Tips: [
                "#: Em branco (não definido)",
            ],
            tips: [
                "Este campo contém o Fingerprint Identifier para publicações monográficas mais antigas (antiquários) e um código para a instituição a que o campo se aplica, que distingue entre Fingerprint Identifiers quando mais do que um está contido num registo.",
                "O campo corresponde ao identificador de recurso ISBD e aos termos da área de disponibilidade."
            ],
            subFieldDef: [
                { code: "a", label: "Fingerprint", repeatable: false, mandatory: true, tips: ["Calculated Fingerprint Identifier. O Fingerprint é designado pela agência que cria o registo."] },
                { code: "2", label: "Source", repeatable: false, mandatory: false, tips: ["Uma identificação em forma de código com origem no sistema de onde o fingerprint identifier é originário."] },
                {
                    code: "5", label: "Institution to which the Field Applies", repeatable: false, mandatory: false,
                    tips: [
                        "Nome da instituição a que o campo se aplica na forma codificada, se for considerado necessário pela agência que cria o registo para identificar atributos específicos de um item.",
                        "Se o subcampo for utilizado, os códigos devem ser introduzidos em conformidade com as disposições da norma internacional ISIL, ISO 15511 ou podem conter códigos da lista de códigos MARC - Code List for Organizations.",
                        "Caso contrário, pode ser utilizado o nome completo da agência ou um código nacional.",
                        "Se a instituição possuir mais do que um exemplar, a marca de prateleira do item deve ser acrescentada após dois pontos."
                    ]
                },
            ]
        },
        {
            tag: "013",
            name: "International Standard Music Number (ISMN)",
            ind1Tips: [
                "#: Em branco (não definido)",
            ],
            ind2Tips: [
                "#: Em branco (não definido)",
            ],
            tips: [
                "Este campo contém um Número Internacional Normalizado para a Música e uma qualificação que disting entre ISMN quando mais do que um está contido num registo.",
                "O campo corresponde ao identificador do recurso ISBD e à área das condições de disponibilidade. O campo pode conter as condições de disponibilidade e/ ou preço, mesmo que não contenha um ISMN.",
                "Repetível quando se pretende registar mais do que um ISMN válido. Se pretender estabelecer ligações entre um dígito de 13 e um ISMN de 10 dígitos, podem ser utilizados $6 subcampos em cada campo 013."
            ],
            subFieldDef: [
                { code: "a", label: "Number (ISMN)", repeatable: false, mandatory: true, tips: ["Um ISMN corretamente aplicado, incluindo hífenes.", "Os ISMN são atribuídos pela agência designada de cada país."] },
                { code: "b", label: "Qualification", repeatable: false, mandatory: false, tips: ["Uma indicação do âmbito do ISMN no subcampo $a (se presente), normalmente o nome de um editor, uma indicação da ligação do recurso ou uma indicação da relação de um ISMN com um conjunto ou com um volume específico."] },
                { code: "d", label: "Terms of Availability and/ or Price", repeatable: false, mandatory: false, tips: ["O preço do recurso e qualquer comentário sobre a sua disponibilidade.", "Se existir um campo 010 ISBN e o conteúdo deste subcampo se limitar a repetir o que está em 010$d, o subcampo pode ser omitido."] },
                { code: "z", label: "Erroneous ISMN", repeatable: true, mandatory: false, tips: ["Um ISMN que foi identificado como tendo sido incorretamente aplicado a um recurso ou que é inválido.", "Pode ter sido atribuído a duas publicações diferentes e, neste caso, cancelado, ou pode ter sido incorretamente impresso."] },
                { code: "6", label: "Interfield Linking Data", repeatable: true, mandatory: false, tips: ["Este subcampo contém informações que permitem que o campo seja ligado, para efeitos de processamento, a outros campos no registo"] }
            ]
        },
        {
            tag: "014",
            name: "Article Identifier",
            ind1Tips: [
                "#: Em branco (não definido)",
            ],
            ind2Tips: [
                "#: Em branco (não definido)",
            ],
            tips: [
                "Este campo contém um código único e não ambíguo atribuído aos artigos de periódicos.",
            ],
            subFieldDef: [
                { code: "a", label: "Article Identifier", repeatable: false, mandatory: true },
                { code: "z", label: "Erroneous Article Identifier", repeatable: true, mandatory: false },
                { code: "2", label: "Source", repeatable: false, mandatory: false, tips: ["O subcampo contém uma identificação do sistema no âmbito do qual o identificador foi construído."] },
            ]
        },
        {
            tag: "015",
            name: "International Standard Technical Report Number (ISRN)",
            ind1Tips: [
                "#: Em branco (não definido)",
            ],
            ind2Tips: [
                "#: Em branco (não definido)",
            ],
            tips: [
                "Este campo contém o número internacional normalizado de relatório técnico atribuído por um centro nacional ISRN",
                "Corresponde ao identificador de recurso ISBD e aos termos da área de disponibilidade",
            ],
            subFieldDef: [
                { code: "a", label: "Number (ISRN)", repeatable: false, mandatory: true, tips: ["Um ISRN corretamente aplicado, incluindo hífenes.", "Os ISRN são atribuídos pela agência designada de cada país."] },
                {
                    code: "b",
                    label: "Qualification",
                    repeatable: false,
                    mandatory: false,
                    tips: [
                        "Uma indicação do âmbito do ISRN no subcampo $a (se presente), normalmente o nome de um editor, uma indicação da ligação do recurso ou uma indicação da relação de um ISRN com um conjunto ou com um volume específico.",
                    ]
                },
                {
                    code: "d",
                    label: "Terms of Availability and/ or Price",
                    repeatable: false,
                    mandatory: false,
                    tips: [
                        "O preço do recurso e qualquer comentário sobre a sua disponibilidade.",
                    ]
                },
                {
                    code: "z",
                    label: "Cancelled/ Invalid/ Erroneous ISRN",
                    repeatable: true,
                    mandatory: false,
                    tips: [
                        "Um ISRN que foi identificado como tendo sido incorretamente aplicado a um recurso ou que é inválido.",
                        "Pode ter sido atribuído a duas publicações diferentes e, neste caso, cancelado, ou pode ter sido incorretamente impresso.",
                    ]
                },
            ]
        },
        {
            tag: "017",
            name: "Other Identifier",
            ind1Name: "Type of Identifier",
            ind1Tips: [
                "7: System specified in subfield $2",
                "8: Unspecified type of identifier"
            ],
            ind2Name: "Difference Indicator",
            ind2Tips: [
                "1: No difference",
                "2: Difference"
            ],
            tips: [
                "Este campo contém um identificador, publicado no recurso que não pode ser acomodado noutro campo e uma qualificação que distingue entre identificadores quando mais do que um identificador do mesmo tipo está contido num registo.",
                "O campo corresponde ao identificador de recurso da ISBD e à área das condições de disponibilidade. O campo pode conter as condições de disponibilidade e/ou o preço, mesmo que não contenha um identificador.",
            ],
            subFieldDef: [
                {
                    code: "$a",
                    label: "Identifier",
                    repeatable: false,
                    mandatory: true,
                    tips: [
                        "Um identificador corretamente formatado. Os números ou códigos são formulados de acordo com o tipo",
                    ]
                },
                {
                    code: "$b",
                    label: "Qualification",
                    repeatable: false,
                    mandatory: false,
                    tips: [
                        "Uma indicação do âmbito do identificador nos subcampos $a (se presente), normalmente o nome do editor, uma identificação da ligação do recurso, ou uma indicação da relação de um identificador com um conjunto ou com um volume específico.",
                    ]
                },
                {
                    code: "$d",
                    label: "Terms of Availability and/ or Price",
                    repeatable: false,
                    mandatory: false,
                    tips: [
                        "O preço do recurso e qualquer comentário sobre a sua disponibilidade.",
                    ]
                },
                {
                    code: "$z",
                    label: "Erroneous Identifier",
                    repeatable: true,
                    mandatory: false,
                    tips: [
                        "Um identificador que foi identificado como tendo sido incorretamente aplicado ao recurso ou que é inválido. Pode ter sido atribuído a duas publicações ou produtos diferentes e, neste caso, cancelado, ou pode ter sido incorretamente impresso. Se não for conhecido um identificador válido do mesmo tipo, o subcampo $z pode aparecer sozinho no campo 017",
                    ]
                },
                {
                    code: "$2",
                    label: "Source",
                    repeatable: true,
                    mandatory: false,
                    tips: [
                        "Uma identificação em forma codificada para o sistema do qual o identificador é derivado. Utilizar apenas quando o primeiro código do sítio contiver o valor 7 (sistema especificado no subcampo $2).",
                    ]
                },
            ]
        },
        {
            tag: "020",
            name: "National Bibliography Number",
            ind1Tips: [
                "#: Em branco (não definido)",
            ],
            ind2Tips: [
                "#: Em branco (não definido)",
            ],
            tips: [
                "Uma identificação em forma codificada para o sistema do qual o identificador é derivado. Utilizar apenas quando o primeiro código do sítio contém o valor 7 (sistema especificado no subcampo d $2).",
            ],
            subFieldDef: [
                {
                    code: "$a",
                    label: "Country Code",
                    repeatable: false,
                    mandatory: true,
                    tips: [
                        "Uma identificação do país da bibliografia nacional (EX 1-4). Dois caracteres. Para os códigos de país , utilizar a norma ISO 3166-1.d $2).",
                    ]
                },
                {
                    code: "$b",
                    label: "Number",
                    repeatable: false,
                    mandatory: false,
                    tips: [
                        "O número como designado pela agência.",
                    ]
                },
                {
                    code: "$z",
                    label: "Erroneous Number",
                    repeatable: true,
                    mandatory: false,
                    tips: [
                        "Um identificador que foi identificado como tendo sido incorretamente aplicado ao recurso.",
                    ]
                },
            ]
        },
        {
            tag: "021",
            name: "Legal Deposit Number",
            ind1Tips: [
                "#: Em branco (não definido)",
            ],
            ind2Tips: [
                "#: Em branco (não definido)",
            ],
            tips: [
                "Este campo contém o número atribuído ao recurso que está a ser registado pelo gabinete de depósito legal ou de direitos de autor em cada país.d $2).",
            ],
            subFieldDef: [
                {
                    code: "$a",
                    label: "Country Code",
                    repeatable: false,
                    mandatory: true,
                    tips: [
                        "Uma identificação do país da agência de depósito legal que atribui o número. Para os códigos de país, utilizar ISO 3166-1. Dois caracteres.d $2). ",
                    ]
                },
                {
                    code: "$b",
                    label: "Number",
                    repeatable: false,
                    mandatory: false,
                    tips: [
                        "O número como designado pela agência.",
                    ]
                },
                {
                    code: "$z",
                    label: "Erroneous Number",
                    repeatable: true,
                    mandatory: false,
                    tips: [
                        "Um número erradamente atribuído ao recurso $2).",
                    ]
                },
            ]
        },
        {
            tag: "022",
            name: "Government Publication Number",
            ind1Tips: [
                "#: Em branco (não definido)",
            ],
            ind2Tips: [
                "#: Em branco (não definido)",
            ],
            tips: [
                "Este campo contém o número atribuído a uma das suas próprias publicações ou a um recurso publicado em seu nome por um organismo governamental.d $2).",
            ],
            subFieldDef: [
                {
                    code: "$a",
                    label: "Country Code",
                    repeatable: false,
                    mandatory: true,
                    tips: [
                        "Uma identificação do país em que o recurso é publicado (EX 1-3). Dois caracteres. Para os códigos do país , utilizar a norma ISO 3166-1.",
                    ]
                },
                {
                    code: "$b",
                    label: "Number",
                    repeatable: false,
                    mandatory: false,
                    tips: [
                        "O número como designado pelo organismo governamental.",
                    ]
                },
                {
                    code: "$z",
                    label: "Erroneous Number",
                    repeatable: true,
                    mandatory: false,
                    tips: [
                        "Um número erradamente atribuído a uma publicação governamental.",
                    ]
                },
            ]
        },
        {
            tag: "033",
            name: "Other System Persistent Record Identifier",
            ind1Tips: [
                "#: Em branco (não definido)",
            ],
            ind2Tips: [
                "#: Em branco (não definido)",
            ],
            tips: [
                "Este campo contém o identificador persistente dos registos obtidos de outras fontes. O identificador persistente é atribuído pela agência que cria, utiliza ou emite o registo.",
                "Este é o identificador persistente para o registo bibliográfico, não para o recurso em si."
            ],
            subFieldDef: [
                {
                    code: "$a",
                    label: "Persistent Record Identifier",
                    repeatable: false,
                    mandatory: true,
                },
                {
                    code: "$z",
                    label: "Cancelled or Invalid Persistent Record Identifier",
                    repeatable: true,
                    mandatory: false,
                },
            ]
        },
        {
            tag: "035",
            name: "Other System Identifiers",
            ind1Tips: [
                "#: Em branco (não definido)",
            ],
            ind2Tips: [
                "#: Em branco (não definido)",
            ],
            tips: [
                "Este campo contém o identificador dos registos obtidos a partir de outras fontes",
            ],
            subFieldDef: [
                {
                    code: "$a",
                    label: "System Identifier",
                    tips: [
                        "Um código para a organização entre parênteses, seguido do identificador de sistema para o registo na base de dados dessa organização",
                        "Uma vez que não existem códigos internacionalmente aceites, recomenda-se a utilização dos códigos da Lista de Códigos MARC para Organizações.",
                        "Caso contrário, pode ser utilizado o nome completo da agência ou um código nacional.",
                    ],
                    repeatable: false,
                    mandatory: true,
                },
                {
                    code: "$z",
                    label: "Cancelled or Invalid Identifier",
                    repeatable: true,
                    mandatory: false,
                },
            ]
        },
        {
            tag: "036",
            name: "Music Incipit",
            ind1Tips: [
                "#: Em branco (não definido)",
            ],
            ind2Tips: [
                "#: Em branco (não definido)",
            ],
            tips: [
                "Este campo contém dados que descrevem o incipit musical para música em forma parcialmente codificada.",
                "Este campo é amplamente utilizado para identificar manuscritos de música, mas também pode ser aplicado à música impressa ou a outros recursos musicais (registos sonoros, etc.).",
            ],
            subFieldDef: [
                {
                    code: "$a",
                    label: "Number of Work",
                    tips: [
                        "Um código de dois dígitos indica a obra a que o incipit se refere, se um conjunto de composições (por exemplo, seis sonatas) for inteiramente descrito num único registo, sem a utilização de registos de nível peça-analítico. Se o registo descrever apenas uma obra, utilizar '01'.",
                    ],
                    repeatable: false,
                    mandatory: true,
                },
                {
                    code: "$b",
                    label: "Number of Movement",
                    tips: [
                        "Um código de dois dígitos indica o andamento dentro de uma obra a que o incipit se refere. Se a obra tiver apenas um andamento, utilizar '01'.",
                    ],
                    repeatable: false,
                    mandatory: true,
                },
                {
                    code: "$c",
                    label: "Number of Incipit",
                    tips: [
                        "Um código de dois dígitos distingue os diferentes incipits referentes ao mesmo movimento. Se existir apenas um incipit para um movimento, utilizar '01'.",
                    ],
                    repeatable: false,
                    mandatory: true,
                },
                {
                    code: "$d",
                    label: "Voice/ Instrument",
                    tips: [
                        "A voz ou o instrumento codificado em 036 $p. Obrigatório se 036 $p estiver presente.",
                    ],
                    repeatable: false,
                    mandatory: false,
                },
                {
                    code: "$e",
                    label: "Role",
                    tips: [
                        "O nome do carácter que canta o incipit codificado em 036 $p.",
                    ],
                    repeatable: false,
                    mandatory: false,
                },
                {
                    code: "$f",
                    label: "Movement Caption/ Heading",
                    tips: [
                        "Legenda ou título do movimento, tal como aparece na fonte.",
                    ],
                    repeatable: true,
                    mandatory: false,
                },
                {
                    code: "$g",
                    label: "Key or Mode",
                    tips: [
                        "A tonalidade ou modo do movimento, se aplicável. Utilizar letras maiúsculas A-G para indicar as tonalidades maiores, minúsculas a-g para indicar as tonalidades menores, “x” para sustenidos e “b” para bemóis, números 1-12 para os modos gregorianos.",
                    ],
                    repeatable: false,
                    mandatory: false,
                },
                {
                    code: "$m",
                    label: "Clef",
                    tips: [
                        "Código de três caracteres. Use “F” ou “C” ou ‘G’ maiúsculo para indicar a forma da clave, depois “-” como separador, depois números 1-5 para indicar a posição da clave na pauta, começando na linha de baixo. Usar “+” como separador para indicar a notação mensural.",
                        "Obrigatório se 036 $p estiver presente, caso contrário não é válido.",
                    ],
                    repeatable: false,
                    mandatory: false,
                },
                {
                    code: "$n",
                    label: "Key Signature",
                    tips: [
                        "Utilize “x” para indicar sustenidos e “b” para indicar bemóis, seguidos de F,C,G,D,A,E,B maiúsculos ou B,E,A,D,G,C,F respetivamente para indicar notas sustenidas ou bemóis.",
                    ],
                    repeatable: false,
                    mandatory: false,
                },
                {
                    code: "$o",
                    label: "Time Signature",
                    tips: [
                        "O valor do tempo ou o sinal de mensuração indicado na pauta é transcrito com um símbolo (c, c/, c., o, etc.) e/ou um número (3, 2, c3, etc.) ou uma fração (4/4, 12/8, etc.).",
                    ],
                    repeatable: false,
                    mandatory: false,
                },
                {
                    code: "$p",
                    label: "Musical Notation",
                    tips: [
                        "Use os símbolos de notação do código Plaine & Easie ou do código DARMS para transcrever as primeiras notas da pauta selecionada.",
                    ],
                    repeatable: false,
                    mandatory: false,
                },
                {
                    code: "$q",
                    label: "Comments (free text)",
                    tips: [
                        "Nota de texto livre.",
                    ],
                    repeatable: true,
                    mandatory: false,
                },
                {
                    code: "$r",
                    label: "Codified Note",
                    tips: [
                        "Um código de um carácter indica uma nota de comentário. Utilizar “?” para indicar um erro no incipit, não corrigido, “+” para indicar um erro no incipit, corrigido, “t” para indicar que o incipit foi transcrito (por exemplo, da notação mensural).",
                    ],
                    repeatable: true,
                    mandatory: false,
                },
                {
                    code: "$t",
                    label: "Text Incipit",
                    tips: [
                        "O texto literário (se existir) tal como aparece na fonte. Se a fonte tiver vários textos, cada um deles é transcrito numa ocorrência separada de 036$t",
                    ],
                    repeatable: true,
                    mandatory: false,
                },
                {
                    code: "$u",
                    label: "Uniform Resource Identifier (URI)",
                    tips: [
                        "Um Identificador Uniforme de Recursos (URI), tal como um URL (Uniform Resource Locator) ou URN (Uniform Resource Name), serve como uma cadeia normalizada que identifica um recurso e fornece acesso eletrónico através de protocolos da Internet. ",
                        "Isto permite a recuperação automática ou a interação com o recurso de uma forma consistente.",
                    ],
                    repeatable: false,
                    mandatory: false,
                },
                {
                    code: "$z",
                    label: "Language of Text",
                    tips: [
                        "Identificação codificada da língua do incipit. Utilizar se o texto for diferente ou puder ser mal interpretado a partir de 101 Língua do recurso.",
                        "Quando o subcampo é repetido, a ordem dos códigos linguísticos deve refletir a extensão e importância das línguas na obra.",
                        "Se tal não for possível, introduzir os códigos da língua por ordem alfabética. O código “mul” pode ser introduzido quando se aplica um grande número de línguas no subcampo.",
                    ],
                    repeatable: true,
                    mandatory: false,
                },
                {
                    code: "$2",
                    label: "Source",
                    tips: [
                        "Um código que especifica o sistema utilizado para codificar a notação musical.",
                        "Um código de dois caracteres indica o código utilizado para transcrever em $p. Obrigatório se 036 $p estiver presente.",
                    ],
                    repeatable: false,
                    mandatory: false,
                },
            ]
        },
        {
            tag: "040",
            name: "CODEN",
            ind1Tips: [
                "#: Em branco (não definido)",
            ],
            ind2Tips: [
                "#: Em branco (não definido)",
            ],
            tips: [
                "Este campo contém um código único e inequívoco anteriormente atribuído aos títulos dos recursos contínuos pelo serviço internacional CODEN.",
            ],
            subFieldDef: [
                {
                    code: "$a",
                    label: "CODEN",
                    tips: [
                        "O código de seis caracteres em que o último carácter é um dígito alfanumérico.",
                    ],
                    repeatable: false,
                    mandatory: true,
                },
                {
                    code: "$z",
                    label: "Erroneous CODEN",
                    tips: [
                        "Um CODEN que foi identificado como tendo sido incorretamente aplicado ao recurso ou que é inválido.",
                        "Pode ter sido atribuído a duas publicações diferentes e, neste caso, cancelado, ou pode ter sido incorretamente impresso.",
                    ],
                    repeatable: true,
                    mandatory: false,
                },
            ]
        },
        {
            tag: "071",
            name: "Publisher's Number",
            ind1Name: "Type of Publisher's Number",
            ind1Tips: [
                "0: Sound recording: Issue number",
                "1: Sound recording: Matrix number",
                "2: Printed music: Plate number",
                "3: Printed music: Other publisher's number",
                "4: Video recording number",
                "5: Other type of publisher's number",
                "6: Eletronic resource number (ex: CD-ROM)"
            ],
            ind2Name: "Note Indicator",
            ind2Tips: [
                "0: Do not make a note",
                "1: Make a note"
            ],
            tips: [
                "Este campo contém um número de editor não regido por uma norma internacional. Trata-se geralmente de utilizado para gravações de som, publicações de música, gravações de vídeo e recursos electrónicos.",
                "The field corresponds to the ISBD Resource Identifier and Terms of Availability Area. The field may contain the terms of availability and/or price, even if it does not contain a publisher's number.",
            ],
            subFieldDef: [
                {
                    code: "$a",
                    label: "Publisher's Number",
                    tips: [
                        "Este código especifica o tipo de número de editor contido no campo. Pode ser utilizado para gerar o texto introdutório se for necessário apresentar uma nota a partir deste campo.",
                    ],
                    repeatable: false,
                    mandatory: true,
                },
                {
                    code: "$b",
                    label: "Source",
                    tips: [
                        "O editor que atribuiu o número.",
                    ],
                    repeatable: false,
                    mandatory: true,
                },
                {
                    code: "$c",
                    label: "Qualification",
                    tips: [
                        "Utilizado para distinguir entre números se um registo contiver mais do que um número de editor.",
                    ],
                    repeatable: false,
                    mandatory: true,
                },
                {
                    code: "$d",
                    label: "Terms of Availability and/ or Price",
                    tips: [
                        "O preço do recurso e qualquer comentário sobre a sua disponibilidade.",
                    ],
                    repeatable: false,
                    mandatory: true,
                },
                {
                    code: "$z",
                    label: "Erroneous Publisher's Number",
                    tips: [
                        "Um número de editor que foi identificado como tendo sido erroneamente aplicado ao recurso ou de outra forma inválido. ",
                        "Por exemplo, pode ter sido aplicado a duas publicações e, neste caso, cancelado ou pode ter sido incorretamente impresso.",
                    ],
                    repeatable: false,
                    mandatory: false,
                },
            ]
        },
        {
            tag: "072",
            name: "Universal Product Code (UPC)",
            ind1Tips: [
                "#: Em branco (não definido)",
            ],
            ind2Name: "Differenfe Indicator",
            ind2Tips: [
                "0: No information provided",
                "1: No difference",
                "2: Difference"
            ],
            tips: [
                "Este campo contém o Código Universal do Produto.",
                "O campo corresponde ao identificador de recurso ISBD e à área das condições de disponibilidade. O campo pode conter as condições de disponibilidade e/ou o preço, mesmo que não contenha um número.",
            ],
            subFieldDef: [
                {
                    code: "$a",
                    label: "Standard Number",
                    tips: [
                        "Um número ou código normalizado corretamente formatado. O número ou código está formatado de acordo com o tipo.",
                    ],
                    repeatable: false,
                    mandatory: true,
                },
                {
                    code: "$b",
                    label: "Qualification",
                    tips: [
                        "Uma indicação do âmbito do número ou código no subcampo $a, normalmente o nome de um editor, uma indicação da encadernação do recurso, ou uma indicação da relação de um número ou código com um conjunto ou com um volume específico.",
                    ],
                    repeatable: false,
                    mandatory: true,
                },
                {
                    code: "$c",
                    label: "Additional Codes Following Standard Number or Codes",
                    tips: [
                        "Contém qualquer sufixo codificado para o identificador.",
                    ],
                    repeatable: false,
                    mandatory: true,
                },
                {
                    code: "$d",
                    label: "Terms of Availability and/ or Price",
                    tips: [
                        "O preço do recurso e qualquer comentário sobre a sua disponibilidade.",
                    ],
                    repeatable: false,
                    mandatory: true,
                },
                {
                    code: "$z",
                    label: "Erroneous Number or Code",
                    tips: [
                        "Um número ou código que foi identificado como tendo sido incorretamente aplicado ao recurso ou que é inválido.",
                        "Pode ter sido atribuído a duas publicações ou produtos diferentes e, neste caso, cancelado ou pode ter sido incorretamente impresso.",
                    ],
                    repeatable: true,
                    mandatory: false,
                },
            ]
        },
        {
            tag: "073",
            name: "International Article Number (EAN)",
            ind1Tips: [
                "#: Em branco (não definido)",
            ],
            ind2Name: "Differenfe Indicator",
            ind2Tips: [
                "0: No information provided",
                "1: No difference",
                "2: Difference"
            ],
            tips: [
                "Este campo contém o número internacional do artigo. O campo corresponde ao identificador do recurso da ISBD e à área das condições de disponibilidade.",
                "O campo pode conter as condições de disponibilidade e/ou preço, mesmo que não contenha um número.",
            ],
            subFieldDef: [
                {
                    code: "$a",
                    label: "Standard Number",
                    tips: [
                        "Um número ou código normalizado corretamente formatado.",
                    ],
                    repeatable: false,
                    mandatory: true,
                },
                {
                    code: "$b",
                    label: "Qualification",
                    tips: [
                        "Uma indicação do âmbito do número ou código no subcampo $a, normalmente o nome de um editor, uma indicação da encadernação do recurso, ou uma indicação da relação de um número ou código com um conjunto ou com um volume específico.",
                    ],
                    repeatable: false,
                    mandatory: true,
                },
                {
                    code: "$c",
                    label: "Additional Codes Following Standard Number or Codes",
                    tips: [
                        "Contém qualquer sufixo codificado para o identificador.",
                    ],
                    repeatable: false,
                    mandatory: true,
                },
                {
                    code: "$d",
                    label: "Terms of Availability and/ or Price",
                    tips: [
                        "O preço do recurso e qualquer comentário sobre a sua disponibilidade.",
                    ],
                    repeatable: false,
                    mandatory: true,
                },
                {
                    code: "$z",
                    label: "Erroneous Number or Code",
                    tips: [
                        "Um número ou código que foi identificado como tendo sido incorretamente aplicado ao recurso ou que é inválido.",
                        "Pode ter sido atribuído a duas publicações ou produtos diferentes e, neste caso, cancelado ou pode ter sido incorretamente impresso.",
                    ],
                    repeatable: true,
                    mandatory: false,
                },
            ]
        },
        {
            tag: "100",
            name: "International Article Number (EAN)",
            ind1Tips: [
                "#: Em branco (não definido)",
            ],
            ind2Tips: [
                "#: Em branco (não definido)",
            ],
            tips: [
                "Este campo contém dados codificados de comprimento fixo aplicáveis aos registos de materiais em qualquer suporte.",
            ],
            subFieldDef: [
                {
                    code: "$a",
                    label: "General Processing Data",
                    tips: [
                        "Os códigos indicam os aspectos do tratamento geral.",
                        "O subcampo tem um comprimento de 36 caracteres.",
                        "Date Entered on File (Mandatory): 8 char/ pos: 0-7",
                        "Type of Date: 1 char/ Pos: 8",
                        "Date 1: 4 char/ Pos: 9-12",
                        "Date 2: 4 char/ Pos: 13-16",
                        "Target Audience Code: 3 char/ pos: 17-19",
                        "Government Publication Code: 1 char/ pos: 20",
                        "Modified Record Code: 1 char/ pos: 21",
                        "Language of Cataloguing (Mandatory): 3 char/ pos:22-24",
                        "Transliteration Code: 1 char/ pos: 25",
                        "Character Set (Mandatory): 4 char/ pos: 26-29",
                        "Additional Character Set: 4 char/ pos: 30-33",
                        "Script of Title: 2 char/ pos: 34/35"
                    ],
                    repeatable: false,
                    mandatory: true,
                },
            ]
        },
        {
            tag: "101",
            name: "LANGUAGE OF THE RESOURCE",
            ind1Tips: ["Translation indicator"],
            ind2Tips: ["Source of code"],
            tips: [
                "Contém códigos relacionados com a linguagem utilizada no recurso.",
                "Pode conter o idioma original, tradução, legendas, sumários, etc."
            ],
            subFieldDef: [
                { code: "a", label: "Idioma do texto, banda sonora, etc.", repeatable: true, mandatory: true, tips: ["Código ISO da principal língua do conteúdo."] },
                { code: "b", label: "Idioma intermediário", repeatable: true, mandatory: false, tips: ["Idioma de tradução intermediária, se aplicável."] },
                { code: "c", label: "Idioma original", repeatable: true, mandatory: false, tips: ["Idioma da obra original."] },
                { code: "d", label: "Idioma do sumário", repeatable: true, mandatory: false, tips: ["Idioma de resumo ou abstracts."] },
                { code: "e", label: "Idioma da página de conteúdo", repeatable: true, mandatory: false, tips: ["Idioma das listas de conteúdo."] },
                { code: "f", label: "Idioma da fonte preferencial", repeatable: true, mandatory: false, tips: ["Idioma da página de rosto (se diferente)."] },
                { code: "g", label: "Idioma do título principal", repeatable: true, mandatory: false, tips: ["Idioma do título principal se não for o primeiro idioma textual."] },
                { code: "h", label: "Idioma do libreto", repeatable: true, mandatory: false, tips: ["Idioma do libreto ou equivalente."] },
                { code: "i", label: "Idioma do material acompanhante", repeatable: true, mandatory: false, tips: ["Exclui resumos, abstracts ou librettos."] },
                { code: "j", label: "Idioma das legendas", repeatable: true, mandatory: false, tips: ["Idioma das legendas no recurso."] },
                { code: "2", label: "Fonte do código", repeatable: false, mandatory: false, tips: ["Fonte dos códigos de idioma (ex: iso639-2, iso639-3)."] }
            ]
        },
        {
            tag: "102",
            name: "COUNTRY OF PUBLICATION OR PRODUCTION",
            ind1Tips: ["Não definido"],
            ind2Tips: ["Não definido"],
            tips: [
                "Código do país onde o recurso foi publicado ou produzido.",
                "Usa códigos ISO 3166-1 e ISO 3166-2."
            ],
            subFieldDef: [
                { code: "a", label: "País de publicação", repeatable: true, mandatory: true, tips: ["Código ISO 3166-1."] },
                { code: "b", label: "Localidade (não ISO)", repeatable: true, mandatory: false, tips: ["Localidade detalhada, código não ISO."] },
                { code: "c", label: "Localidade (ISO)", repeatable: true, mandatory: false, tips: ["Localidade detalhada, código ISO 3166-2."] },
                { code: "2", label: "Fonte do código não ISO", repeatable: true, mandatory: false, tips: ["Nome da lista usada para o código $b."] }
            ]
        },
        {
            tag: "105",
            name: "TEXTUAL LANGUAGE MATERIAL, MONOGRAPHIC",
            ind1Tips: ["Não definido"],
            ind2Tips: ["Não definido"],
            tips: [
                "Codifica características físicas e de conteúdo de materiais textuais monográficos.",
                "Inclui presença de índice, bibliografia, tipo de ilustração, etc."
            ],
            subFieldDef: [
                {
                    code: "a",
                    label: "Dados codificados da monografia",
                    repeatable: false,
                    mandatory: true,
                    tips: [
                        "Campo fixo de 13 caracteres.",
                        "Inclui: Ilustração (0-3), Conteúdo (4-7), Conferência (8), Festschrift (9), Índice (10), Literatura (11), Biografia (12)"
                    ]
                }
            ]
        },
        {
            tag: "106",
            name: "Coded Data Field: Textual Language Material, Monographic",
            ind1Tips: [
                "#: Em branco (não definido)",
            ],
            ind2Tips: [
                "#: Em branco (não definido)",
            ],
            tips: [
                "Este campo contém dados codificados relativos à forma dos recursos textuais não mediados (ou seja, não é necessário qualquer dispositivo de mediação para utilizar ou percecionar o conteúdo textual do recurso).",
            ],
            subFieldDef: [
                {
                    code: "$a",
                    label: "Form of Resource: Coded Data: Medium Designator",
                    tips: [
                        "d: large print",
                        "e: newspaper format",
                        "f: braille or moon script",
                        "g: micropoint",
                        "h: hand-written",
                        "i: multimedia",
                        "j: mini-print",
                        "r: regular print",
                        "z: other form of material"
                    ],
                    repeatable: false,
                    mandatory: true,
                },
            ]
        },
        {
            tag: "110",
            name: "CONTINUING RESOURCES",
            ind1Tips: ["Não definido"],
            ind2Tips: ["Não definido"],
            tips: [
                "Codifica dados sobre recursos continuados como periódicos, anuários, etc.",
                "Inclui periodicidade, tipo de publicação, status, etc."
            ],
            subFieldDef: [
                { code: "a", label: "Bloco de dados codificados", repeatable: false, mandatory: true, tips: ["Bloco de dados fixos definidos pela norma UNIMARC."] }
            ]
        },
        {
            tag: "115",
            name: "VISUAL PROJECTIONS, VIDEO RECORDINGS AND MOTION PICTURES",
            ind1Tips: ["Não definido"],
            ind2Tips: ["Não definido"],
            tips: [
                "Codifica informações sobre filmes, vídeos e projeções.",
                "Inclui cor, som, formato de reprodução, tipo de imagem, etc."
            ],
            subFieldDef: [
                { code: "a", label: "Bloco de dados codificados", repeatable: false, mandatory: true, tips: ["Bloco de dados fixos definidos pela norma UNIMARC."] },
                { code: "b", label: "Arquivo de dados codificados de imagem em movimento", repeatable: false, mandatory: false, tips: ["Bloco de dados fixos definidos pela norma UNIMARC."] }
            ]
        },
        {
            tag: "116",
            name: "GRAPHICS",
            ind1Tips: ["Não definido"],
            ind2Tips: ["Não definido"],
            tips: [
                "Codifica características de materiais gráficos (imagens fixas).",
                "Inclui técnica, cor, tipo de suporte, etc."
            ],
            subFieldDef: [
                { code: "a", label: "Bloco de dados codificados", repeatable: false, mandatory: true, tips: ["Bloco de dados fixos definidos pela norma UNIMARC."] }
            ]
        },
        {
            tag: "117",
            name: "THREE-DIMENSIONAL ARTEFACTS AND REALIA",
            ind1Tips: ["Não definido"],
            ind2Tips: ["Não definido"],
            tips: [
                "Codifica atributos de objetos reais e artefactos tridimensionais.",
                "Inclui tipo, função, origem, suporte, etc."
            ],
            subFieldDef: [
                { code: "a", label: "Bloco de dados codificados para artefactos tridimensionais e realia", repeatable: false, mandatory: true, tips: ["Bloco de dados fixos definidos pela norma UNIMARC."] },
                { code: "b", label: "Bloco de dados codificados para recursos numistmáticos", repeatable: false, mandatory: true, tips: ["Bloco de dados definidos pela norma UNIMARC."] }
            ]
        },
        {
            tag: "120",
            name: "CARTOGRAPHIC RESOURCES - GENERAL",
            ind1Tips: ["Não definido"],
            ind2Tips: ["Não definido"],
            tips: [
                "Codifica atributos gerais de mapas e recursos cartográficos.",
                "Inclui tipo de mapa, técnica de produção, etc."
            ],
            subFieldDef: [
                { code: "a", label: "Bloco de dados codificados para recursos cartográficos (Geral)", repeatable: false, mandatory: true, tips: ["Bloco de dados fixos definidos pela norma UNIMARC."] },
            ]
        },
        {
            tag: "121",
            name: "CARTOGRAPHIC RESOURCES - PHYSICAL ATTRIBUTES",
            ind1Tips: ["Não definido"],
            ind2Tips: ["Não definido"],
            tips: [
                "Contém dados codificados relativos aos atributos físicos dos recursos cartográficos."
            ],
            subFieldDef: [
                { code: "a", label: "Cartographic Resource Coded Data: Physical Attributes (General)", repeatable: false, mandatory: false, tips: ["Codifica dimensões físicas, técnica de criação, forma de publicação, etc.", "9 caracteres fixos: Physical Dimension, Primary Image, Medium, Technique, Reproduction, Adjustment, Form"] },
                { code: "b", label: "Aerial Photography and Remote Sensing Coded Data: Physical Attributes", repeatable: false, mandatory: false, tips: ["8 caracteres fixos: Altitude, Sensor Attitude, Spectral Bands, Image Quality, Cloud Cover, Ground Resolution"] }
            ]
        },
        {
            tag: "122",
            name: "TIME PERIOD OF RESOURCE CONTENT",
            ind1Name: "Number of Dates Indicator",
            ind1Tips: ["0 - Single dated resource", "1 - Multiple single dates", "2 - Range of dates"],
            ind2Tips: ["Não definido"],
            tips: [
                "Indicação estruturada do período de tempo coberto pelo conteúdo do recurso.",
                "Datas codificadas desde 9999 A.C. até ao presente, com precisão até hora."
            ],
            subFieldDef: [
                { code: "a", label: "Time Period, 9999 B.C. to Present", repeatable: true, mandatory: false, tips: ["Campo de 5 a 11 caracteres com elementos: Era, Ano, Mês, Dia, Hora.", "Exemplo: d1976080214 (2 ago. 1976, 14h).", "Subelementos: Era (c/d), Ano (4d), Mês (2d), Dia (2d), Hora (2d)."] }
            ]
        },
        {
            tag: "123",
            name: "CARTOGRAPHIC RESOURCES - SCALE AND CO-ORDINATES",
            ind1Name: "Type of Scale Code Indicator",
            ind1Tips: ["0 - Scale indeterminable", "1 - Single scale", "2 - Multiple scales"],
            ind2Tips: ["Não definido"],
            tips: [
                "Contém escala e coordenadas cartográficas em forma codificada.",
                "Permite indicar escalas horizontais, verticais, coordenadas geográficas, escalas angulares, equinócios e épocas."
            ],
            subFieldDef: [
                { code: "a", label: "Type of Scale", repeatable: false, mandatory: true, tips: ["Tipo de escala"] },
                { code: "b", label: "Constant Ratio Linear Horizontal Scale", repeatable: true, mandatory: false, tips: ["Escala linear horizontal constante"] },
                { code: "c", label: "Constant Ratio Linear Vertical Scale", repeatable: false, mandatory: false, tips: ["Escala linear vertical constante"] },
                { code: "d", label: "Westernmost Longitude", repeatable: false, mandatory: false, tips: ["Longitude mais ocidental"] },
                { code: "e", label: "Easternmost Longitude", repeatable: false, mandatory: false, tips: ["Longitude mais oriental"] },
                { code: "f", label: "Northernmost Latitude", repeatable: false, mandatory: false, tips: ["Latitude mais a norte"] },
                { code: "g", label: "Southernmost Latitude", repeatable: false, mandatory: false, tips: ["Latitude mais a sul"] },
                { code: "h", label: "Angular Scale", repeatable: true, mandatory: false, tips: ["Escala angular"] },
                { code: "i", label: "Declination - Northern Limit", repeatable: false, mandatory: false, tips: ["Declinação - limite norte"] },
                { code: "j", label: "Declination - Southern Limit", repeatable: false, mandatory: false, tips: ["Declinação - limite sul"] },
                { code: "k", label: "Right Ascension - Eastern Limit", repeatable: false, mandatory: false, tips: ["Ascensão reta - limite este"] },
                { code: "m", label: "Right Ascension - Western Limit", repeatable: false, mandatory: false, tips: ["Ascensão reta - limite oeste"] },
                { code: "n", label: "Equinox", repeatable: false, mandatory: false, tips: ["Equinócio"] },
                { code: "o", label: "Epoch", repeatable: false, mandatory: false, tips: ["Época"] },
                { code: "p", label: "Planet to which the Field Applies", repeatable: false, mandatory: false, tips: ["Planeta ao qual os dados se aplicam"] }
            ]
        },
        {
            tag: "124",
            name: "CARTOGRAPHIC RESOURCES - SPECIFIC MATERIAL DESIGNATION ANALYSIS",
            ind1Tips: ["Não definido"],
            ind2Tips: ["Não definido"],
            tips: ["Este campo contém dados codificados relativos à designação material específica de recursos cartográficos, incluindo imagens fotográficas, não fotográficas e de deteção remota."],
            subFieldDef: [
                { code: "a", label: "Character of Image", repeatable: false, mandatory: false, tips: ["Código de 1 carácter. Ex: a = não fotográfico, b = fotográfico, c = deteção remota"] },
                { code: "b", label: "Form of Cartographic Resource", repeatable: true, mandatory: false, tips: ["Código de 1 carácter. Ex: a = atlas, d = mapa, i = vista, etc."] },
                { code: "c", label: "Presentation Technique (Photo/Non-Photo)", repeatable: true, mandatory: false, tips: ["Código de 2 caracteres. Ex: aa = anaglifo, aj = dasimétrico, etc."] },
                { code: "d", label: "Platform Position (Remote Sensing)", repeatable: true, mandatory: false, tips: ["Código de 1 carácter. Ex: a = terrestre, b = aérea, c = espacial"] },
                { code: "e", label: "Satellite Category (Remote Sensing)", repeatable: true, mandatory: false, tips: ["Ex: a = meteorológico, b = recursos da Terra, c = observação espacial"] },
                { code: "f", label: "Satellite Name (Remote Sensing)", repeatable: true, mandatory: false, tips: ["Código de 2 letras. Ex: ab = ATS Meteorológico, gc = Landsat II"] },
                { code: "g", label: "Recording Technique (Remote Sensing)", repeatable: true, mandatory: false, tips: ["Ex: da = infravermelho, gb = radar SAR, etc."] }
            ]
        },
        {
            tag: "125",
            name: "SOUND RECORDINGS AND MUSIC",
            ind1Tips: ["Não definido"],
            ind2Tips: ["Não definido"],
            tips: ["Descreve o formato da música notada, partes existentes, e tipo de texto literário para performances não musicais."],
            subFieldDef: [
                { code: "a", label: "Format of Notated Music", repeatable: false, mandatory: false, tips: ["2 posições: tipo de partitura e indicação de partes. Ex: m = múltiplos formatos"] },
                { code: "b", label: "Literary Text Indicator (Non-Music)", repeatable: false, mandatory: false, tips: ["Até 2 letras indicando o tipo de texto. Ex: a = poesia, b = drama, g = sons, t = texto sagrado"] },
                { code: "c", label: "Multiple Musical Formats", repeatable: false, mandatory: false, tips: ["Lista de formatos musicais específicos. Ex: a = partitura completa, h = tablatura, p = table book"] }
            ]
        },
        {
            tag: "126",
            name: "SOUND RECORDINGS - PHYSICAL ATTRIBUTES",
            ind1Tips: ["Não definido"],
            ind2Tips: ["Não definido"],
            tips: [
                "Contém dados codificados relativos aos atributos físicos de gravações sonoras.",
                "Inclui forma de lançamento, velocidade, tipo de som, técnica de gravação e material."
            ],
            subFieldDef: [
                { code: "a", label: "Sound Recording Coded Data (General)", repeatable: false, mandatory: false, tips: ["15 posições fixas codificando forma de lançamento, velocidade, tipo de som, largura da fita, técnica de gravação, etc."] },
                { code: "b", label: "Sound Recording Coded Data (Detail)", repeatable: false, mandatory: false, tips: ["3 posições fixas indicando tipo de disco/cilindro, tipo de material, tipo de gravação."] }
            ]
        },
        {
            tag: "127",
            name: "DURATION OF SOUND RECORDINGS AND NOTATED MUSIC",
            ind1Tips: ["Não definido"],
            ind2Tips: ["Não definido"],
            tips: [
                "Contém duração codificada de gravações sonoras ou obras musicais notadas.",
                "Valor em horas, minutos e segundos (6 dígitos por entrada)."
            ],
            subFieldDef: [
                { code: "a", label: "Duration", repeatable: true, mandatory: false, tips: ["Formato HHMMSS (6 dígitos). Ex: 002435 = 2 horas, 43 minutos, 5 segundos."] }
            ]
        },
        {
            tag: "128",
            name: "FORM OF MUSICAL WORK AND KEY OR MODE",
            ind1Tips: ["Não definido"],
            ind2Tips: ["Não definido"],
            tips: [
                "Contém códigos relativos à forma e tonalidade de uma obra musical.",
                "Subcampo $d é obrigatório se houver tonalidade especificada."
            ],
            subFieldDef: [
                { code: "a", label: "Form of Musical Work", repeatable: true, mandatory: false, tips: ["Código da forma musical, ex: fugue, sonata, concerto, etc."] },
                { code: "d", label: "Key or Mode", repeatable: false, mandatory: false, tips: ["Tonalidade ou modo da obra, ex: C major, A minor, etc."] }
            ]
        },
        {
            tag: "130",
            name: "MICROFORMS - PHYSICAL ATTRIBUTES",
            ind1Tips: ["Não definido"],
            ind2Tips: ["Não definido"],
            tips: [
                "Contém dados codificados sobre atributos físicos de microformas.",
                "Inclui suporte, polaridade, redução, cor, emulsão, geração e base do filme."
            ],
            subFieldDef: [
                { code: "a", label: "Microform Coded Data - Physical Attributes", repeatable: false, mandatory: false, tips: ["11 posições codificadas. Ex: tipo de microforma, polaridade, redução, cor, emulsão, base, etc."] }
            ]
        },
        {
            tag: "131",
            name: "CARTOGRAPHIC RESOURCES - GEODETIC, GRID AND VERTICAL MEASUREMENT",
            ind1Tips: ["Não definido"],
            ind2Tips: ["Não definido"],
            tips: [
                "Contém dados codificados relacionados ao sistema de medidas geodésicas, grades e altitudes de recursos cartográficos."
            ],
            subFieldDef: [
                { code: "a", label: "Spheroid", repeatable: true, mandatory: false, tips: ["Código de 2 caracteres indicando o esferoide."] },
                { code: "b", label: "Horizontal Datum", repeatable: true, mandatory: false, tips: ["Código de 3 caracteres para datum horizontal."] },
                { code: "c", label: "Grid and Referencing System", repeatable: true, mandatory: false, tips: ["Código de 2 caracteres do sistema de grades principais."] },
                { code: "d", label: "Overlapping and Referencing System", repeatable: true, mandatory: false, tips: ["Código de 2 caracteres de grade secundária sobreposta."] },
                { code: "e", label: "Secondary Grid and Referencing System", repeatable: true, mandatory: false, tips: ["Código de 2 caracteres para grade de referência secundária."] },
                { code: "f", label: "Vertical Datum", repeatable: true, mandatory: false, tips: ["Código de 2 caracteres para datum vertical."] },
                { code: "g", label: "Unit of Measurement of Heighting", repeatable: true, mandatory: false, tips: ["Código de 2 caracteres para unidade de medida de elevação."] },
                { code: "h", label: "Contour Interval", repeatable: true, mandatory: false, tips: ["Intervalo principal de contorno, até 4 caracteres."] },
                { code: "i", label: "Supplementary Contour Interval", repeatable: true, mandatory: false, tips: ["Intervalo suplementar de contorno, até 4 caracteres."] },
                { code: "j", label: "Unit of Measurement of Bathymetry", repeatable: true, mandatory: false, tips: ["Unidade de medida da batimetria."] },
                { code: "k", label: "Bathymetric Interval", repeatable: true, mandatory: false, tips: ["Intervalo principal da batimetria."] },
                { code: "l", label: "Supplementary Bathymetric Interval", repeatable: true, mandatory: false, tips: ["Intervalo suplementar da batimetria."] }
            ]
        },
        {
            tag: "135",
            name: "ELECTRONIC RESOURCES",
            ind1Tips: ["Não definido"],
            ind2Tips: ["Não definido"],
            tips: [
                "Contém dados codificados relativos a recursos eletrônicos.",
                "Cada posição do subcampo $a descreve um atributo técnico do recurso."
            ],
            subFieldDef: [
                { code: "a", label: "Coded Data for Electronic Resource", repeatable: false, mandatory: false, tips: ["13 posições codificadas. Inclui tipo de recurso, material especial, cor, dimensões, som, profundidade de bits de imagem, número de formatos de ficheiro, qualidade de digitalização, fonte, compressão e qualidade de reformatagem."] }
            ]
        },
        {
            tag: "140",
            name: "ANTIQUARIAN - GENERAL",
            ind1Tips: ["Não definido"],
            ind2Tips: ["Não definido"],
            tips: [
                "Dados codificados relacionados à forma física de publicações monográficas antigas (antiquarian) ou materiais posteriores com descrição similar."
            ],
            subFieldDef: [
                { code: "a", label: "Antiquarian Coded Data - General", repeatable: false, mandatory: false, tips: ["Subcampo com 28 posições codificadas, incluindo tipo de ilustração, forma de conteúdo, suporte, marcas d'água, etc."] }
            ]
        },
        {
            tag: "141",
            name: "ITEM SPECIFIC ATTRIBUTES",
            ind1Tips: ["Não definido"],
            ind2Tips: ["Não definido"],
            tips: [
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
            tag: "146",
            name: "MEDIUM OF PERFORMANCE",
            ind1Name: ["Original or Arrangement Indicator"],
            ind1Tips: ["# - Not specified, 0 - Original, 1 - Arrangement"],
            ind2Name: ["Alternative Medium of Performance Indicator"],
            ind2Tips: ["# - Not applicable, 1 - Alternative medium of performance"],
            tips: [
                "Contém códigos que especificam os instrumentos e vozes utilizadas numa obra musical.",
                "Pode incluir códigos de instrumentos, vozes, grupos instrumentais e técnicas."
            ],
            subFieldDef: [
                { code: "a", label: "Type of Performance Medium", repeatable: false, mandatory: false, tips: ["Código de um caracter que define o género de um trabalho baseado no tipo de meio performativo."] },
                { code: "b", label: "Instrument or Voice Soloist", repeatable: true, mandatory: false, tips: ["Código de 9 caracteres que indica a categoria da voz ou do instrumento."] },
                { code: "c", label: "Instrument or Voice Non-Soloist, Conductor, Other Performer or Device, not Included in an Ensemble Recorded in Subfield $d", repeatable: true, mandatory: true, tips: ["Código de 9 caracteres que indica a categoria do instrumento, da voz, etc."] },
                { code: "d", label: "Vocal or Instrumental Ensemble", repeatable: true, mandatory: true, tips: ["Código de 9 caracteres que indica uma categoria de uma ensemble vocal ou instrumental."] },
                { code: "e", label: "Instrument or Voice Non-soloist, Conductor, Other Performer or Device, not Included in an Ensemble Recorded in Subfield $d", repeatable: true, mandatory: false, tips: ["Código de 9 caracteres que indica a categoria da voz ou do instrumento incluído numa ensemble gravada numa ocorrência imediatamente precedente à ocorrência do subcampo $d."] },
                { code: "f", label: "Specific Instrument Related to the Generic one Recorded in Preceding Subfield $c or $e", repeatable: true, mandatory: false, tips: ["Código de 9 caracteres que indica um instrumento específico gravado genericamente ou colectivamente como uma família."] },
                { code: "h", label: "Number of Parts", repeatable: true, mandatory: false, tips: ["Código de 4 caracteres que indica o número total de partes reais relacionadas com a categoria inserida na posição 3."] },
                { code: "i", label: "Number of Players", repeatable: true, mandatory: false, tips: ["Código de 4 caracteres que indica o número total de players relacionados com a categoria inserida na posição 3."] }
            ]
        },
        {
            tag: "181",
            name: "CONTENT FORM",
            ind1Tips: ["Não definido"],
            ind2Name: ["ISBD Display Indicator"],
            ind2Tips: ["0 Not used to generate displays", "1 Used to generate displays", "# Information not provided (use if only $c is present)"],
            tips: [
                "Contém dados codificados especificando a forma de conteúdo do recurso (primeiro elemento da Área 0 do ISBD).",
                "Utiliza códigos ISBD para a forma de conteúdo e qualificações adicionais."
            ],
            subFieldDef: [
                { code: "a", label: "ISBD Content Form Code", repeatable: false, mandatory: false, tips: ["Código de 2 caracteres: conteúdo e extensão de aplicabilidade."] },
                { code: "b", label: "ISBD Content Qualification Code", repeatable: true, mandatory: false, tips: ["Código de 6 caracteres: especificação de tipo, movimento, dimensionalidade e sensorial."] },
                { code: "c", label: "Other Coding for Content Form", repeatable: true, mandatory: false, tips: ["Código de outra fonte diferente da ISBD, como RDA Content Types."] },
                { code: "2", label: "Source", repeatable: false, mandatory: false, tips: ["Fonte dos códigos usados em $c."] },
                { code: "6", label: "Interfield Linking Data", repeatable: true, mandatory: false, tips: ["Informação para ligação entre campos no processamento."] }
            ]
        },
        {
            tag: "182",
            name: "MEDIA TYPE",
            ind1Tips: ["Não definido"],
            ind2Name: ["ISBD Display Indicator"],
            ind2Tips: ["0 Not used to generate displays", "1 Used to generate displays", "# Information not provided (use if only $c is present)"],
            tips: [
                "Contém dados codificados especificando o tipo de media do recurso (segundo elemento da Área 0 do ISBD).",
                "Usado em conjunto com o campo 181 para gerar ISBD Area 0."
            ],
            subFieldDef: [
                { code: "a", label: "ISBD Media Type Code", repeatable: false, mandatory: false, tips: ["Código de 1 caracter especificando o tipo de media."] },
                { code: "c", label: "Other Coding for Media Type", repeatable: true, mandatory: false, tips: ["Código alternativo como RDA Media Type."] },
                { code: "2", label: "Source", repeatable: false, mandatory: false, tips: ["Fonte dos códigos usados em $c."] },
                { code: "6", label: "Interfield Linking Data", repeatable: true, mandatory: false, tips: ["Informação para ligação entre campos."] }
            ]
        },
        {
            tag: "183",
            name: "TYPE OF CARRIER",
            ind1Tips: ["Não definido"],
            ind2Name: ["Display Indicator"],
            ind2Tips: ["0 Not used to generate displays", "1 Used to generate displays", "# Information not provided (use if only $c is present)"],
            tips: [
                "Contém dados codificados especificando o tipo de suporte (carrier) usado para transportar o conteúdo.",
                "Relativo à parte física material da manifestação."
            ],
            subFieldDef: [
                { code: "a", label: "Type of Carrier Code", repeatable: true, mandatory: false, tips: ["Código especificando o tipo de suporte/carrier (ex: volume, disco, etc.)"] },
                { code: "2", label: "Source", repeatable: false, mandatory: false, tips: ["Fonte do código usado em $a."] },
                { code: "6", label: "Interfield Linking Data", repeatable: true, mandatory: false, tips: ["Informação de ligação entre campos."] },
                { code: "8", label: "Materials Specified", repeatable: true, mandatory: false, tips: ["Parte específica do material a que o campo se aplica."] }
            ]
        },
        {
            tag: "200",
            name: "TITLE AND STATEMENT OF RESPONSABILITY",
            ind1Name: ["Title Significance Indicator"],
            ind1Tips: ["0 - Title is not significant, 1 - Title is significant"],
            ind2Tips: ["Não definido"],
            tips: [
                "Contém o título, outras informações do título e declarações de responsabilidade conforme aparecem no recurso.",
                "Corresponde à Área 1 da ISBD (Título e menção de responsabilidade)."
            ],
            subFieldDef: [
                { code: "a", label: "Title Proper", repeatable: true, mandatory: true, tips: ["Título principal conforme aparece na fonte de informação."] },
                { code: "b", label: "General Material Designation (GMD)", repeatable: true, mandatory: false, tips: ["Termo que indica a natureza geral do documento (ex: [som], [imagem])."] },
                { code: "c", label: "Title Proper by Another Author", repeatable: true, mandatory: false, tips: ["Título principal atribuído a um autor diferente."] },
                { code: "d", label: "Parallel Title Proper", repeatable: true, mandatory: false, tips: ["Título em outra língua ou escrita, apresentado paralelamente ao título principal."] },
                { code: "e", label: "Other Title Information", repeatable: true, mandatory: false, tips: ["Complementos ou subtítulos ligados ao título principal."] },
                { code: "f", label: "First Statement of Responsibility", repeatable: true, mandatory: false, tips: ["Nome da pessoa ou entidade principal responsável pela criação."] },
                { code: "g", label: "Subsequent Statement of Responsibility", repeatable: true, mandatory: false, tips: ["Outras pessoas ou entidades responsáveis, além da principal."] },
                { code: "h", label: "Number of a Part", repeatable: true, mandatory: false, tips: ["Numeração de parte de obra em mais de um volume."] },
                { code: "i", label: "Name of a Part", repeatable: true, mandatory: false, tips: ["Título específico de parte do recurso (ex: capítulo, volume)."] },
                { code: "j", label: "Inclusive Dates", repeatable: false, mandatory: false, tips: ["Datas abrangidas pelo conteúdo da obra."] },
                { code: "k", label: "Bulk Dates", repeatable: false, mandatory: false, tips: ["Datas de maior concentração dos documentos no recurso."] },
                { code: "r", label: "Title Page Information Following the Title Proper", repeatable: false, mandatory: false, tips: ["Informações que aparecem após o título principal na folha de rosto."] },
                { code: "v", label: "Volume Designation", repeatable: false, mandatory: false, tips: ["Identificação do volume dentro de uma coleção."] },
                { code: "z", label: "Language of Parallel Title Proper", repeatable: true, mandatory: false, tips: ["Código ou indicação da língua do título paralelo."] },
                { code: "2", label: "Source", repeatable: false, mandatory: false, tips: ["Fonte do sistema de codificação ou forma normalizada utilizada."] },
                { code: "5", label: "Institution to which the Field Applies", repeatable: false, mandatory: false, tips: ["Instituição à qual o campo específico se aplica."] }
            ]
        },
        {
            tag: "203",
            name: "CONTENT FORM AND MEDIA TYPE",
            ind1Tips: ["# - Não definido"],
            ind2Tips: ["# - Não definido"],
            tips: [
                "Este campo corresponde à Área 0 do ISBD, Formulário de Conteúdo e Área de Tipo de Suporte, cuja finalidade é indicar logo no início da descrição, tanto a forma ou formas fundamentais em que o conteúdo de um o recurso é expresso e o tipo ou tipos de suporte utilizados para transmitir esse conteúdo de modo a auxiliar o catálogo utilizadores na identificação e seleção de recursos adequados às suas necessidades."
            ],
            subFieldDef: [
                { code: "a", label: "Content Form", repeatable: true, mandatory: true, tips: ["As categorias de forma de conteúdo refletem a forma ou formas fundamentais em que o conteúdo de um recurso é expressado. Os termos definidos para o elemento Formulário de Conteúdo ISBD devem ser utilizados."] },
                { code: "b", label: "Content Qualification", repeatable: true, mandatory: true, tips: ["Uma categoria de formulário de conteúdo é expandida por uma ou mais subcategorias de qualificação de conteúdo que são aplicável ao recurso que está a ser descrito."] },
                { code: "c", label: "Media Type", repeatable: false, mandatory: false, tips: ["As categorias de tipo de suporte registam o tipo ou tipos de suporte utilizados para transmitir o conteúdo do recurso. Devem ser utilizados os termos definidos para o elemento Tipo de Suporte ISBD."] },
            ]
        },
        {
            tag: "205",
            name: "EDITION STATEMENT",
            ind1Tips: ["# - Não definido"],
            ind2Tips: ["# - Não definido"],
            tips: [
                "Contém a declaração de edição e informações relacionadas, como emissão e responsabilidades associadas.",
                "Corresponde à Área de Edição da ISBD."
            ],
            subFieldDef: [
                { code: "a", label: "Edition Statement", repeatable: false, mandatory: false, tips: ["Declaração principal de edição (ex: 2ª edição, edição revista)."] },
                { code: "b", label: "Issue Statement", repeatable: true, mandatory: false, tips: ["Informações sobre tiragens ou estados específicos da edição."] },
                { code: "d", label: "Parallel Edition Statement", repeatable: true, mandatory: false, tips: ["Declaração de edição em outra língua, apresentada paralelamente."] },
                { code: "f", label: "Statement of Responsibility Relating to Edition", repeatable: true, mandatory: false, tips: ["Pessoa ou entidade responsável pela edição ou revisão."] },
                { code: "g", label: "Subsequent Statement of Responsibility", repeatable: true, mandatory: false, tips: ["Outras entidades responsáveis por revisões ou edições posteriores."] }
            ]
        },
        {
            tag: "206",
            name: "CARTOGRAPHIC RESOURCES - MATHEMATICAL DATA",
            ind1Name: ["Formatting Indicator"],
            ind1Tips: ["# - Unstructured, 0 - Structured"],
            ind2Tips: ["Não definido"],
            tips: [
                "Contém dados matemáticos relacionados com materiais cartográficos, incluindo escalas, projeções, coordenadas e equinócio."
            ],
            subFieldDef: [
                { code: "a", label: "Mathematical Data Statement", repeatable: false, mandatory: false, tips: ["Declaração geral incluindo escala, projeção e coordenadas em formato livre."] },
                { code: "b", label: "Statement of Scale", repeatable: true, mandatory: false, tips: ["Declaração da escala do recurso cartográfico (ex: 1:50000)."] },
                { code: "c", label: "Statement of Projection", repeatable: false, mandatory: false, tips: ["Indicação do tipo de projeção cartográfica usada."] },
                { code: "d", label: "Statement of Coordinates", repeatable: false, mandatory: false, tips: ["Declaração das coordenadas geográficas que delimitam a área cartografada."] },
                { code: "e", label: "Right Ascension and Declination", repeatable: false, mandatory: false, tips: ["Declaração das coordenadas celestes: ascensão reta e declinação."] },
                { code: "f", label: "Statement of Equinox", repeatable: false, mandatory: false, tips: ["Declaração da época do equinócio associada às coordenadas astronómicas."] }
            ]
        },
        {
            tag: "207",
            name: "MATERIAL SPECIFIC AREA: NUMBERING OF CONTINUING RESOURCES",
            ind1Tips: ["Não definido"],
            ind2Name: ["Formatted Numbering Indicator"],
            ind2Tips: ["0 - Formatted, 1 - Not formatted"],
            tips: [
                "Contém a numeração e/ou as datas de cobertura de fascículos ou volumes de recursos contínuos (revistas, séries, etc.)."
            ],
            subFieldDef: [
                { code: "a", label: "Numbering: Dates and Volume Designations", repeatable: true, mandatory: false, tips: ["Informações estruturadas de numeração e datas de fascículos (ex: vol. 5, n. 3, 2024)."] },
                { code: "z", label: "Source of Numbering Information", repeatable: true, mandatory: false, tips: ["Nota explicativa sobre a origem das informações de numeração, se não obtidas da fonte primária."] }
            ]
        },
        {
            tag: "208",
            name: "MATERIAL SPECIFIC AREA: MUSIC FORMAT STATEMENT",
            ind1Tips: ["# - Não definido"],
            ind2Tips: ["# - Não definido"],
            tips: [
                "Contém uma declaração relativa ao formato de uma obra de música impressa ou manuscrita.",
                "Utilizado para recursos de partituras e manuscritos musicais."
            ],
            subFieldDef: [
                { code: "a", label: "Music Format Statement", repeatable: false, mandatory: false, tips: ["Declaração sobre o formato musical (ex: partitura, parte instrumental)."] },
                { code: "d", label: "Parallel Music Format Statement", repeatable: true, mandatory: false, tips: ["Declaração paralela do formato da música em outra língua."] }
            ]
        },
        {
            tag: "210",
            name: "PUBLICATION, DISTRIBUTION, ETC.",
            ind1Name: ["Sequence of Publication Data"],
            ind1Tips: ["# - Not applicable / Earliest available publisher, 0 - Intervening publisher, 1 - Current or latest publisher"],
            ind2Name: ["Type of Release"],
            ind2Tips: ["# - Produced in multiple copies, usually published or publically distributed, 1 - Not published or publically distributed"],
            tips: [
                "Contém informações normalizadas sobre o local de publicação, distribuidor, editor, data de publicação, impressor, etc."
            ],
            subFieldDef: [
                { code: "a", label: "Place of publication, production and/or distribution", repeatable: true, mandatory: false, tips: ["Localidade onde o recurso foi publicado, produzido ou distribuído."] },
                { code: "b", label: "Address of publisher, distributor, etc.", repeatable: true, mandatory: false, tips: ["Endereço postal completo do editor, distribuidor ou produtor."] },
                { code: "c", label: "Name of publisher, producer and/or distributor", repeatable: true, mandatory: false, tips: ["Nome da entidade responsável pela publicação, produção ou distribuição."] },
                { code: "d", label: "Date of publication, production and/or distribution", repeatable: false, mandatory: false, tips: ["Data da publicação, produção ou distribuição."] },
                { code: "e", label: "Place of printing, manufacture or engraving", repeatable: true, mandatory: false, tips: ["Local de impressão, fabricação ou gravação do recurso."] },
                { code: "f", label: "Address of printer, manufacturer or engraver", repeatable: true, mandatory: false, tips: ["Endereço postal do impressor, fabricante ou gravador."] },
                { code: "g", label: "Name of printer, manufacturer or engraver", repeatable: true, mandatory: false, tips: ["Nome da entidade que imprimiu, fabricou ou gravou o recurso."] },
                { code: "h", label: "Date of printing, manufacture or engraving", repeatable: false, mandatory: false, tips: ["Data de impressão, fabricação ou gravação."] },
                { code: "r", label: "Printing or publishing info from title page", repeatable: false, mandatory: false, tips: ["Informações de impressão ou publicação como transcritas da página de rosto."] },
                { code: "s", label: "Printing or publishing info from colophon", repeatable: false, mandatory: false, tips: ["Informações de impressão ou publicação como transcritas do colofão."] }
            ]
        },
        {
            tag: "211",
            name: "PROJECTED PUBLICATION DATE",
            ind1Tips: ["# - Não definido"],
            ind2Tips: ["# - Não definido"],
            tips: [
                "Contém a data projetada de publicação, usada para pré-registos (ex: CIP - Catalogação na Publicação)."
            ],
            subFieldDef: [
                { code: "a", label: "Date", repeatable: false, mandatory: false, tips: ["Data prevista para publicação, no formato ISO 8601-1 (AAAA-MM-DD sem separadores)."] }
            ]
        },
        {
            tag: "214",
            name: "PRODUCTION, PUBLICATION, DISTRIBUTION, MANUFACTURE STATEMENTS",
            ind1Name: ["Sequence of Publication Data"],
            ind1Tips: ["# - Not applicable / No information provided/ Earliest available, 0 - Intervening, 1 - Current or latest"],
            ind2Name: ["Type of Statement"],
            ind2Tips: ["# - Não definido, 0 - Publication, 1 - Production, 2 - Distribution, 3 - Manufacture, 4 - Copyright or a protection date"],
            tips: [
                "Contém declarações relacionadas com a publicação, produção, distribuição ou fabricação do recurso, respeitando distinções funcionais (RDA)."
            ],
            subFieldDef: [
                { code: "a", label: "Place of Publication, Production, Distribution or Manufacture", repeatable: true, mandatory: false, tips: ["Local de publicação, produção, distribuição ou fabricação."] },
                { code: "b", label: "Address of Publisher, Producer, Distributor or Manufacturer", repeatable: true, mandatory: false, tips: ["Endereço postal completo da entidade responsável."] },
                { code: "c", label: "Name of Publisher, Producer, Distributor or Manufacturer", repeatable: true, mandatory: false, tips: ["Nome da editora, produtora, distribuidora ou fabricante."] },
                { code: "d", label: "Date of Publication, Production, Distribution or Manufacture", repeatable: false, mandatory: false, tips: ["Data de publicação, produção, distribuição ou fabricação."] },
                { code: "r", label: "Printing/Publishing Info from Main Source", repeatable: false, mandatory: false, tips: ["Informações transcritas como aparecem na fonte principal (ex: folha de rosto)."] },
                { code: "s", label: "Printing/Publishing Info from Colophon", repeatable: false, mandatory: false, tips: ["Informações transcritas como aparecem no colofão."] }
            ]
        },
        {
            tag: "215",
            name: "PHYSICAL DESCRIPTION",
            ind1Tips: ["# - Não definido"],
            ind2Tips: ["# - Não definido"],
            tips: [
                "Contém informações sobre as características físicas do recurso, de acordo com a ISBD Material Description Area."
            ],
            subFieldDef: [
                { code: "a", label: "Specific Material Designation and Extent", repeatable: true, mandatory: false, tips: ["Tipo específico de material e quantidade de unidades físicas."] },
                { code: "b", label: "Materials and Technique Display", repeatable: false, mandatory: false, tips: ["Nota livre sobre materiais e técnicas usados na criação do recurso."] },
                { code: "c", label: "Other Physical Details", repeatable: false, mandatory: false, tips: ["Outros detalhes físicos, como ilustrações, presença de som, cor, etc."] },
                { code: "d", label: "Dimensions", repeatable: true, mandatory: false, tips: ["Medidas do recurso (ex: altura, largura, profundidade)."] },
                { code: "e", label: "Accompanying Material", repeatable: true, mandatory: false, tips: ["Descrição de materiais acompanhantes (ex: mapas, livretos)."] },
                { code: "f", label: "Weight", repeatable: false, mandatory: false, tips: ["Peso do recurso, em gramas."] }
            ]
        },
        {
            tag: "225",
            name: "SERIES",
            ind1Name: ["Form of Series Title Indicator"],
            ind1Tips: ["# - Not applicable, 0 - Not the same as the established form, 1 - Same as established form"],
            ind2Tips: ["# - Não definido"],
            tips: [
                "Contém informações relacionadas à série ou coleção à qual o recurso pertence (Título da série, responsabilidade, numeração, etc.)."
            ],
            subFieldDef: [
                { code: "a", label: "Title of Series", repeatable: false, mandatory: false, tips: ["Título principal da coleção ou série."] },
                { code: "d", label: "Parallel Title", repeatable: true, mandatory: false, tips: ["Título paralelo da série em outra língua ou escrita."] },
                { code: "e", label: "Other Title Information", repeatable: true, mandatory: false, tips: ["Complemento ou subtítulo do título da série."] },
                { code: "f", label: "Statement of Responsibility", repeatable: true, mandatory: false, tips: ["Nome da pessoa ou entidade responsável pela série."] },
                { code: "g", label: "Subsequent Statement of Responsibility", repeatable: true, mandatory: false, tips: ["Responsabilidade adicional relativa à série."] },
                { code: "h", label: "Number of a Part", repeatable: true, mandatory: false, tips: ["Número da parte dentro da série."] },
                { code: "i", label: "Name of a Part", repeatable: true, mandatory: false, tips: ["Nome da parte específica dentro da série."] },
                { code: "v", label: "Volume Designation", repeatable: true, mandatory: false, tips: ["Designação do volume dentro da série (ex: volume 3)."] },
                { code: "x", label: "ISSN of Series", repeatable: true, mandatory: false, tips: ["Número padrão internacional para séries (ISSN)."] },
                { code: "y", label: "Standard Number of Multipart Monographic Resource", repeatable: true, mandatory: false, tips: ["Número padrão de recurso monográfico em múltiplas partes."] },
                { code: "z", label: "Language of Parallel Title", repeatable: true, mandatory: false, tips: ["Código da língua associada ao título paralelo."] },
                { code: "2", label: "Source", repeatable: false, mandatory: false, tips: ["Fonte do sistema de codificação ou vocabulário controlado utilizado."] }
            ]
        },
        {
            tag: "230",
            name: "MATERIAL SPECIFIC AREA: ELECTRONICS RESOURCE CHARACTERISTICS",
            ind1Tips: ["# - Não definido"],
            ind2Tips: ["# - Não definido"],
            tips: [
                "Contém informações sobre o tipo e extensão dos recursos eletrónicos, de acordo com a ISBD(ER).",
                "Usado para designar o tipo de ficheiro e número de ficheiros de um recurso digital."
            ],
            subFieldDef: [
                { code: "a", label: "Designation and Extent of File", repeatable: false, mandatory: true, tips: ["Designação do tipo de ficheiro e extensão (ex: número de ficheiros, bytes, registros)."] }
            ]
        },
        {
            tag: "251",
            name: "ORGANIZATION AND ARRANGEMENT OF MATERIALS",
            ind1Tips: ["# - Não definido"],
            ind2Tips: ["# - Não definido"],
            tips: [
                "Contém informações sobre como os materiais foram organizados e dispostos dentro da coleção.",
                "Inclui subdivisões hierárquicas como séries e sub-séries, e o nível de descrição arquivística (fundo, série, ficheiro, item)."
            ],
            subFieldDef: [
                { code: "a", label: "Organization", repeatable: true, mandatory: false, tips: ["Modo como os materiais foram subdivididos em unidades menores, como séries e sub-séries."] },
                { code: "b", label: "Arrangement", repeatable: true, mandatory: false, tips: ["Termos usados para descrever o padrão de disposição dos materiais, como alfabético, cronológico, etc."] },
                { code: "c", label: "Level", repeatable: false, mandatory: false, tips: ["Nível hierárquico dos materiais descritos (ex: fundo, série, dossier)."] }
            ]
        },
        {
            tag: "260",
            name: "MATERIAL SPECIFIC: NUMISMATIC RESOURCES",
            ind1Name: ["Description Level"],
            ind1Tips: ["# - Not specified, 0 - Numismatic Type, 1 - Numismatic Item"],
            ind2Name: ["Part of the Numismatic Resource"],
            ind2Tips: ["# - Not specified/ other, 1 - Observe, 2 - Reverse, 3 - Edge"],
            tips: [
                "Contém dados textuais relativos à identificação e descrição de recursos numismáticos.",
                "Baseado no esquema de descrição numismática (NUDS) e na ontologia nomisma.org."
            ],
            subFieldDef: [
                { code: "a", label: "Denomination", repeatable: false, mandatory: false, tips: ["Termo que indica o valor do recurso numismático."] },
                { code: "b", label: "Weight Standard or Theoretical Weight", repeatable: false, mandatory: false, tips: ["Peso convencional ou teórico para o recurso numismático."] },
                { code: "c", label: "Issue", repeatable: false, mandatory: false, tips: ["Nome ou número convencional que identifica a emissão."] },
                { code: "d", label: "Other Appellation", repeatable: true, mandatory: false, tips: ["Outro nome comummente utilizado para identificar a moeda ou recurso numismático."] },
                { code: "e", label: "Type Name or Reference", repeatable: true, mandatory: false, tips: ["Nome comum ou referência dentro de uma tipologia publicada."] },
                { code: "f", label: "Legend", repeatable: false, mandatory: false, tips: ["Inscrição principal ou única no recurso numismático."] },
                { code: "g", label: "Other Inscription", repeatable: true, mandatory: false, tips: ["Qualquer outra inscrição presente no recurso numismático."] },
                { code: "h", label: "Type Description", repeatable: false, mandatory: false, tips: ["Descrição iconográfica geral do tipo de recurso numismático."] },
                { code: "i", label: "Shape", repeatable: false, mandatory: false, tips: ["Forma geral do recurso numismático (ex: redondo, poligonal)."] },
                { code: "j", label: "Axis", repeatable: false, mandatory: false, tips: ["Orientação entre o anverso e o reverso do recurso numismático."] },
                { code: "u", label: "Uniform Resource Identifier (URI)", repeatable: false, mandatory: false, tips: ["URI para acesso normalizado à descrição online."] }
            ]
        },
        {
            tag: "283",
            name: "CARRIER TYPE",
            ind1Tips: ["# - Não definido"],
            ind2Tips: ["# - Não definido"],
            tips: [
                "Contém dados textuais especificando o tipo de suporte (carrier) do recurso descrito.",
                "Permite identificar a forma física do recurso, como volume, videodisc, microfilme, etc.",
                "Usa vocabulário controlado; fonte de designação deve ser indicada em $2."
            ],
            subFieldDef: [
                { code: "a", label: "Carrier Type Designation", repeatable: true, mandatory: true, tips: ["Designação do tipo de suporte físico utilizado para o recurso (ex: volume, videodisc, microfilme)."] },
                { code: "2", label: "Source", repeatable: false, mandatory: true, tips: ["Fonte do vocabulário controlado utilizado para o tipo de suporte (ex: rdacarrier)."] },
                { code: "6", label: "Interfield Linking Data", repeatable: true, mandatory: false, tips: ["Dados que permitem o processamento de ligações entre campos no registo."] },
                { code: "8", label: "Materials Specified", repeatable: true, mandatory: false, tips: ["Parte específica dos materiais descritos a que o campo se aplica."] }
            ]
        },
        {
            tag: "300",
            name: "GENERAL NOTES",
            ind1Tips: ["# - Não definido"],
            ind2Tips: ["# - Não definido"],
            tips: [
                "Nota sobre qualquer aspeto do recurso bibliográfico ou do registo associado.",
                "Utilizado quando não existe campo específico para a nota desejada."
            ],
            subFieldDef: [
                { code: "a", label: "Text of Note", repeatable: false, mandatory: false, tips: ["Texto livre da nota."] }
            ]
        },
        {
            tag: "301",
            name: "NOTES PERTAINING TO IDENTIFICATION NUMBERS",
            ind1Tips: ["# - Não definido"],
            ind2Tips: ["# - Não definido"],
            tips: [
                "Notas sobre números de identificação presentes no recurso ou no registo.",
                "Utilizado quando o número não se encaixa nos campos 010 a 040 ou para comentários sobre esses números."
            ],
            subFieldDef: [
                { code: "a", label: "Text of Note", repeatable: false, mandatory: false, tips: ["Nota textual sobre número de identificação."] }
            ]
        },
        {
            tag: "302",
            name: "NOTES PERTAINING TO CODED INFORMATION",
            ind1Tips: ["# - Não definido"],
            ind2Tips: ["# - Não definido"],
            tips: [
                "Notas relativas a elementos de dados codificados nos campos 1--.",
                "Pode ser utilizado para expandir, explicar ou apresentar informações codificadas em formato textual."
            ],
            subFieldDef: [
                { code: "a", label: "Text of Note", repeatable: false, mandatory: false, tips: ["Nota textual sobre informação codificada."] }
            ]
        },
        {
            tag: "303",
            name: "NOTES PERTAINING TO DESCRIPTIVE INFORMATION",
            ind1Tips: ["# - Não definido"],
            ind2Tips: ["# - Não definido"],
            tips: [
                "Nota relacionada com a descrição do recurso."
            ],
            subFieldDef: [
                { code: "a", label: "Text of Note", repeatable: false, mandatory: false, tips: ["Nota textual sobre informação descritiva-"] }
            ]
        },
        {
            tag: "304",
            name: "NOTES PERTAINING TO TITLE AND STATEMENT OF RESPONSABILITY",
            ind1Tips: ["# - Não definido"],
            ind2Tips: ["# - Não definido"],
            tips: [
                "Notas sobre o título ou a declaração de responsabilidade como registados no campo 200.",
                "Obrigatório para recursos eletrónicos; opcional para outros materiais."
            ],
            subFieldDef: [
                { code: "a", label: "Text of Note", repeatable: false, mandatory: false, tips: ["Nota textual sobre título ou responsabilidade."] }
            ]
        },
        {
            tag: "305",
            name: "NOTES PERTAINING TO EDITION AND BIBLIOGRAPHIC HISTORY",
            ind1Tips: ["# - Não definido"],
            ind2Tips: ["# - Não definido"],
            tips: [
                "Notas sobre a edição do recurso ou sobre a história bibliográfica.",
                "Inclui títulos anteriores, edições anteriores ou substituições."
            ],
            subFieldDef: [
                { code: "a", label: "Text of Note", repeatable: false, mandatory: false, tips: ["Nota textual sobre edição ou história bibliográfica."] }
            ]
        },
        {
            tag: "306",
            name: "NOTES PERTAINING TO PUBLICATION, DISTRIBUTION, ETC.",
            ind1Tips: ["# - Não definido"],
            ind2Tips: ["# - Não definido"],
            tips: [
                "Notas sobre publicação, distribuição, fabricação ou produção do recurso.",
                "Usado para informação não registrada no campo 210."
            ],
            subFieldDef: [
                { code: "a", label: "Text of Note", repeatable: false, mandatory: false, tips: ["Nota textual sobre publicação, distribuição ou fabricação."] }
            ]
        },
        {
            tag: "308",
            name: "NOTES PERTAINING TO SERIES",
            ind1Tips: ["# - Não definido"],
            ind2Tips: ["# - Não definido"],
            tips: [
                "Contém notas relativas a uma série à qual o recurso pertence ou em que foi previamente publicado.",
                "Utilizar para anotar a inclusão ou origem do recurso em séries."
            ],
            subFieldDef: [
                { code: "a", label: "Text of Note", repeatable: false, mandatory: false, tips: ["Texto livre da nota sobre a série."] }
            ]
        },
        {
            tag: "310",
            name: "NOTES PERTAINING TO BINDING AND AVAILABILITY",
            ind1Tips: ["# - Não definido"],
            ind2Tips: ["# - Não definido"],
            tips: [
                "Contém notas sobre a encadernação ou disponibilidade do recurso.",
                "Inclui informações sobre edições especiais, cópias limitadas, condições de compra, etc."
            ],
            subFieldDef: [
                { code: "a", label: "Text of Note", repeatable: false, mandatory: false, tips: ["Texto livre da nota sobre encadernação ou disponibilidade."] }
            ]
        },
        {
            tag: "311",
            name: "NOTES PERTAINING TO LINKING FIELDS",
            ind1Tips: ["# - Não definido"],
            ind2Tips: ["# - Não definido"],
            tips: [
                "Notas que expandem ou explicam ligações feitas nos campos de ligação (4--).",
                "Utilizado para clarificar relações bibliográficas não suficientemente descritas automaticamente."
            ],
            subFieldDef: [
                { code: "a", label: "Text of Note", repeatable: false, mandatory: false, tips: ["Texto livre da nota sobre campos de ligação."] }
            ]
        },
        {
            tag: "312",
            name: "NOTES PERTAINING TO RELATED TITLES",
            ind1Tips: ["# - Não definido"],
            ind2Tips: ["# - Não definido"],
            tips: [
                "Notas relativas a títulos relacionados, como subtítulos, títulos paralelos não principais, títulos alternativos.",
                "Utilizado para explicar variantes do título não registradas no campo 200."
            ],
            subFieldDef: [
                { code: "a", label: "Text of Note", repeatable: false, mandatory: false, tips: ["Texto livre da nota sobre títulos relacionados."] }
            ]
        },
        {
            tag: "313",
            name: "NOTES PERTAINING TO RELATED SUBJECT ACCESS",
            ind1Tips: ["# - Não definido"],
            ind2Tips: ["# - Não definido"],
            tips: [
                "Contém uma nota relativa ao acesso por assunto ao recurso descrito.",
                "Pode incluir informação sobre índices de assunto ou classificações incluídas no recurso."
            ],
            subFieldDef: [
                { code: "a", label: "Text of Note", repeatable: false, mandatory: false, tips: ["Texto da nota relativa ao acesso por assunto."] }
            ]
        },
        {
            tag: "314",
            name: "NOTES PERTAINING TO RESPONSABILITY",
            ind1Tips: ["# - Não definido"],
            ind2Tips: ["# - Não definido"],
            tips: [
                "Contém uma nota relativa à responsabilidade do recurso.",
                "Inclui notas sobre pessoas ou entidades responsáveis que não foram mencionadas noutros campos."
            ],
            subFieldDef: [
                { code: "a", label: "Text of Note", repeatable: false, mandatory: false, tips: ["Texto da nota sobre responsabilidade."] }
            ]
        },
        {
            tag: "315",
            name: "NOTES PERTAINING TO MATERIAL (OR TYPE OF PUBLICATION) SPECIFIC INFORMATION",
            ind1Tips: ["# - Não definido"],
            ind2Tips: ["# - Não definido"],
            tips: [
                "Contém uma nota relativa a informações específicas do tipo de material ou publicação.",
                "Usado para notas como escala de mapas, suspensão de periódicos, etc."
            ],
            subFieldDef: [
                { code: "a", label: "Text of Note", repeatable: false, mandatory: false, tips: ["Texto da nota específica sobre tipo de material ou publicação."] }
            ]
        },
        {
            tag: "316",
            name: "NOTES PERTAINING TO THE ITEM",
            ind1Tips: ["# - Não definido"],
            ind2Tips: ["# - Não definido"],
            tips: [
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
            tag: "320",
            name: "INTERNAL BIBLIOGRAPHIES/ INDEXES NOTE",
            ind1Tips: ["# - Não definido"],
            ind2Tips: ["# - Não definido"],
            tips: [
                "Contém uma nota indicando que o recurso inclui uma bibliografia ou índice.",
                "Pode mencionar paginação, localização ou disponibilização de extratos eletrónicos do índice ou da bibliografia."
            ],
            subFieldDef: [
                { code: "a", label: "Text of Note", repeatable: false, mandatory: false, tips: ["Texto da nota interna sobre bibliografias ou índices."] },
                { code: "u", label: "Uniform Resource Identifier (URI)", repeatable: true, mandatory: false, tips: ["Identificador uniforme para acesso eletrónico ao índice ou bibliografia interna."] }
            ]
        },
        {
            tag: "321",
            name: "EXTERNAL INDEXES/ABSTRACTS/REFERENCES NOTE",
            ind1Name: ["Type of Coverage"],
            ind1Tips: ["# - Nenhuma informação disponível, 0 - Indexing, abstracting coverage, 1 - Bibliography, catalogue citation"],
            ind2Tips: ["# - Não definido"],
            tips: [
                "Contém uma nota indicando a disponibilidade em outros documentos de índices, resumos ou referências do recurso descrito.",
                "Pode incluir citações em catálogos, bibliografias, ou serviços de indexação e resumo externos."
            ],
            subFieldDef: [
                { code: "a", label: "Name of Source", repeatable: false, mandatory: false, tips: ["Nome da fonte externa onde o recurso é indexado ou citado."] },
                { code: "b", label: "Dates of Coverage", repeatable: false, mandatory: false, tips: ["Datas de cobertura do índice ou resumo."] },
                { code: "c", label: "Location within Source", repeatable: false, mandatory: false, tips: ["Localização ou referência interna no documento externo."] },
                { code: "u", label: "Uniform Resource Identifier (URI)", repeatable: false, mandatory: false, tips: ["URI de acesso eletrónico ao índice, resumo ou referência."] },
                { code: "x", label: "International Standard Number", repeatable: false, mandatory: false, tips: ["Número normalizado internacional (ISBN, ISSN, etc.) da fonte externa."] },
                { code: "5", label: "Institution to which Field Applies", repeatable: false, mandatory: false, tips: ["Instituição a que a nota se aplica."] },
                { code: "6", label: "Interfield Linking Data", repeatable: true, mandatory: false, tips: ["Dados de ligação entre campos no registo."] }
            ]
        },
        {
            tag: "322",
            name: "CREDITS NOTES (PROJECTED AND VIDEO MATERIAL AND SOUND RECORDINDS)",
            ind1Tips: ["# - Não definido"],
            ind2Tips: ["# - Não definido"],
            tips: [
                "Contém os nomes de pessoas ou organizações, excluindo o elenco, que participaram na produção artística ou técnica do recurso.",
                "Não se deve incluir o termo 'Credits' no campo, pois pode ser gerado automaticamente.",
                "Quando a distinção entre notas de elenco e de créditos não é feita, este campo pode ser usado para ambos."
            ],
            subFieldDef: [
                { code: "a", label: "Text of Note", repeatable: false, mandatory: false, tips: ["Texto com a informação de créditos do recurso."] }
            ]
        },
        {
            tag: "323",
            name: "CAST NOTES (PROJECTED AND VIDEO MATERIAL AND SOUND RECORDINDS)",
            ind1Tips: ["# - Não definido"],
            ind2Tips: ["# - Não definido"],
            tips: [
                "Contém os nomes dos atores, narradores, apresentadores, intérpretes ou grupos de intérpretes de materiais projetados, vídeo ou gravações sonoras.",
                "Este campo é repetível para cada categoria diferente de participantes (por exemplo, narradores e elenco).",
                "Se o nome dos performers já estiver no campo 200, este campo não é necessário.",
                "Quando fontes externas não distinguem entre créditos e elenco, pode-se usar o campo 322 em vez do 323."
            ],
            subFieldDef: [
                { code: "a", label: "Text of Note", repeatable: false, mandatory: false, tips: ["Texto da nota sobre elenco, narradores, intérpretes, etc."] }
            ]
        },
        {
            tag: "324",
            name: "ORIGINAL VERSION NAME",
            ind1Tips: ["# - Não definido"],
            ind2Tips: ["# - Não definido"],
            tips: [
                "Contém uma nota sobre a versão original da publicação."
            ],
            subFieldDef: [
                { code: "a", label: "Text of Note", repeatable: false, mandatory: false, tips: ["Texto da nota sobre a versão original."] }
            ]
        },
        {
            tag: "325",
            name: "REPRODUCTION NOTE",
            ind1Name: ["Original/ Reproduction Indicator"],
            ind1Tips: ["# - This resource is a reproduction; the note describes that reproduction, 1 - The resource is an original; the note describes an available reproduction"],
            indName: ["Structure Indicator"],
            ind2Tips: ["# - Unstructured note, 1 - Structured note"],
            tips: [
                "Contém uma nota que indica que o recurso ou é uma reprodução ou é o original."
            ],
            subFieldDef: [
                { code: "a", label: "Text of Unstructured Note", repeatable: false, mandatory: false, tips: ["Utilizado apenas para o texto completo de uma nota não estruturada."] },
                { code: "b", label: "Type of Reproduction", repeatable: false, mandatory: false, tips: ["O modo de reprodução (ex: digitalização) ou o tipo de carrier da reprodução."] },
                { code: "c", label: "Place of Reproduction", repeatable: true, mandatory: false, tips: ["Local onde a reprodução está publicada ou distribuída."] },
                { code: "d", label: "Agency Responsible for the reproduction", repeatable: true, mandatory: false, tips: ["O nome da agência que disponibiliza a reprodução."] },
                { code: "e", label: "Date of Publication for the Reproduction", repeatable: false, mandatory: false, tips: ["A data em que a reprodução foi publicada ou distribuída."] },
                { code: "f", label: "Physical Description of the Reproduction", repeatable: false, mandatory: false, tips: ["Outros detalhes físicos e dimensões da reprodução."] },
                { code: "g", label: "Series Statement for the Reproduction", repeatable: false, mandatory: false, tips: ["Informação descritiva sobre a série na qual foi publicada a reprodução."] },
                { code: "h", label: "Completeness of the Reproduction Code", repeatable: false, mandatory: false, tips: ["Este subcampo aplica-se à reprodução do recurso."] },
                { code: "i", label: "Coverage of the Reproduction", repeatable: false, mandatory: false, tips: ["Este subcampo aplica-se à reprodução do recurso."] },
                { code: "j", label: "Terms of Access of the Reproduction", repeatable: true, mandatory: false, tips: ["Subcampo de dados codificados que identifica os problemas do recurso que tem termos de acesso específicos."] },
                { code: "n", label: "Note About Reproduction", repeatable: true, mandatory: false, tips: ["Para uma nota sobre a completude utilize o subcampo $i."] },
                { code: "u", label: "Uniform Resource Identifier (URI)", repeatable: false, mandatory: false, tips: ["Uniform Resource Identifier (URI), como um URL (Uniform Resource Locator) ou URN (Uniform Nome do Recurso), serve como uma sequência padronizada que identifica um recurso e fornece acesso eletrónico através de protocolos de internet."] },
                { code: "v", label: "Date of Consultation", repeatable: false, mandatory: false, tips: ["Hora a que a reprodução foi acedida para a descrever no campo 325."] },
                { code: "x", label: "ISSN of the Reproduction", repeatable: false, mandatory: false, tips: ["Corresponde ao conteúdo do subcampo 011$a do registo que seria estabelecido para descrever o reprodução."] },
                { code: "y", label: "ISBN of the Reproduction", repeatable: true, mandatory: false, tips: ["ISBN atribuído à reprodução. Repetível quando é atribuído mais do que um ISBN ao reprodução (por exemplo, mais do que uma editora, recursos multiparte, etc.)"] },
                { code: "z", label: "Date when the URL in $u was Found to be Invalid", repeatable: false, mandatory: false, tips: ["O momento em que o acesso à reprodução foi negado, devido a um URL quebrado ou inválido em $u."] },
                { code: "5", label: "Institution to which the Field Applies", repeatable: false, mandatory: false, tips: ["Introduza a data completa no formato standard AAAAMMDD, de acordo com a norma ISO 8601-1."] },
            ]
        },
        {
            tag: "326",
            name: "FREQUENCY STATEMENT NOTE (CONTINUING RESOURCES)",
            ind1Tips: ["# - Não definido"],
            ind2Tips: ["# - Não definido"],
            tips: [
                "Contém uma nota que indica a frequência com que o recurso é publicado."
            ],
            subFieldDef: [
                { code: "a", label: "Frequency", repeatable: false, mandatory: false, tips: ["Uma declaração que indica a frequência com que um recurso contínuo é emitido."] },
                { code: "b", label: "Dates of Frequency", repeatable: false, mandatory: false, tips: ["O período em que se aplica a frequência mencionada no subcampo $a."] }
            ]
        },
        {
            tag: "327",
            name: "CONTENT NOTE",
            ind1Name: ["Completeness Indicator"],
            ind1Tips: ["# - Undeterminated, 0 - Incomplete contents, 1 - Complete contents, 2 - Partial contents"],
            ind2Name: ["Structure Indicator"],
            ind2Tips: ["# - Unstructured, 1 - Structured Note"],
            tips: [
                "Contém uma nota que indica a frequência com que o recurso é publicado."
            ],
            subFieldDef: [
                { code: "a", label: "Text of Note", repeatable: true, mandatory: false, tips: ["Repetível"] },
                { code: "b", label: "Tipe of Level 1 Submission", repeatable: true, mandatory: false, tips: ["Repetível."] },
                { code: "c", label: "Tipe of Level 2 Submission", repeatable: true, mandatory: false, tips: ["Repetível."] },
                { code: "d", label: "Tipe of Level 3 Submission", repeatable: true, mandatory: false, tips: ["Repetível."] },
                { code: "e", label: "Tipe of Level 4 Submission", repeatable: true, mandatory: false, tips: ["Repetível."] },
                { code: "f", label: "Tipe of Level 5 Submission", repeatable: true, mandatory: false, tips: ["Repetível."] },
                { code: "g", label: "Tipe of Level 6 Submission", repeatable: true, mandatory: false, tips: ["Repetível."] },
                { code: "h", label: "Tipe of Level 7 Submission", repeatable: true, mandatory: false, tips: ["Repetível."] },
                { code: "i", label: "Tipe of Level 8 Submission", repeatable: true, mandatory: false, tips: ["Repetível."] },
                { code: "p", label: "Sequence of Pages or First Pages of a Subdivision", repeatable: true, mandatory: false, tips: ["Repetível."] },
                { code: "u", label: "Uniform Resource Identifier (URI)", repeatable: true, mandatory: false, tips: ["Um Identificador Uniforme de Recursos (URI), como um URL (Uniform Resource Locator) ou URN (Uniform Nome do Recurso), serve como uma sequência padronizada que identifica um recurso e fornece acesso eletrónico através de protocolos de internet. Isto permite a recuperação automatizada ou a interação com o recurso de forma consistente maneiras."] },
                { code: "z", label: "Other Information Concerning a Subdivision", repeatable: true, mandatory: false, tips: ["Repetível."] },
            ]
        },
        {
            tag: "328",
            name: "DISSERTATION (THESIS) NOTE",
            ind1Tips: ["# - Não definido"],
            ind2Name: ["Structure Indicator"],
            ind2Tips: ["# - No information available, 0 - Structured, 1 - Not structured"],
            tips: [
                "Este campo contém uma nota indicando que o recurso é uma tese ou dissertação e, opcionalmente, incluindo o grau para que foi apresentado, a instituição académica que concedeu o grau e o ano da grau."
            ],
            subFieldDef: [
                { code: "a", label: "Text of Note", repeatable: false, mandatory: false, tips: ["Não repetível."] },
                { code: "b", label: "Dissertation or Thesis Details and Type of Degree", repeatable: false, mandatory: false, tips: ["Não repetível."] },
                { code: "c", label: "Discipline of Degree", repeatable: false, mandatory: false, tips: ["Não repetível."] },
                { code: "d", label: "Date of Degree", repeatable: false, mandatory: false, tips: ["Não repetível."] },
                { code: "e", label: "Body Grantng the Degree", repeatable: false, mandatory: false, tips: ["Não repetível."] },
                { code: "t", label: "Title of Other Edition of Dissertation or Thesis", repeatable: false, mandatory: false, tips: ["Não repetível."] },
                { code: "z", label: "Text Preceding or Following the Note", repeatable: true, mandatory: false, tips: ["Repetível."] }
            ]
        },
        {
            tag: "330",
            name: "SUMMARY OR ABSTRACT",
            ind1Tips: ["# - Não definido"],
            ind2Tips: ["# - Não definido"],
            tips: [
                "Este campo contém um resumo ou abstract do recurso."
            ],
            subFieldDef: [
                { code: "a", label: "Text of Note", repeatable: false, mandatory: false, tips: ["Não repetível."] },
                { code: "u", label: "Uniform Resource Identifier (URI)", repeatable: false, mandatory: false, tips: ["Um Identificador Uniforme de Recursos (URI), como um URL (Uniform Resource Locator) ou URN (Uniform Nome do Recurso), serve como uma sequência padronizada que identifica um recurso e fornece acesso eletrónico através de protocolos de internet. Isto permite a recuperação automatizada ou a interação com o recurso de forma consistente maneiras."] }
            ]
        },
        {
            tag: "332",
            name: "PREFERRED CITATION OF DESCRIBED MATERIALS",
            ind1Tips: ["# - Não definido"],
            ind2Tips: ["# - Não definido"],
            tips: [
                "Este campo contém a citação dos materiais descritos no registo na forma preferida pelo custodiante ou originador."
            ],
            subFieldDef: [
                { code: "a", label: "Preferred Citation", repeatable: false, mandatory: false, tips: ["Não repetível."] },
            ]
        },
        {
            tag: "333",
            name: "USERS/ INTENDED AUDIENCE NOTE",
            ind1Tips: ["# - Não definido"],
            ind2Tips: ["# - Não definido"],
            tips: [
                "Este campo contém informação sobre os utilizadores ou público-alvo do material descrito."
            ],
            subFieldDef: [
                { code: "a", label: "Text of Note", repeatable: false, mandatory: false, tips: ["Não repetível."] },
                { code: "5", label: "Institution to which the Field Applies", repeatable: false, mandatory: false, tips: ["Nome da instituição à qual o campo se aplica no formulário codificado, se for considerado necessário pela agência que cria o registo para identificar atributos específicos de um item."] }
            ]
        },
        {
            tag: "334",
            name: "AWARDS NOTE",
            ind1Tips: ["# - Não definido"],
            ind2Tips: ["# - Não definido"],
            tips: [
                "Este campo contém informações sobre os prémios ou recompensas associados ao recurso descrito. O campo pode ou não pode ser dividido em subcampos separados."
            ],
            subFieldDef: [
                { code: "a", label: "Text of Awards Note", repeatable: false, mandatory: false, tips: ["Este subcampo contém uma nota de texto livre, descrevendo o prémio ou distinção."] },
                { code: "b", label: "Name of Award", repeatable: false, mandatory: false, tips: ["Este subcampo contém o nome do prémio."] },
                { code: "c", label: "Year of Award", repeatable: false, mandatory: false, tips: ["Este subcampo contém o ano em que o prémio foi atribuído."] },
                { code: "d", label: "Country of Award", repeatable: false, mandatory: false, tips: ["Este subcampo contém o código do país que atribui o prémio."] },
                { code: "u", label: "Uniform Resource Identifier (URI)", repeatable: true, mandatory: false, tips: ["Um Identificador Uniforme de Recursos (URI), como um URL (Uniform Resource Locator) ou URN (Uniform Nome do Recurso), serve como uma sequência padronizada que identifica um recurso e fornece acesso eletrónico através de protocolos de internet."] },
                { code: "5", label: "Institution to which the Field Applies", repeatable: false, mandatory: false, tips: ["Nome da instituição à qual o campo se aplica no formulário codificado, se for considerado necessário pela agência que cria o registo para identificar atributos específicos de um item."] }
            ]
        },
        {
            tag: "335",
            name: "LOCATION OF ORIGINALS/ REPRODUCTIONS",
            ind1Name: ["Role of Holding Institution"],
            ind1Tips: ["0 - Holder originals, 1 - Holder of reproductions"],
            ind2Tips: ["# - Não definido"],
            tips: [
                "Este campo contém informação sobre a localização e disponibilidade de cópias dos materiais descritos ou informações sobre a localização e disponibilidade dos originais se a unidade de descrição consistir em cópias ou incluir cópias."
            ],
            subFieldDef: [
                { code: "a", label: "Identification of the Holder", repeatable: false, mandatory: false, tips: ["Nome do repositório ou indivíduo que detém o item. Não repetível."] },
                { code: "b", label: "Address", repeatable: false, mandatory: false, tips: ["Endereço postal do titular. Repetível."] },
                { code: "c", label: "Country", repeatable: false, mandatory: false, tips: ["Código do país para o local identificado no subcampo $a. Os códigos devem ser retirados do conjunto de dois caracteres códigos da norma ISO 3166-1. Repetível."] },
                { code: "g", label: "Control Number", repeatable: false, mandatory: false, tips: ["Qualquer número de controlo significativo para os materiais descritos; por exemplo número de chamada, número de inventário, aquisição números, etc. Repetível."] },
                { code: "u", label: "Uniform Resource Identifier (URI)", repeatable: true, mandatory: false, tips: ["Um Identificador Uniforme de Recursos (URI), como um URL (Uniform Resource Locator) ou URN (Uniform Nome do Recurso), serve como uma sequência padronizada que identifica um recurso e fornece acesso eletrónico através de protocolos de internet."] },
                { code: "8", label: "Materials Specified", repeatable: false, mandatory: false, tips: ["Parte dos materiais descritos aos quais o campo se aplica. Repetível."] }
            ]
        },
        {
            tag: "336",
            name: "TYPE OF ELECTRONIC RESOURCE NOTE",
            ind1Tips: ["# - Não definido"],
            ind2Tips: ["# - Não definido"],
            tips: [
                "Este campo contém uma nota sobre o tipo de recurso eletrónico. Além de um descritor geral (por ex. texto, programa de computador, numérico), informações mais específicas, como a forma ou o género do texto material (por exemplo, biografia, dicionários, índices) pode ser registado neste campo."
            ],
            subFieldDef: [
                { code: "a", label: "Text of Note", repeatable: false, mandatory: false, tips: ["Não repetível."] },
            ]
        },
        {
            tag: "337",
            name: "SYSTEM REQUIREMENTS NOTE (ELECTRONIC RESOURCES)",
            ind1Tips: ["# - Não definido"],
            ind2Tips: ["# - Não definido"],
            tips: [
                "Este campo é utilizado para registar informações técnicas sobre um recurso eletrónico."
            ],
            subFieldDef: [
                { code: "a", label: "Text of Note", repeatable: false, mandatory: false, tips: ["Não repetível."] },
                { code: "u", label: "Uniform Resource Identifier (URI)", repeatable: false, mandatory: false, tips: ["Um Identificador Uniforme de Recursos (URI), como um URL (Uniform Resource Locator) ou URN (Uniform Nome do Recurso), serve como uma sequência padronizada que identifica um recurso e fornece acesso eletrónico através de protocolos de internet."] }
            ]
        },
        {
            tag: "338",
            name: "FUNDING INFORMATION NOTE",
            ind1Tips: ["# - Não definido"],
            ind2Name: ["Structure Indicator"],
            ind2Tips: ["# - Unstructured note, 1 - Structured note"],
            tips: [
                "Este campo contém informações sobre os números do contrato, da subvenção e do projeto quando os resultados do trabalho de um projeto financiado. As informações sobre o patrocinador ou agência financiadora também podem ser incluídas."
            ],
            subFieldDef: [
                { code: "a", label: "Text of Unstructured Note", repeatable: false, mandatory: false, tips: ["Utilize apenas para o texto completo de uma nota não estruturada."] },
                { code: "b", label: "Funding Organization", repeatable: true, mandatory: false, tips: ["Informação sobre os patrocinadores ou agências financiadoras. Repetível."] },
                { code: "c", label: "Program", repeatable: true, mandatory: false, tips: ["O nome refere-se a um programa específico. Repetível."] },
                { code: "d", label: "Project Number", repeatable: false, mandatory: false, tips: ["Um identificador único no âmbito da organização financiadora (por exemplo, um número de contrato de subvenção). Não repetível."] },
                { code: "e", label: "Jurisdiction", repeatable: true, mandatory: false, tips: ["O nome do governo ou de outro organismo jurídico formalmente constituído (por exemplo, UE para União Europeia). Repetível."] },
                { code: "f", label: "Project Name", repeatable: false, mandatory: false, tips: ["A forma completa do nome do projeto. Não repetível."] },
                { code: "g", label: "Project Acronym", repeatable: false, mandatory: false, tips: ["A sigla do projeto. Não repetível."] },
            ]
        },
        {
            tag: "345",
            name: "ACQUISITION INFORMATION NOTE",
            ind1Tips: ["# - Não definido"],
            ind2Tips: ["# - Não definido"],
            tips: [
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
            tag: "346",
            name: "ACQUISITION INFORMATION NOTE",
            ind1Tips: ["# - Não definido"],
            ind2Tips: ["# - Não definido"],
            tips: [
                "Informação sobre as adições previstas e/ou a taxa de utilização de referência do material descrito. A nota pode referir-se às coleções da biblioteca ou do arquivo."
            ],
            subFieldDef: [
                { code: "a", label: "Accruals", repeatable: true, mandatory: false, tips: ["A taxa a que os materiais descritos estão a acumular é expressa como uma proporção de volume num período de tempo."] },
                { code: "b", label: "Frequency of Use", repeatable: true, mandatory: false, tips: ["Uma medida de atividade de referência geralmente expressa como uma proporção de um número de recuperações em relação ao período de tempo."] },
                { code: "5", label: "Institution to which the Field Applies", repeatable: false, mandatory: false, tips: ["Nome da instituição à qual o campo se aplica no formulário codificado, se for considerado necessário pela agência que cria o registo para identificar atributos específicos de um item."] },
                { code: "8", label: "Materials Specified", repeatable: false, mandatory: false, tips: ["Parte dos materiais descritos aos quais o campo se aplica."] },
            ]
        },
        {
            tag: "360",
            name: "NOTE ON SPECIFIC ELEMENTS OF NUMISMATIC DESCRIPTION",
            ind1Name: ["Text of Note"],
            ind1Tips: ["# - Not specified/ other, 0 - Monogram, 1 - Die, 2 - Punch, 3 - Control mark"],
            ind2Name: ["Part of Numismatic Resource Described"],
            ind2Tips: ["# - Unspecified/ other, 1 - Observe, 2 - Reverse, 3 - Edge"],
            tips: [
                "Uma nota relativa à descrição do recurso numismático."
            ],
            subFieldDef: [
                { code: "a", label: "Text of Note", repeatable: false, mandatory: false, tips: ["Uma nota de texto."] },
                { code: "b", label: "Citation", repeatable: true, mandatory: false, tips: ["Uma citação para um trabalho publicado que fornece informações ou uma descrição do elemento em subcampo $a."] },
                { code: "u", label: "Uniform Resource Identifier", repeatable: false, mandatory: false, tips: ["Um Identificador Uniforme de Recursos (URI), como um URL (Uniform Resource Locator) ou URN (Uniform Nome do Recurso), serve como uma sequência padronizada que identifica um recurso e fornece acesso eletrónico através de protocolos de internet."] },
            ]
        },
        {
            tag: "371",
            name: "NOTE ON INFORMATION SERVICE POLICY",
            ind1Name: ["Type of Note"],
            ind1Tips: ["0 - Access Note, 1 - Use and reproduction note, # - Information not provided"],
            ind2Tips: ["# - Não definido"],
            tips: [
                "Uma nota relativa à descrição do recurso numismático."
            ],
            subFieldDef: [
                { code: "a", label: "Terms Governing Access, Use and Reproduction", repeatable: false, mandatory: true, tips: ["O texto de uma declaração legal ou oficial de restrições."] },
                { code: "b", label: "Jurisdiction", repeatable: false, mandatory: false, tips: ["O nome de uma pessoa, de uma organização ou de um cargo ou função dentro da organização, por quem ou aos quais são impostos e aplicados os termos que regem o acesso, a utilização e a reprodução e a quem os a restrição pode ser objecto de recurso."] },
                { code: "c", label: "Authorization", repeatable: false, mandatory: false, tips: ["Uma citação da fonte específica que é a autoridade para a restrição."] },
                { code: "d", label: "Authorized Users", repeatable: false, mandatory: false, tips: ["A classe de utilizadores ou indivíduos específicos aos quais as restrições no subcampo $a não se aplicam."] },
                { code: "5", label: "Institution to which the Field Applies", repeatable: false, mandatory: false, tips: ["Nome da instituição à qual o campo se aplica no formulário codificado, se for considerado necessário pela agência que cria o registo para identificar atributos específicos de um item."] },
                { code: "8", label: "Materials Specified", repeatable: false, mandatory: false, tips: ["Parte dos materiais descritos aos quais o campo se aplica."] },
            ]
        },
        {
            tag: "410",
            name: "SERIES",
            ind1Tips: ["# - Não definido"],
            ind2Tips: ["0 — Do not make a note", "1 — Make a note"],
            tips: [
                "O campo 410 é utilizado para criar uma ligação para uma série que contém o recurso catalogado.",
                "Se o recurso pertence a uma série e a uma sub-série, podem ser utilizados dois campos 410 (primeiro a série, depois a sub-série).",
                "Alternativamente, pode ser usada a estrutura hierárquica 461 (SET) e 462 (SUBSET).",
                "O indicador 2 especifica se uma nota deve ser gerada a partir do conteúdo do campo."
            ],
            subFieldDef: [
                { code: "a", label: "Title", repeatable: false, mandatory: true, tips: ["Título da série ou recurso de monografia."] },
                { code: "d", label: "Parallel Title", repeatable: true, mandatory: false, tips: ["Título da série em outra língua ou escrita."] },
                { code: "e", label: "Other Title Information", repeatable: true, mandatory: false, tips: ["Outras informações subordinadas ao título."] },
                { code: "f", label: "Statement of Responsibility", repeatable: true, mandatory: false, tips: ["Declaração de responsabilidade pelo título ou parte."] },
                { code: "g", label: "Subsequent Statement of Responsibility", repeatable: true, mandatory: false, tips: ["Declarações de responsabilidade subsequentes."] },
                { code: "h", label: "Number of a Part", repeatable: true, mandatory: false, tips: ["Número da secção ou parte."] },
                { code: "i", label: "Name of a Part", repeatable: true, mandatory: false, tips: ["Nome da secção ou parte."] },
                { code: "v", label: "Volume Designation", repeatable: true, mandatory: false, tips: ["Designação do volume."] },
                { code: "x", label: "ISSN of Series", repeatable: true, mandatory: false, tips: ["ISSN associado à série."] },
                { code: "y", label: "Standard Number of Multipart Monographic Resource", repeatable: true, mandatory: false, tips: ["Número padrão (ex.: ISBN, ISMN) da série."] },
                { code: "z", label: "Language of Parallel Title", repeatable: true, mandatory: false, tips: ["Código de língua do título paralelo."] },
                { code: "2", label: "Source", repeatable: false, mandatory: false, tips: ["Fonte codificada da língua se não ISO 639-2."] }
            ]
        },
        {
            tag: "411",
            name: "SUBSERIES",
            ind1Tips: ["# - Não definido"],
            ind2Tips: ["0 — Do not make a note", "1 — Make a note"],
            tips: [
                "O campo 411 é utilizado para criar uma ligação descendente de uma série para uma sub-série.",
                "Usado em registros de recursos contínuos (como séries) para indicar uma sub-série contida no título do recurso.",
                "Se o recurso que está sendo catalogado é uma sub-série e se deseja criar um link para a série principal, utiliza-se o campo 410.",
                "O segundo indicador especifica se uma nota deve ser gerada a partir do conteúdo deste campo."
            ],
            subFieldDef: [
                { code: "a", label: "Title", repeatable: false, mandatory: true, tips: ["Título da sub-série."] },
                { code: "d", label: "Parallel Title", repeatable: true, mandatory: false, tips: ["Título paralelo da sub-série em outra língua ou escrita."] },
                { code: "e", label: "Other Title Information", repeatable: true, mandatory: false, tips: ["Outras informações relacionadas ao título da sub-série."] },
                { code: "f", label: "First Statement of Responsibility", repeatable: true, mandatory: false, tips: ["Primeira declaração de responsabilidade associada à sub-série."] },
                { code: "g", label: "Subsequent Statement of Responsibility", repeatable: true, mandatory: false, tips: ["Declarações subsequentes de responsabilidade."] },
                { code: "h", label: "Number of Section or Part", repeatable: true, mandatory: false, tips: ["Número da secção ou parte da sub-série."] },
                { code: "i", label: "Name of Section or Part", repeatable: true, mandatory: false, tips: ["Nome da secção ou parte da sub-série."] },
                { code: "v", label: "Volume Designation", repeatable: true, mandatory: false, tips: ["Designação do volume na sub-série."] },
                { code: "x", label: "ISSN of Series", repeatable: true, mandatory: false, tips: ["ISSN da sub-série."] },
                { code: "y", label: "Standard Number of Multipart Monographic Resource", repeatable: true, mandatory: false, tips: ["Número padrão (ex.: ISBN) relacionado à sub-série."] },
                { code: "z", label: "Language of Parallel Title", repeatable: true, mandatory: false, tips: ["Código de idioma do título paralelo."] },
                { code: "2", label: "Source of Language Code", repeatable: false, mandatory: false, tips: ["Fonte do código de língua se não ISO 639-2."] }
            ]
        },
        {
            tag: "412",
            name: "SOURCE OF EXCERPT OR OFFPRINT",
            ind1Tips: ["# - Não definido"],
            ind2Tips: ["0 — Do not make a note", "1 — Make a note"],
            tips: [
                "O campo 412 é utilizado para identificar o recurso de onde foi extraído um excerto ou offprint.",
                "Este campo estabelece uma ligação descendente, apontando para o recurso original que foi fonte de conteúdo do recurso catalogado.",
                "O segundo indicador especifica se uma nota automática deve ser gerada a partir da informação fornecida."
            ],
            subFieldDef: [
                { code: "0", label: "Record Control Number", repeatable: false, mandatory: false, tips: ["Número de controlo do registo associado à fonte."] },
                { code: "t", label: "Title", repeatable: true, mandatory: true, tips: ["Título do recurso original que foi fonte do excerto ou offprint."] },
                { code: "a", label: "General Material Designation", repeatable: true, mandatory: false, tips: ["Designação geral do material do recurso fonte."] },
                { code: "b", label: "Other Title Information", repeatable: true, mandatory: false, tips: ["Outras informações relacionadas ao título do recurso fonte."] },
                { code: "f", label: "First Statement of Responsibility", repeatable: true, mandatory: false, tips: ["Primeira declaração de responsabilidade associada ao recurso fonte."] },
                { code: "g", label: "Subsequent Statement of Responsibility", repeatable: true, mandatory: false, tips: ["Declarações subsequentes de responsabilidade associadas ao recurso fonte."] },
                { code: "c", label: "Place of Publication", repeatable: true, mandatory: false, tips: ["Local de publicação do recurso fonte."] },
                { code: "n", label: "Name of Publisher, Distributor, etc.", repeatable: true, mandatory: false, tips: ["Nome do editor ou distribuidor do recurso fonte."] },
                { code: "d", label: "Date of Publication", repeatable: true, mandatory: false, tips: ["Data de publicação do recurso fonte."] },
                { code: "p", label: "Physical Description", repeatable: true, mandatory: false, tips: ["Descrição física do recurso fonte."] },
                { code: "v", label: "Volume Number", repeatable: true, mandatory: false, tips: ["Número de volume ou designação da parte no recurso fonte."] },
                { code: "x", label: "ISSN", repeatable: true, mandatory: false, tips: ["Número ISSN do recurso fonte, se aplicável."] }
            ]
        },
        {
            tag: "413",
            name: "EXCERPT OR OFFPRINT",
            ind1Tips: ["# - Não definido"],
            ind2Tips: ["0 — Do not make a note", "1 — Make a note"],
            tips: [
                "O campo 413 é usado para identificar um recurso associado que é um excerto ou offprint.",
                "Este campo estabelece uma ligação para o recurso do qual o item catalogado é extraído.",
                "O segundo indicador controla se uma nota deve ser gerada automaticamente a partir dos dados do campo."
            ],
            subFieldDef: [
                { code: "0", label: "Record Control Number", repeatable: false, mandatory: false, tips: ["Número de controlo do registo da fonte original."] },
                { code: "t", label: "Title", repeatable: true, mandatory: true, tips: ["Título do excerto ou offprint."] },
                { code: "a", label: "General Material Designation", repeatable: true, mandatory: false, tips: ["Designação geral do material (ex.: Texto impresso, manuscrito, etc.)."] },
                { code: "b", label: "Other Title Information", repeatable: true, mandatory: false, tips: ["Informações adicionais relacionadas ao título do excerto."] },
                { code: "f", label: "First Statement of Responsibility", repeatable: true, mandatory: false, tips: ["Primeira declaração de responsabilidade do recurso."] },
                { code: "g", label: "Subsequent Statement of Responsibility", repeatable: true, mandatory: false, tips: ["Declarações subsequentes de responsabilidade."] },
                { code: "c", label: "Place of Publication", repeatable: true, mandatory: false, tips: ["Local de publicação do excerto ou offprint."] },
                { code: "n", label: "Name of Publisher, Distributor, etc.", repeatable: true, mandatory: false, tips: ["Nome do editor, distribuidor ou entidade responsável pela publicação."] },
                { code: "d", label: "Date of Publication", repeatable: true, mandatory: false, tips: ["Data de publicação do excerto ou offprint."] },
                { code: "p", label: "Physical Description", repeatable: true, mandatory: false, tips: ["Descrição física (ex.: número de páginas, ilustrações)."] },
                { code: "v", label: "Volume Number", repeatable: true, mandatory: false, tips: ["Número de volume do excerto, se aplicável."] },
                { code: "x", label: "ISSN", repeatable: true, mandatory: false, tips: ["ISSN da publicação original, se existente."] }
            ]
        },
        {
            tag: "421",
            name: "SUPPLEMENT",
            ind1Tips: ["# - Não definido"],
            ind2Tips: ["0 — Do not make a note", "1 — Make a note"],
            tips: [
                "O campo 421 é usado para criar uma ligação do recurso catalogado a um suplemento relacionado.",
                "É utilizado em registos de recursos contínuos e em monografias para indicar um suplemento associado.",
                "Se necessário criar a relação inversa (do suplemento para o recurso principal), deve-se usar o campo 422."
            ],
            subFieldDef: [
                { code: "0", label: "Record Control Number", repeatable: false, mandatory: false, tips: ["Número de controlo do registo bibliográfico relacionado."] },
                { code: "t", label: "Title", repeatable: true, mandatory: true, tips: ["Título do suplemento."] },
                { code: "a", label: "General Material Designation", repeatable: true, mandatory: false, tips: ["Designação geral do material (ex.: texto impresso, gravação sonora)."] },
                { code: "b", label: "Other Title Information", repeatable: true, mandatory: false, tips: ["Outras informações sobre o título do suplemento."] },
                { code: "f", label: "First Statement of Responsibility", repeatable: true, mandatory: false, tips: ["Primeira declaração de responsabilidade."] },
                { code: "g", label: "Subsequent Statement of Responsibility", repeatable: true, mandatory: false, tips: ["Declarações subsequentes de responsabilidade."] },
                { code: "c", label: "Place of Publication", repeatable: true, mandatory: false, tips: ["Local de publicação do suplemento."] },
                { code: "n", label: "Name of Publisher, Distributor, etc.", repeatable: true, mandatory: false, tips: ["Nome do editor ou distribuidor."] },
                { code: "d", label: "Date of Publication", repeatable: true, mandatory: false, tips: ["Data de publicação do suplemento."] },
                { code: "p", label: "Physical Description", repeatable: true, mandatory: false, tips: ["Descrição física (ex.: número de páginas, ilustrações)."] },
                { code: "v", label: "Volume Number", repeatable: true, mandatory: false, tips: ["Número de volume associado."] },
                { code: "x", label: "ISSN", repeatable: true, mandatory: false, tips: ["Número ISSN do suplemento, se aplicável."] }
            ]
        },
        {
            tag: "422",
            name: "PARENT OF SUPPLEMENT",
            ind1Tips: ["# - Não definido"],
            ind2Tips: ["0 — Do not make a note", "1 — Make a note"],
            tips: [
                "O campo 422 é usado para criar uma ligação de um suplemento para o seu recurso principal (pai).",
                "Este campo é o inverso do campo 421 (SUPPLEMENT).",
                "O segundo indicador determina se uma nota deve ser gerada automaticamente a partir dos dados do campo."
            ],
            subFieldDef: [
                { code: "0", label: "Record Control Number", repeatable: false, mandatory: false, tips: ["Número de controlo do registo bibliográfico do recurso principal."] },
                { code: "t", label: "Title", repeatable: true, mandatory: true, tips: ["Título do recurso principal ao qual este suplemento está ligado."] },
                { code: "a", label: "General Material Designation", repeatable: true, mandatory: false, tips: ["Designação geral do material (ex.: Texto impresso, gravação sonora)."] },
                { code: "b", label: "Other Title Information", repeatable: true, mandatory: false, tips: ["Outras informações relacionadas ao título do recurso principal."] },
                { code: "f", label: "First Statement of Responsibility", repeatable: true, mandatory: false, tips: ["Primeira declaração de responsabilidade do recurso principal."] },
                { code: "g", label: "Subsequent Statement of Responsibility", repeatable: true, mandatory: false, tips: ["Declarações subsequentes de responsabilidade."] },
                { code: "c", label: "Place of Publication", repeatable: true, mandatory: false, tips: ["Local de publicação do recurso principal."] },
                { code: "n", label: "Name of Publisher, Distributor, etc.", repeatable: true, mandatory: false, tips: ["Nome do editor ou distribuidor do recurso principal."] },
                { code: "d", label: "Date of Publication", repeatable: true, mandatory: false, tips: ["Data de publicação do recurso principal."] },
                { code: "p", label: "Physical Description", repeatable: true, mandatory: false, tips: ["Descrição física do recurso principal."] },
                { code: "v", label: "Volume Number", repeatable: true, mandatory: false, tips: ["Número de volume, se aplicável."] },
                { code: "x", label: "ISSN", repeatable: true, mandatory: false, tips: ["Número ISSN do recurso principal, se aplicável."] }
            ]
        },
        {
            tag: "423",
            name: "ISSUED WITH",
            ind1Tips: ["# - Não definido"],
            ind2Tips: ["0 - Do not make a note", "1 - Make a note"],
            tips: [
                "O campo 423 é usado para criar uma ligação entre recursos publicados fisicamente juntos (ex.: um volume com múltiplas obras).",
                "Este campo estabelece uma relação de 'publicado com' entre registos.",
                "O segundo indicador controla se uma nota deve ser gerada automaticamente a partir dos dados do campo."
            ],
            subFieldDef: [
                { code: "0", label: "Record Control Number", repeatable: false, mandatory: false, tips: ["Número de controlo do registo bibliográfico do recurso relacionado."] },
                { code: "t", label: "Title", repeatable: true, mandatory: true, tips: ["Título do recurso publicado em conjunto."] },
                { code: "a", label: "General Material Designation", repeatable: true, mandatory: false, tips: ["Designação geral do material (ex.: Texto impresso, gravação sonora)."] },
                { code: "b", label: "Other Title Information", repeatable: true, mandatory: false, tips: ["Outras informações relacionadas ao título do recurso."] },
                { code: "f", label: "First Statement of Responsibility", repeatable: true, mandatory: false, tips: ["Primeira declaração de responsabilidade do recurso."] },
                { code: "g", label: "Subsequent Statement of Responsibility", repeatable: true, mandatory: false, tips: ["Declarações subsequentes de responsabilidade."] },
                { code: "c", label: "Place of Publication", repeatable: true, mandatory: false, tips: ["Local de publicação do recurso."] },
                { code: "n", label: "Name of Publisher, Distributor, etc.", repeatable: true, mandatory: false, tips: ["Nome do editor ou distribuidor do recurso."] },
                { code: "d", label: "Date of Publication", repeatable: true, mandatory: false, tips: ["Data de publicação do recurso."] },
                { code: "p", label: "Physical Description", repeatable: true, mandatory: false, tips: ["Descrição física do recurso."] },
                { code: "v", label: "Volume Number", repeatable: true, mandatory: false, tips: ["Número de volume, se aplicável."] },
                { code: "x", label: "ISSN", repeatable: true, mandatory: false, tips: ["Número ISSN do recurso, se aplicável."] },
                { code: "5", label: "Institution to Which Field Applies", repeatable: true, mandatory: false, tips: ["Código da instituição à qual o campo se aplica."] }
            ]
        },
        {
            tag: "424",
            name: "IS UPDATED BY",
            ind1Tips: ["# - Não definido"],
            ind2Tips: ["0 - Do not make a note", "1 - Make a note"],
            tips: [
                "O campo 424 é usado para indicar que um recurso contínuo (ex.: uma base de dados ou publicação online) é atualizado por outro recurso.",
                "Este campo estabelece uma relação de atualização dinâmica (o recurso atual é mantido ou substituído por uma versão mais recente).",
                "O segundo indicador controla se uma nota explicativa deve ser gerada automaticamente a partir dos dados do campo."
            ],
            subFieldDef: [
                { code: "0", label: "Record Control Number", repeatable: false, mandatory: false, tips: ["Número de controlo do registo bibliográfico do recurso que atualiza este registro."] },
                { code: "t", label: "Title", repeatable: true, mandatory: true, tips: ["Título do recurso que atualiza o recurso descrito neste registro."] },
                { code: "a", label: "General Material Designation", repeatable: true, mandatory: false, tips: ["Designação geral do material (ex.: Recurso eletrônico, publicação contínua)."] },
                { code: "b", label: "Other Title Information", repeatable: true, mandatory: false, tips: ["Outras informações relacionadas ao título do recurso atualizador."] },
                { code: "f", label: "First Statement of Responsibility", repeatable: true, mandatory: false, tips: ["Primeira declaração de responsabilidade do recurso atualizador."] },
                { code: "g", label: "Subsequent Statement of Responsibility", repeatable: true, mandatory: false, tips: ["Declarações subsequentes de responsabilidade."] },
                { code: "c", label: "Place of Publication", repeatable: true, mandatory: false, tips: ["Local de publicação do recurso atualizador."] },
                { code: "n", label: "Name of Publisher, Distributor, etc.", repeatable: true, mandatory: false, tips: ["Nome do editor ou distribuidor do recurso atualizador."] },
                { code: "d", label: "Date of Publication", repeatable: true, mandatory: false, tips: ["Data de publicação do recurso atualizador."] },
                { code: "p", label: "Physical Description", repeatable: true, mandatory: false, tips: ["Descrição física do recurso atualizador (se aplicável)."] },
                { code: "v", label: "Volume Number", repeatable: true, mandatory: false, tips: ["Número de volume, se aplicável."] },
                { code: "x", label: "ISSN", repeatable: true, mandatory: false, tips: ["Número ISSN do recurso atualizador, se aplicável."] },
                { code: "5", label: "Institution to Which Field Applies", repeatable: true, mandatory: false, tips: ["Código da instituição à qual o campo se aplica."] }
            ]
        },
        {
            tag: "425",
            name: "UPDATES",
            ind1Tips: ["# - Não definido"],
            ind2Tips: ["0 - Do not make a note", "1 - Make a note"],
            tips: [
                "O campo 425 é usado para indicar que um recurso atualiza outro recurso existente (relação inversa do campo 424).",
                "Este campo estabelece uma relação de atualização, onde o recurso descrito no registro atualiza outro recurso.",
                "O segundo indicador controla se uma nota explicativa deve ser gerada automaticamente a partir dos dados do campo.",
                "Este campo é o inverso do campo 424 (IS UPDATED BY)."
            ],
            subFieldDef: [
                { code: "0", label: "Record Control Number", repeatable: false, mandatory: false, tips: ["Número de controlo do registo bibliográfico do recurso que é atualizado por este registro."] },
                { code: "t", label: "Title", repeatable: true, mandatory: true, tips: ["Título do recurso que é atualizado pelo recurso descrito neste registro."] },
                { code: "a", label: "General Material Designation", repeatable: true, mandatory: false, tips: ["Designação geral do material do recurso atualizado (ex.: Recurso eletrônico, publicação contínua)."] },
                { code: "b", label: "Other Title Information", repeatable: true, mandatory: false, tips: ["Outras informações relacionadas ao título do recurso atualizado."] },
                { code: "f", label: "First Statement of Responsibility", repeatable: true, mandatory: false, tips: ["Primeira declaração de responsabilidade do recurso atualizado."] },
                { code: "g", label: "Subsequent Statement of Responsibility", repeatable: true, mandatory: false, tips: ["Declarações subsequentes de responsabilidade do recurso atualizado."] },
                { code: "c", label: "Place of Publication", repeatable: true, mandatory: false, tips: ["Local de publicação do recurso atualizado."] },
                { code: "n", label: "Name of Publisher, Distributor, etc.", repeatable: true, mandatory: false, tips: ["Nome do editor ou distribuidor do recurso atualizado."] },
                { code: "d", label: "Date of Publication", repeatable: true, mandatory: false, tips: ["Data de publicação do recurso atualizado."] },
                { code: "p", label: "Physical Description", repeatable: true, mandatory: false, tips: ["Descrição física do recurso atualizado (se aplicável)."] },
                { code: "v", label: "Volume Number", repeatable: true, mandatory: false, tips: ["Número de volume do recurso atualizado, se aplicável."] },
                { code: "x", label: "ISSN", repeatable: true, mandatory: false, tips: ["Número ISSN do recurso atualizado, se aplicável."] },
                { code: "5", label: "Institution to Which Field Applies", repeatable: true, mandatory: false, tips: ["Código da instituição à qual o campo se aplica."] }
            ]
        },
        {
            tag: "430",
            name: "CONTINUES",
            ind1Tips: ["# - Não definido"],
            ind2Tips: ["0 - Do not make a note", "1 - Make a note"],
            tips: [
                "O campo 430 é usado para indicar que um recurso continua (em parte ou no todo) outro recurso anterior.",
                "Este campo estabelece uma relação de continuidade bibliográfica, onde o recurso descrito no registro é a continuação direta de outro recurso.",
                "O segundo indicador controla se uma nota explicativa deve ser gerada automaticamente a partir dos dados do campo.",
                "Este campo tem como inverso o campo 440 (CONTINUED BY)."
            ],
            subFieldDef: [
                { code: "0", label: "Record Control Number", repeatable: false, mandatory: false, tips: ["Número de controlo do registo bibliográfico do recurso anterior que é continuado por este registro."] },
                { code: "t", label: "Title", repeatable: true, mandatory: true, tips: ["Título do recurso anterior que é continuado pelo recurso descrito neste registro."] },
                { code: "a", label: "General Material Designation", repeatable: true, mandatory: false, tips: ["Designação geral do material do recurso anterior (ex.: Texto impresso, publicação seriada)."] },
                { code: "b", label: "Other Title Information", repeatable: true, mandatory: false, tips: ["Outras informações relacionadas ao título do recurso anterior."] },
                { code: "f", label: "First Statement of Responsibility", repeatable: true, mandatory: false, tips: ["Primeira declaração de responsabilidade do recurso anterior."] },
                { code: "g", label: "Subsequent Statement of Responsibility", repeatable: true, mandatory: false, tips: ["Declarações subsequentes de responsabilidade do recurso anterior."] },
                { code: "c", label: "Place of Publication", repeatable: true, mandatory: false, tips: ["Local de publicação do recurso anterior."] },
                { code: "n", label: "Name of Publisher, Distributor, etc.", repeatable: true, mandatory: false, tips: ["Nome do editor ou distribuidor do recurso anterior."] },
                { code: "d", label: "Date of Publication", repeatable: true, mandatory: false, tips: ["Data de publicação do recurso anterior."] },
                { code: "p", label: "Physical Description", repeatable: true, mandatory: false, tips: ["Descrição física do recurso anterior (se aplicável)."] },
                { code: "v", label: "Volume Number", repeatable: true, mandatory: false, tips: ["Número de volume do recurso anterior, se aplicável."] },
                { code: "x", label: "ISSN", repeatable: true, mandatory: false, tips: ["Número ISSN do recurso anterior, se aplicável."] },
                { code: "y", label: "CODEN", repeatable: true, mandatory: false, tips: ["Código CODEN do recurso anterior, se aplicável."] },
                { code: "z", label: "ISBN", repeatable: true, mandatory: false, tips: ["Número ISBN do recurso anterior, se aplicável."] },
                { code: "5", label: "Institution to Which Field Applies", repeatable: true, mandatory: false, tips: ["Código da instituição à qual o campo se aplica."] },
                { code: "6", label: "Interfield Linking Data", repeatable: false, mandatory: false, tips: ["Dados de ligação entre campos."] }
            ]
        },
        {
            tag: "431",
            name: "CONTINUES IN PART",
            ind1Tips: ["# - Não definido"],
            ind2Tips: ["0 - Do not make a note", "1 - Make a note"],
            tips: [
                "O campo 431 é usado para indicar que um recurso continua parcialmente outro recurso anterior.",
                "Este campo estabelece uma relação de continuidade parcial, onde o recurso descrito no registro é a continuação de apenas uma parte de outro recurso.",
                "Diferente do campo 430 (CONTINUES) que indica continuidade total, este campo especifica que apenas uma parte do recurso anterior foi continuada.",
                "O segundo indicador controla se uma nota explicativa deve ser gerada automaticamente a partir dos dados do campo.",
                "Este campo tem como inverso o campo 441 (CONTINUED IN PART BY)."
            ],
            subFieldDef: [
                { code: "0", label: "Record Control Number", repeatable: false, mandatory: false, tips: ["Número de controlo do registo bibliográfico do recurso anterior que é parcialmente continuado por este registro."] },
                { code: "t", label: "Title", repeatable: true, mandatory: true, tips: ["Título do recurso anterior que é parcialmente continuado pelo recurso descrito neste registro."] },
                { code: "a", label: "General Material Designation", repeatable: true, mandatory: false, tips: ["Designação geral do material do recurso anterior (ex.: Texto impresso, publicação seriada)."] },
                { code: "b", label: "Other Title Information", repeatable: true, mandatory: false, tips: ["Outras informações relacionadas ao título do recurso anterior."] },
                { code: "f", label: "First Statement of Responsibility", repeatable: true, mandatory: false, tips: ["Primeira declaração de responsabilidade do recurso anterior."] },
                { code: "g", label: "Subsequent Statement of Responsibility", repeatable: true, mandatory: false, tips: ["Declarações subsequentes de responsabilidade do recurso anterior."] },
                { code: "h", label: "Number of Part/Section", repeatable: true, mandatory: false, tips: ["Número ou identificação da parte/seção específica que está sendo continuada."] },
                { code: "i", label: "Name of Part/Section", repeatable: true, mandatory: false, tips: ["Nome da parte/seção específica que está sendo continuada."] },
                { code: "c", label: "Place of Publication", repeatable: true, mandatory: false, tips: ["Local de publicação do recurso anterior."] },
                { code: "n", label: "Name of Publisher, Distributor, etc.", repeatable: true, mandatory: false, tips: ["Nome do editor ou distribuidor do recurso anterior."] },
                { code: "d", label: "Date of Publication", repeatable: true, mandatory: false, tips: ["Data de publicação do recurso anterior."] },
                { code: "p", label: "Physical Description", repeatable: true, mandatory: false, tips: ["Descrição física do recurso anterior (se aplicável)."] },
                { code: "v", label: "Volume Number", repeatable: true, mandatory: false, tips: ["Número de volume do recurso anterior, se aplicável."] },
                { code: "x", label: "ISSN", repeatable: true, mandatory: false, tips: ["Número ISSN do recurso anterior, se aplicável."] },
                { code: "y", label: "CODEN", repeatable: true, mandatory: false, tips: ["Código CODEN do recurso anterior, se aplicável."] },
                { code: "z", label: "ISBN", repeatable: true, mandatory: false, tips: ["Número ISBN do recurso anterior, se aplicável."] },
                { code: "5", label: "Institution to Which Field Applies", repeatable: true, mandatory: false, tips: ["Código da instituição à qual o campo se aplica."] },
                { code: "6", label: "Interfield Linking Data", repeatable: false, mandatory: false, tips: ["Dados de ligação entre campos."] }
            ]
        },
        {
            tag: "432",
            name: "SUPERSEDES",
            ind1Tips: ["# - Não definido"],
            ind2Tips: ["0 - Do not make a note", "1 - Make a note"],
            tips: [
                "O campo 432 é usado para indicar que um recurso substitui (completamente) outro recurso anterior.",
                "Este campo estabelece uma relação de substituição total, onde o recurso descrito no registro toma o lugar de outro recurso, que é descontinuado.",
                "Diferente de campos de continuidade (430, 431), este indica uma substituição completa que pode envolver mudanças significativas no conteúdo ou formato.",
                "O segundo indicador controla se uma nota explicativa deve ser gerada automaticamente a partir dos dados do campo.",
                "Este campo tem como inverso o campo 442 (SUPERSEDED BY)."
            ],
            subFieldDef: [
                { code: "0", label: "Record Control Number", repeatable: false, mandatory: false, tips: ["Número de controlo do registo bibliográfico do recurso substituído por este registro."] },
                { code: "t", label: "Title", repeatable: true, mandatory: true, tips: ["Título do recurso substituído pelo recurso descrito neste registro."] },
                { code: "a", label: "General Material Designation", repeatable: true, mandatory: false, tips: ["Designação geral do material do recurso substituído (ex.: Texto impresso, recurso eletrônico)."] },
                { code: "b", label: "Other Title Information", repeatable: true, mandatory: false, tips: ["Outras informações relacionadas ao título do recurso substituído."] },
                { code: "f", label: "First Statement of Responsibility", repeatable: true, mandatory: false, tips: ["Primeira declaração de responsabilidade do recurso substituído."] },
                { code: "g", label: "Subsequent Statement of Responsibility", repeatable: true, mandatory: false, tips: ["Declarações subsequentes de responsabilidade do recurso substituído."] },
                { code: "c", label: "Place of Publication", repeatable: true, mandatory: false, tips: ["Local de publicação do recurso substituído."] },
                { code: "n", label: "Name of Publisher, Distributor, etc.", repeatable: true, mandatory: false, tips: ["Nome do editor ou distribuidor do recurso substituído."] },
                { code: "d", label: "Date of Publication", repeatable: true, mandatory: false, tips: ["Data de publicação do recurso substituído."] },
                { code: "p", label: "Physical Description", repeatable: true, mandatory: false, tips: ["Descrição física do recurso substituído (se aplicável)."] },
                { code: "v", label: "Volume Number", repeatable: true, mandatory: false, tips: ["Número de volume do recurso substituído, se aplicável."] },
                { code: "x", label: "ISSN", repeatable: true, mandatory: false, tips: ["Número ISSN do recurso substituído, se aplicável."] },
                { code: "y", label: "CODEN", repeatable: true, mandatory: false, tips: ["Código CODEN do recurso substituído, se aplicável."] },
                { code: "z", label: "ISBN", repeatable: true, mandatory: false, tips: ["Número ISBN do recurso substituído, se aplicável."] },
                { code: "5", label: "Institution to Which Field Applies", repeatable: true, mandatory: false, tips: ["Código da instituição à qual o campo se aplica."] },
                { code: "6", label: "Interfield Linking Data", repeatable: false, mandatory: false, tips: ["Dados de ligação entre campos."] }
            ]
        },
        {
            tag: "433",
            name: "SUPERSEDES IN PART",
            ind1Tips: ["# - Não definido"],
            ind2Tips: ["0 - Do not make a note", "1 - Make a note"],
            tips: [
                "O campo 433 é usado para indicar que um recurso substitui parcialmente outro recurso anterior.",
                "Este campo estabelece uma relação de substituição parcial, onde o recurso descrito no registro toma o lugar de apenas uma parte de outro recurso, que pode continuar a existir para outras partes.",
                "Diferente do campo 432 (SUPERSEDES) que indica substituição total, este campo especifica que apenas uma parte do recurso anterior foi substituída.",
                "O segundo indicador controla se uma nota explicativa deve ser gerada automaticamente a partir dos dados do campo.",
                "Este campo tem como inverso o campo 443 (SUPERSEDED IN PART BY).",
                "Usado frequentemente para publicações seriadas ou recursos integrados onde apenas um componente é substituído."
            ],
            subFieldDef: [
                { code: "0", label: "Record Control Number", repeatable: false, mandatory: false, tips: ["Número de controlo do registo bibliográfico do recurso parcialmente substituído por este registro."] },
                { code: "t", label: "Title", repeatable: true, mandatory: true, tips: ["Título do recurso parcialmente substituído pelo recurso descrito neste registro."] },
                { code: "a", label: "General Material Designation", repeatable: true, mandatory: false, tips: ["Designação geral do material do recurso substituído (ex.: Texto impresso, recurso eletrônico)."] },
                { code: "b", label: "Other Title Information", repeatable: true, mandatory: false, tips: ["Outras informações relacionadas ao título do recurso substituído."] },
                { code: "f", label: "First Statement of Responsibility", repeatable: true, mandatory: false, tips: ["Primeira declaração de responsabilidade do recurso substituído."] },
                { code: "g", label: "Subsequent Statement of Responsibility", repeatable: true, mandatory: false, tips: ["Declarações subsequentes de responsabilidade do recurso substituído."] },
                { code: "h", label: "Number of Part/Section", repeatable: true, mandatory: false, tips: ["Número ou identificação da parte/seção específica que está sendo substituída."] },
                { code: "i", label: "Name of Part/Section", repeatable: true, mandatory: false, tips: ["Nome da parte/seção específica que está sendo substituída."] },
                { code: "c", label: "Place of Publication", repeatable: true, mandatory: false, tips: ["Local de publicação do recurso substituído."] },
                { code: "n", label: "Name of Publisher, Distributor, etc.", repeatable: true, mandatory: false, tips: ["Nome do editor ou distribuidor do recurso substituído."] },
                { code: "d", label: "Date of Publication", repeatable: true, mandatory: false, tips: ["Data de publicação do recurso substituído."] },
                { code: "p", label: "Physical Description", repeatable: true, mandatory: false, tips: ["Descrição física do recurso substituído (se aplicável)."] },
                { code: "v", label: "Volume Number", repeatable: true, mandatory: false, tips: ["Número de volume do recurso substituído, se aplicável."] },
                { code: "x", label: "ISSN", repeatable: true, mandatory: false, tips: ["Número ISSN do recurso substituído, se aplicável."] },
                { code: "y", label: "CODEN", repeatable: true, mandatory: false, tips: ["Código CODEN do recurso substituído, se aplicável."] },
                { code: "z", label: "ISBN", repeatable: true, mandatory: false, tips: ["Número ISBN do recurso substituído, se aplicável."] },
                { code: "5", label: "Institution to Which Field Applies", repeatable: true, mandatory: false, tips: ["Código da instituição à qual o campo se aplica."] },
                { code: "6", label: "Interfield Linking Data", repeatable: false, mandatory: false, tips: ["Dados de ligação entre campos."] }
            ]
        },
        {
            tag: "434",
            name: "ABSORBED",
            ind1Tips: ["# - Não definido"],
            ind2Tips: ["0 - Do not make a note", "1 - Make a note"],
            tips: [
                "O campo 434 é usado para indicar que um recurso absorveu (incorporou) outro recurso anterior, que deixou de ser publicado separadamente.",
                "Este campo estabelece uma relação de absorção, onde o recurso descrito no registro incorpora o conteúdo de outro recurso que é descontinuado.",
                "Diferente de substituição (432), aqui o recurso original é incorporado/integrado no novo recurso.",
                "O segundo indicador controla se uma nota explicativa deve ser gerada automaticamente a partir dos dados do campo.",
                "Este campo tem como inverso o campo 444 (ABSORBED BY).",
                "Usado frequentemente para publicações seriadas que são fundidas/incorporadas."
            ],
            subFieldDef: [
                { code: "0", label: "Record Control Number", repeatable: false, mandatory: false, tips: ["Número de controlo do registo bibliográfico do recurso absorvido por este registro."] },
                { code: "t", label: "Title", repeatable: true, mandatory: true, tips: ["Título do recurso absorvido pelo recurso descrito neste registro."] },
                { code: "a", label: "General Material Designation", repeatable: true, mandatory: false, tips: ["Designação geral do material do recurso absorvido (ex.: Texto impresso, publicação seriada)."] },
                { code: "b", label: "Other Title Information", repeatable: true, mandatory: false, tips: ["Outras informações relacionadas ao título do recurso absorvido."] },
                { code: "f", label: "First Statement of Responsibility", repeatable: true, mandatory: false, tips: ["Primeira declaração de responsabilidade do recurso absorvido."] },
                { code: "g", label: "Subsequent Statement of Responsibility", repeatable: true, mandatory: false, tips: ["Declarações subsequentes de responsabilidade do recurso absorvido."] },
                { code: "h", label: "Number of Part/Section", repeatable: true, mandatory: false, tips: ["Número da parte/seção absorvida, se aplicável."] },
                { code: "i", label: "Name of Part/Section", repeatable: true, mandatory: false, tips: ["Nome da parte/seção absorvida, se aplicável."] },
                { code: "c", label: "Place of Publication", repeatable: true, mandatory: false, tips: ["Local de publicação do recurso absorvido."] },
                { code: "n", label: "Name of Publisher, Distributor, etc.", repeatable: true, mandatory: false, tips: ["Nome do editor ou distribuidor do recurso absorvido."] },
                { code: "d", label: "Date of Publication", repeatable: true, mandatory: false, tips: ["Data de publicação do recurso absorvido."] },
                { code: "p", label: "Physical Description", repeatable: true, mandatory: false, tips: ["Descrição física do recurso absorvido (se aplicável)."] },
                { code: "v", label: "Volume Number", repeatable: true, mandatory: false, tips: ["Número de volume do recurso absorvido, se aplicável."] },
                { code: "x", label: "ISSN", repeatable: true, mandatory: false, tips: ["Número ISSN do recurso absorvido, se aplicável."] },
                { code: "y", label: "CODEN", repeatable: true, mandatory: false, tips: ["Código CODEN do recurso absorvido, se aplicável."] },
                { code: "z", label: "ISBN", repeatable: true, mandatory: false, tips: ["Número ISBN do recurso absorvido, se aplicável."] },
                { code: "5", label: "Institution to Which Field Applies", repeatable: true, mandatory: false, tips: ["Código da instituição à qual o campo se aplica."] },
                { code: "6", label: "Interfield Linking Data", repeatable: false, mandatory: false, tips: ["Dados de ligação entre campos."] }
            ]
        },
        {
            tag: "435",
            name: "ABSORBED IN PART",
            ind1Tips: ["# - Não definido"],
            ind2Tips: ["0 - Do not make a note", "1 - Make a note"],
            tips: [
                "O campo 435 é usado para indicar que um recurso absorveu parcialmente (incorporou em parte) outro recurso anterior.",
                "Este campo estabelece uma relação de absorção parcial, onde o recurso descrito no registro incorpora apenas parte do conteúdo de outro recurso, que pode continuar a existir para outras partes.",
                "Diferente do campo 434 (ABSORBED) que indica absorção total, este especifica que apenas uma parte do recurso anterior foi absorvida.",
                "O segundo indicador controla se uma nota explicativa deve ser gerada automaticamente a partir dos dados do campo.",
                "Este campo tem como inverso o campo 445 (ABSORBED IN PART BY).",
                "Usado quando apenas seções ou partes específicas de uma publicação são incorporadas em outro recurso."
            ],
            subFieldDef: [
                { code: "0", label: "Record Control Number", repeatable: false, mandatory: false, tips: ["Número de controlo do registo bibliográfico do recurso parcialmente absorvido por este registro."] },
                { code: "t", label: "Title", repeatable: true, mandatory: true, tips: ["Título do recurso parcialmente absorvido pelo recurso descrito neste registro."] },
                { code: "a", label: "General Material Designation", repeatable: true, mandatory: false, tips: ["Designação geral do material do recurso absorvido (ex.: Texto impresso, publicação seriada)."] },
                { code: "b", label: "Other Title Information", repeatable: true, mandatory: false, tips: ["Outras informações relacionadas ao título do recurso absorvido."] },
                { code: "f", label: "First Statement of Responsibility", repeatable: true, mandatory: false, tips: ["Primeira declaração de responsabilidade do recurso absorvido."] },
                { code: "g", label: "Subsequent Statement of Responsibility", repeatable: true, mandatory: false, tips: ["Declarações subsequentes de responsabilidade do recurso absorvido."] },
                { code: "h", label: "Number of Part/Section", repeatable: true, mandatory: true, tips: ["Número ou identificação da parte/seção específica que foi absorvida."] },
                { code: "i", label: "Name of Part/Section", repeatable: true, mandatory: true, tips: ["Nome da parte/seção específica que foi absorvida."] },
                { code: "c", label: "Place of Publication", repeatable: true, mandatory: false, tips: ["Local de publicação do recurso absorvido."] },
                { code: "n", label: "Name of Publisher, Distributor, etc.", repeatable: true, mandatory: false, tips: ["Nome do editor ou distribuidor do recurso absorvido."] },
                { code: "d", label: "Date of Publication", repeatable: true, mandatory: false, tips: ["Data de publicação do recurso absorvido."] },
                { code: "p", label: "Physical Description", repeatable: true, mandatory: false, tips: ["Descrição física do recurso absorvido (se aplicável)."] },
                { code: "v", label: "Volume Number", repeatable: true, mandatory: false, tips: ["Número de volume do recurso absorvido, se aplicável."] },
                { code: "x", label: "ISSN", repeatable: true, mandatory: false, tips: ["Número ISSN do recurso absorvido, se aplicável."] },
                { code: "y", label: "CODEN", repeatable: true, mandatory: false, tips: ["Código CODEN do recurso absorvido, se aplicável."] },
                { code: "z", label: "ISBN", repeatable: true, mandatory: false, tips: ["Número ISBN do recurso absorvido, se aplicável."] },
                { code: "5", label: "Institution to Which Field Applies", repeatable: true, mandatory: false, tips: ["Código da instituição à qual o campo se aplica."] },
                { code: "6", label: "Interfield Linking Data", repeatable: false, mandatory: false, tips: ["Dados de ligação entre campos."] }
            ]
        },
        {
            tag: "437",
            name: "SEPARATED FROM",
            ind1Tips: ["# - Não definido"],
            ind2Tips: ["0 - Do not make a note", "1 - Make a note"],
            tips: [
                "O campo 437 é usado para indicar que um recurso foi separado/desmembrado de outro recurso anterior.",
                "Este campo estabelece uma relação de separação, onde o recurso descrito no registro era originalmente parte de outro recurso.",
                "Diferente dos campos de absorção (434-435), aqui o foco é no desmembramento de parte de um recurso para formar um novo recurso independente.",
                "O segundo indicador controla se uma nota explicativa deve ser gerada automaticamente a partir dos dados do campo.",
                "Este campo tem como inverso o campo 447 (HAS SEPARATED PART).",
                "Usado quando partes de publicações se tornam independentes, mantendo relação com a publicação original."
            ],
            subFieldDef: [
                { code: "0", label: "Record Control Number", repeatable: false, mandatory: false, tips: ["Número de controlo do registo bibliográfico do recurso original do qual este foi separado."] },
                { code: "t", label: "Title", repeatable: true, mandatory: true, tips: ["Título do recurso original do qual este recurso foi separado."] },
                { code: "a", label: "General Material Designation", repeatable: true, mandatory: false, tips: ["Designação geral do material do recurso original (ex.: Texto impresso, publicação seriada)."] },
                { code: "b", label: "Other Title Information", repeatable: true, mandatory: false, tips: ["Outras informações relacionadas ao título do recurso original."] },
                { code: "f", label: "First Statement of Responsibility", repeatable: true, mandatory: false, tips: ["Primeira declaração de responsabilidade do recurso original."] },
                { code: "g", label: "Subsequent Statement of Responsibility", repeatable: true, mandatory: false, tips: ["Declarações subsequentes de responsabilidade do recurso original."] },
                { code: "h", label: "Number of Part/Section", repeatable: true, mandatory: true, tips: ["Número ou identificação da parte/seção que foi separada para formar este recurso."] },
                { code: "i", label: "Name of Part/Section", repeatable: true, mandatory: true, tips: ["Nome da parte/seção que foi separada para formar este recurso."] },
                { code: "c", label: "Place of Publication", repeatable: true, mandatory: false, tips: ["Local de publicação do recurso original."] },
                { code: "n", label: "Name of Publisher, Distributor, etc.", repeatable: true, mandatory: false, tips: ["Nome do editor ou distribuidor do recurso original."] },
                { code: "d", label: "Date of Publication", repeatable: true, mandatory: false, tips: ["Data de publicação do recurso original."] },
                { code: "p", label: "Physical Description", repeatable: true, mandatory: false, tips: ["Descrição física do recurso original (se aplicável)."] },
                { code: "v", label: "Volume Number", repeatable: true, mandatory: false, tips: ["Número de volume do recurso original, se aplicável."] },
                { code: "x", label: "ISSN", repeatable: true, mandatory: false, tips: ["Número ISSN do recurso original, se aplicável."] },
                { code: "y", label: "CODEN", repeatable: true, mandatory: false, tips: ["Código CODEN do recurso original, se aplicável."] },
                { code: "z", label: "ISBN", repeatable: true, mandatory: false, tips: ["Número ISBN do recurso original, se aplicável."] },
                { code: "5", label: "Institution to Which Field Applies", repeatable: true, mandatory: false, tips: ["Código da instituição à qual o campo se aplica."] },
                { code: "6", label: "Interfield Linking Data", repeatable: false, mandatory: false, tips: ["Dados de ligação entre campos."] }
            ]
        },
        {
            tag: "436",
            name: "FORMED BY MERGER OF ..., ..., AND ...",
            ind1Tips: ["# - Não definido"],
            ind2Tips: ["0 - Do not make a note", "1 - Make a note"],
            tips: [
                "O campo 436 é usado para indicar que um recurso foi formado pela fusão de dois ou mais recursos anteriores.",
                "Este campo estabelece uma relação de fusão bibliográfica, onde o recurso descrito no registro resulta da combinação de múltiplos recursos que deixaram de ser publicados separadamente.",
                "Diferente dos campos de absorção (434-435), aqui todos os recursos originais são descontinuados para formar um novo recurso.",
                "O segundo indicador controla se uma nota explicativa deve ser gerada automaticamente a partir dos dados do campo.",
                "Este campo tem como inverso o campo 446 (MERGER TO FORM ...).",
                "Usado quando várias publicações são combinadas para formar uma nova publicação com identidade própria."
            ],
            "subFieldDef": [
                { code: "0", label: "Record Control Number", repeatable: true, mandatory: false, tips: ["Números de controlo dos registos bibliográficos dos recursos fundidos para formar este registro."] },
                { code: "t", label: "Title", repeatable: true, mandatory: true, tips: ["Títulos dos recursos que foram fundidos para formar este recurso."] },
                { code: "a", label: "General Material Designation", repeatable: true, mandatory: false, tips: ["Designação geral do material dos recursos fundidos (ex.: Texto impresso, publicação seriada)."] },
                { code: "b", label: "Other Title Information", repeatable: true, mandatory: false, tips: ["Outras informações relacionadas aos títulos dos recursos fundidos."] },
                { code: "f", label: "First Statement of Responsibility", repeatable: true, mandatory: false, tips: ["Primeiras declarações de responsabilidade dos recursos fundidos."] },
                { code: "g", label: "Subsequent Statement of Responsibility", repeatable: true, mandatory: false, tips: ["Declarações subsequentes de responsabilidade dos recursos fundidos."] },
                { code: "c", label: "Place of Publication", repeatable: true, mandatory: false, tips: ["Locais de publicação dos recursos fundidos."] },
                { code: "n", label: "Name of Publisher, Distributor, etc.", repeatable: true, mandatory: false, tips: ["Nomes dos editores ou distribuidores dos recursos fundidos."] },
                { code: "d", label: "Date of Publication", repeatable: true, mandatory: false, tips: ["Datas de publicação dos recursos fundidos."] },
                { code: "p", label: "Physical Description", repeatable: true, mandatory: false, tips: ["Descrições físicas dos recursos fundidos (se aplicável)."] },
                { code: "v", label: "Volume Number", repeatable: true, mandatory: false, tips: ["Números de volume dos recursos fundidos, se aplicável."] },
                { code: "x", label: "ISSN", repeatable: true, mandatory: false, tips: ["Números ISSN dos recursos fundidos, se aplicável."] },
                { code: "y", label: "CODEN", repeatable: true, mandatory: false, tips: ["Códigos CODEN dos recursos fundidos, se aplicável."] },
                { code: "z", label: "ISBN", repeatable: true, mandatory: false, tips: ["Números ISBN dos recursos fundidos, se aplicável."] },
                { code: "5", label: "Institution to Which Field Applies", repeatable: true, mandatory: false, tips: ["Código da instituição à qual o campo se aplica."] },
                { code: "6", label: "Interfield Linking Data", repeatable: false, mandatory: false, tips: ["Dados de ligação entre campos."] }
            ]
        },
        {
            tag: "440",
            name: "CONTINUED BY",
            ind1Tips: ["# - Não definido"],
            ind2Tips: ["0 - Do not make a note", "1 - Make a note"],
            tips: [
                "O campo 440 é usado para indicar que um recurso é continuado por outro recurso posterior.",
                "Este campo estabelece uma relação de continuidade bibliográfica, onde o recurso descrito no registro é sucedido por outro recurso.",
                "Diferente dos campos de absorção ou fusão, aqui há uma sucessão direta entre recursos.",
                "O segundo indicador controla se uma nota explicativa deve ser gerada automaticamente a partir dos dados do campo.",
                "Este campo é o inverso do campo 430 (CONTINUES).",
                "Usado quando uma publicação é substituída por outra com novo título, mas mantendo continuidade lógica."
            ],
            subFieldDef: [
                { code: "0", label: "Record Control Number", repeatable: false, mandatory: false, tips: ["Número de controlo do registo bibliográfico do recurso que continua este registro."] },
                { code: "t", label: "Title", repeatable: true, mandatory: true, tips: ["Título do recurso que continua o recurso descrito neste registro."] },
                { code: "a", label: "General Material Designation", repeatable: true, mandatory: false, tips: ["Designação geral do material do recurso subsequente."] },
                { code: "b", label: "Other Title Information", repeatable: true, mandatory: false, tips: ["Outras informações relacionadas ao título do recurso subsequente."] },
                { code: "f", label: "First Statement of Responsibility", repeatable: true, mandatory: false, tips: ["Primeira declaração de responsabilidade do recurso subsequente."] },
                { code: "g", label: "Subsequent Statement of Responsibility", repeatable: true, mandatory: false, tips: ["Declarações subsequentes de responsabilidade do recurso subsequente."] },
                { code: "c", label: "Place of Publication", repeatable: true, mandatory: false, tips: ["Local de publicação do recurso subsequente."] },
                { code: "n", label: "Name of Publisher, Distributor, etc.", repeatable: true, mandatory: false, tips: ["Nome do editor ou distribuidor do recurso subsequente."] },
                { code: "d", label: "Date of Publication", repeatable: true, mandatory: false, tips: ["Data de publicação do recurso subsequente."] },
                { code: "p", label: "Physical Description", repeatable: true, mandatory: false, tips: ["Descrição física do recurso subsequente (se aplicável)."] },
                { code: "v", label: "Volume Number", repeatable: true, mandatory: false, tips: ["Número de volume do recurso subsequente, se aplicável."] },
                { code: "x", label: "ISSN", repeatable: true, mandatory: false, tips: ["Número ISSN do recurso subsequente, se aplicável."] },
                { code: "y", label: "CODEN", repeatable: true, mandatory: false, tips: ["Código CODEN do recurso subsequente, se aplicável."] },
                { code: "z", label: "ISBN", repeatable: true, mandatory: false, tips: ["Número ISBN do recurso subsequente, se aplicável."] },
                { code: "5", label: "Institution to Which Field Applies", repeatable: true, mandatory: false, tips: ["Código da instituição à qual o campo se aplica."] },
                { code: "6", label: "Interfield Linking Data", repeatable: false, mandatory: false, tips: ["Dados de ligação entre campos."] }
            ]
        },
        {
            tag: "441",
            name: "CONTINUED IN PART BY",
            ind1Tips: ["# - Não definido"],
            ind2Tips: ["0 - Do not make a note", "1 - Make a note"],
            tips: [
                "O campo 441 é usado para indicar que parte do conteúdo de um recurso é continuado por outro recurso posterior.",
                "Este campo estabelece uma relação de continuidade parcial, onde apenas uma seção ou parte do recurso descrito no registro é continuada por outro recurso.",
                "Diferente do campo 440 (CONTINUED BY) que indica continuidade total, este especifica que apenas parte do conteúdo foi continuada.",
                "O segundo indicador controla se uma nota explicativa deve ser gerada automaticamente a partir dos dados do campo.",
                "Este campo é o inverso do campo 431 (CONTINUES IN PART).",
                "Usado quando apenas uma seção ou parte específica de uma publicação é continuada como publicação independente."
            ],
            subFieldDef: [
                { code: "0", label: "Record Control Number", repeatable: false, mandatory: false, tips: ["Número de controlo do registo bibliográfico do recurso que continua parte deste registro."] },
                { code: "t", label: "Title", repeatable: true, mandatory: true, tips: ["Título do recurso que continua parte do conteúdo descrito neste registro."] },
                { code: "a", label: "General Material Designation", repeatable: true, mandatory: false, tips: ["Designação geral do material do recurso continuador."] },
                { code: "b", label: "Other Title Information", repeatable: true, mandatory: false, tips: ["Outras informações relacionadas ao título do recurso continuador."] },
                { code: "f", label: "First Statement of Responsibility", repeatable: true, mandatory: false, tips: ["Primeira declaração de responsabilidade do recurso continuador."] },
                { code: "g", label: "Subsequent Statement of Responsibility", repeatable: true, mandatory: false, tips: ["Declarações subsequentes de responsabilidade do recurso continuador."] },
                { code: "h", label: "Number of Part/Section", repeatable: true, mandatory: true, tips: ["Número ou identificação da parte/seção que foi continuada pelo novo recurso."] },
                { code: "i", label: "Name of Part/Section", repeatable: true, mandatory: true, tips: ["Nome da parte/seção que foi continuada pelo novo recurso."] },
                { code: "c", label: "Place of Publication", repeatable: true, mandatory: false, tips: ["Local de publicação do recurso continuador."] },
                { code: "n", label: "Name of Publisher, Distributor, etc.", repeatable: true, mandatory: false, tips: ["Nome do editor ou distribuidor do recurso continuador."] },
                { code: "d", label: "Date of Publication", repeatable: true, mandatory: false, tips: ["Data de publicação do recurso continuador."] },
                { code: "p", label: "Physical Description", repeatable: true, mandatory: false, tips: ["Descrição física do recurso continuador (se aplicável)."] },
                { code: "v", label: "Volume Number", repeatable: true, mandatory: false, tips: ["Número de volume do recurso continuador, se aplicável."] },
                { code: "x", label: "ISSN", repeatable: true, mandatory: false, tips: ["Número ISSN do recurso continuador, se aplicável."] },
                { code: "y", label: "CODEN", repeatable: true, mandatory: false, tips: ["Código CODEN do recurso continuador, se aplicável."] },
                { code: "z", label: "ISBN", repeatable: true, mandatory: false, tips: ["Número ISBN do recurso continuador, se aplicável."] },
                { code: "5", label: "Institution to Which Field Applies", repeatable: true, mandatory: false, tips: ["Código da instituição à qual o campo se aplica."] },
                { code: "6", label: "Interfield Linking Data", repeatable: false, mandatory: false, tips: ["Dados de ligação entre campos."] }
            ]
        },
        {
            tag: "442",
            name: "SUPERSEDED BY",
            ind1Tips: ["# - Não definido"],
            ind2Tips: ["0 - Do not make a note", "1 - Make a note"],
            tips: [
                "O campo 442 é usado para indicar que um recurso foi substituído (completamente) por outro recurso posterior.",
                "Este campo estabelece uma relação de substituição total, onde o recurso descrito no registro foi descontinuado e substituído por outro recurso.",
                "Diferente dos campos de continuidade, aqui há uma substituição completa que geralmente implica no fim da publicação original.",
                "O segundo indicador controla se uma nota explicativa deve ser gerada automaticamente a partir dos dados do campo.",
                "Este campo é o inverso do campo 432 (SUPERSEDES).",
                "Usado quando uma publicação é completamente substituída por outra, geralmente com mudança de título ou formato."
            ],
            subFieldDef: [
                { code: "0", label: "Record Control Number", repeatable: false, mandatory: false, tips: ["Número de controlo do registo bibliográfico do recurso que substitui este registro."] },
                { code: "t", label: "Title", repeatable: true, mandatory: true, tips: ["Título do recurso que substitui o recurso descrito neste registro."] },
                { code: "a", label: "General Material Designation", repeatable: true, mandatory: false, tips: ["Designação geral do material do recurso substituto."] },
                { code: "b", label: "Other Title Information", repeatable: true, mandatory: false, tips: ["Outras informações relacionadas ao título do recurso substituto."] },
                { code: "f", label: "First Statement of Responsibility", repeatable: true, mandatory: false, tips: ["Primeira declaração de responsabilidade do recurso substituto."] },
                { code: "g", label: "Subsequent Statement of Responsibility", repeatable: true, mandatory: false, tips: ["Declarações subsequentes de responsabilidade do recurso substituto."] },
                { code: "c", label: "Place of Publication", repeatable: true, mandatory: false, tips: ["Local de publicação do recurso substituto."] },
                { code: "n", label: "Name of Publisher, Distributor, etc.", repeatable: true, mandatory: false, tips: ["Nome do editor ou distribuidor do recurso substituto."] },
                { code: "d", label: "Date of Publication", repeatable: true, mandatory: false, tips: ["Data de publicação do recurso substituto."] },
                { code: "p", label: "Physical Description", repeatable: true, mandatory: false, tips: ["Descrição física do recurso substituto (se aplicável)."] },
                { code: "v", label: "Volume Number", repeatable: true, mandatory: false, tips: ["Número de volume do recurso substituto, se aplicável."] },
                { code: "x", label: "ISSN", repeatable: true, mandatory: false, tips: ["Número ISSN do recurso substituto, se aplicável."] },
                { code: "y", label: "CODEN", repeatable: true, mandatory: false, tips: ["Código CODEN do recurso substituto, se aplicável."] },
                { code: "z", label: "ISBN", repeatable: true, mandatory: false, tips: ["Número ISBN do recurso substituto, se aplicável."] },
                { code: "5", label: "Institution to Which Field Applies", repeatable: true, mandatory: false, tips: ["Código da instituição à qual o campo se aplica."] },
                { code: "6", label: "Interfield Linking Data", repeatable: false, mandatory: false, tips: ["Dados de ligação entre campos."] }
            ]
        },
        {
            tag: "443",
            name: "SUPERSEDED IN PART BY",
            ind1Tips: ["# - Não definido"],
            ind2Tips: ["0 - Do not make a note", "1 - Make a note"],
            tips: [
                "O campo 443 é usado para indicar que parte do conteúdo de um recurso foi substituída por outro recurso posterior.",
                "Este campo estabelece uma relação de substituição parcial, onde apenas uma seção ou parte específica do recurso descrito no registro foi substituída por outro recurso.",
                "Diferente do campo 442 (SUPERSEDED BY) que indica substituição total, este especifica que apenas parte do conteúdo foi substituída.",
                "O segundo indicador controla se uma nota explicativa deve ser gerada automaticamente a partir dos dados do campo.",
                "Este campo é o inverso do campo 433 (SUPERSEDES IN PART).",
                "Usado quando apenas uma seção, suplemento ou parte específica de uma publicação é substituída por uma nova publicação independente."
            ],
            subFieldDef: [
                { code: "0", label: "Record Control Number", repeatable: false, mandatory: false, tips: ["Número de controlo do registo bibliográfico do recurso que substitui parte deste registro."] },
                { code: "t", label: "Title", repeatable: true, mandatory: true, tips: ["Título do recurso que substitui parte do conteúdo descrito neste registro."] },
                { code: "a", label: "General Material Designation", repeatable: true, mandatory: false, tips: ["Designação geral do material do recurso substituto."] },
                { code: "b", label: "Other Title Information", repeatable: true, mandatory: false, tips: ["Outras informações relacionadas ao título do recurso substituto."] },
                { code: "f", label: "First Statement of Responsibility", repeatable: true, mandatory: false, tips: ["Primeira declaração de responsabilidade do recurso substituto."] },
                { code: "g", label: "Subsequent Statement of Responsibility", repeatable: true, mandatory: false, tips: ["Declarações subsequentes de responsabilidade do recurso substituto."] },
                { code: "h", label: "Number of Part/Section", repeatable: true, mandatory: true, tips: ["Número ou identificação da parte/seção que foi substituída pelo novo recurso."] },
                { code: "i", label: "Name of Part/Section", repeatable: true, mandatory: true, tips: ["Nome da parte/seção que foi substituída pelo novo recurso."] },
                { code: "c", label: "Place of Publication", repeatable: true, mandatory: false, tips: ["Local de publicação do recurso substituto."] },
                { code: "n", label: "Name of Publisher, Distributor, etc.", repeatable: true, mandatory: false, tips: ["Nome do editor ou distribuidor do recurso substituto."] },
                { code: "d", label: "Date of Publication", repeatable: true, mandatory: false, tips: ["Data de publicação do recurso substituto."] },
                { code: "p", label: "Physical Description", repeatable: true, mandatory: false, tips: ["Descrição física do recurso substituto (se aplicável)."] },
                { code: "v", label: "Volume Number", repeatable: true, mandatory: false, tips: ["Número de volume do recurso substituto, se aplicável."] },
                { code: "x", label: "ISSN", repeatable: true, mandatory: false, tips: ["Número ISSN do recurso substituto, se aplicável."] },
                { code: "y", label: "CODEN", repeatable: true, mandatory: false, tips: ["Código CODEN do recurso substituto, se aplicável."] },
                { code: "z", label: "ISBN", repeatable: true, mandatory: false, tips: ["Número ISBN do recurso substituto, se aplicável."] },
                { code: "5", label: "Institution to Which Field Applies", repeatable: true, mandatory: false, tips: ["Código da instituição à qual o campo se aplica."] },
                { code: "6", label: "Interfield Linking Data", repeatable: false, mandatory: false, tips: ["Dados de ligação entre campos."] }
            ]
        },
        {
            tag: "444",
            name: "ABSORBED BY",
            ind1Tips: ["# - Não definido"],
            ind2Tips: ["0 - Do not make a note", "1 - Make a note"],
            tips: [
                "O campo 444 é usado para indicar que um recurso foi absorvido (incorporado) por outro recurso posterior.",
                "Este campo estabelece uma relação de absorção, onde o recurso descrito no registro foi incorporado por outro recurso e descontinuado.",
                "Diferente da substituição, aqui o recurso original é integrado no novo recurso, que continua a existir.",
                "O segundo indicador controla se uma nota explicativa deve ser gerada automaticamente a partir dos dados do campo.",
                "Este campo é o inverso do campo 434 (ABSORBS).",
                "Usado quando uma publicação é incorporada por outra publicação que mantém sua existência."
            ],
            subFieldDef: [
                { code: "0", label: "Record Control Number", repeatable: false, mandatory: false, tips: ["Número de controlo do registo bibliográfico do recurso que absorveu este registro."] },
                { code: "t", label: "Title", repeatable: true, mandatory: true, tips: ["Título do recurso que absorveu o recurso descrito neste registro."] },
                { code: "a", label: "General Material Designation", repeatable: true, mandatory: false, tips: ["Designação geral do material do recurso absorvedor."] },
                { code: "b", label: "Other Title Information", repeatable: true, mandatory: false, tips: ["Outras informações relacionadas ao título do recurso absorvedor."] },
                { code: "f", label: "First Statement of Responsibility", repeatable: true, mandatory: false, tips: ["Primeira declaração de responsabilidade do recurso absorvedor."] },
                { code: "g", label: "Subsequent Statement of Responsibility", repeatable: true, mandatory: false, tips: ["Declarações subsequentes de responsabilidade do recurso absorvedor."] },
                { code: "c", label: "Place of Publication", repeatable: true, mandatory: false, tips: ["Local de publicação do recurso absorvedor."] },
                { code: "n", label: "Name of Publisher, Distributor, etc.", repeatable: true, mandatory: false, tips: ["Nome do editor ou distribuidor do recurso absorvedor."] },
                { code: "d", label: "Date of Publication", repeatable: true, mandatory: false, tips: ["Data de publicação do recurso absorvedor."] },
                { code: "p", label: "Physical Description", repeatable: true, mandatory: false, tips: ["Descrição física do recurso absorvedor (se aplicável)."] },
                { code: "v", label: "Volume Number", repeatable: true, mandatory: false, tips: ["Número de volume do recurso absorvedor, se aplicável."] },
                { code: "x", label: "ISSN", repeatable: true, mandatory: false, tips: ["Número ISSN do recurso absorvedor, se aplicável."] },
                { code: "y", label: "CODEN", repeatable: true, mandatory: false, tips: ["Código CODEN do recurso absorvedor, se aplicável."] },
                { code: "z", label: "ISBN", repeatable: true, mandatory: false, tips: ["Número ISBN do recurso absorvedor, se aplicável."] },
                { code: "5", label: "Institution to Which Field Applies", repeatable: true, mandatory: false, tips: ["Código da instituição à qual o campo se aplica."] },
                { code: "6", label: "Interfield Linking Data", repeatable: false, mandatory: false, tips: ["Dados de ligação entre campos."] }
            ]
        },
        {
            tag: "445",
            name: "ABSORBED IN PART BY",
            ind1Tips: ["# - Não definido"],
            ind2Tips: ["0 - Do not make a note", "1 - Make a note"],
            tips: [
                "O campo 445 é usado para indicar que parte do conteúdo de um recurso foi absorvida (incorporada) por outro recurso posterior.",
                "Este campo estabelece uma relação de absorção parcial, onde apenas uma seção ou parte específica do recurso descrito no registro foi incorporada por outro recurso.",
                "Diferente do campo 444 (ABSORBED BY) que indica absorção total, este especifica que apenas parte do conteúdo foi absorvida.",
                "O segundo indicador controla se uma nota explicativa deve ser gerada automaticamente a partir dos dados do campo.",
                "Este campo é o inverso do campo 435 (ABSORBS IN PART).",
                "Usado quando apenas uma seção, suplemento ou parte específica de uma publicação é incorporada por outra publicação."
            ],
            subFieldDef: [
                { code: "0", label: "Record Control Number", repeatable: false, mandatory: false, tips: ["Número de controlo do registo bibliográfico do recurso que absorveu parte deste registro."] },
                { code: "t", label: "Title", repeatable: true, mandatory: true, tips: ["Título do recurso que absorveu parte do conteúdo descrito neste registro."] },
                { code: "a", label: "General Material Designation", repeatable: true, mandatory: false, tips: ["Designação geral do material do recurso absorvedor."] },
                { code: "b", label: "Other Title Information", repeatable: true, mandatory: false, tips: ["Outras informações relacionadas ao título do recurso absorvedor."] },
                { code: "f", label: "First Statement of Responsibility", repeatable: true, mandatory: false, tips: ["Primeira declaração de responsabilidade do recurso absorvedor."] },
                { code: "g", label: "Subsequent Statement of Responsibility", repeatable: true, mandatory: false, tips: ["Declarações subsequentes de responsabilidade do recurso absorvedor."] },
                { code: "h", label: "Number of Part/Section", repeatable: true, mandatory: true, tips: ["Número ou identificação da parte/seção que foi absorvida pelo novo recurso."] },
                { code: "i", label: "Name of Part/Section", repeatable: true, mandatory: true, tips: ["Nome da parte/seção que foi absorvida pelo novo recurso."] },
                { code: "c", label: "Place of Publication", repeatable: true, mandatory: false, tips: ["Local de publicação do recurso absorvedor."] },
                { code: "n", label: "Name of Publisher, Distributor, etc.", repeatable: true, mandatory: false, tips: ["Nome do editor ou distribuidor do recurso absorvedor."] },
                { code: "d", label: "Date of Publication", repeatable: true, mandatory: false, tips: ["Data de publicação do recurso absorvedor."] },
                { code: "p", label: "Physical Description", repeatable: true, mandatory: false, tips: ["Descrição física do recurso absorvedor (se aplicável)."] },
                { code: "v", label: "Volume Number", repeatable: true, mandatory: false, tips: ["Número de volume do recurso absorvedor, se aplicável."] },
                { code: "x", label: "ISSN", repeatable: true, mandatory: false, tips: ["Número ISSN do recurso absorvedor, se aplicável."] },
                { code: "y", label: "CODEN", repeatable: true, mandatory: false, tips: ["Código CODEN do recurso absorvedor, se aplicável."] },
                { code: "z", label: "ISBN", repeatable: true, mandatory: false, tips: ["Número ISBN do recurso absorvedor, se aplicável."] },
                { code: "5", label: "Institution to Which Field Applies", repeatable: true, mandatory: false, tips: ["Código da instituição à qual o campo se aplica."] },
                { code: "6", label: "Interfield Linking Data", repeatable: false, mandatory: false, tips: ["Dados de ligação entre campos."] }
            ]
        },
        {
            tag: "446",
            name: "SPLIT INTO .., ..., AND ...",
            ind1Tips: ["# - Não definido"],
            ind2Tips: ["0 - Do not make a note", "1 - Make a note"],
            tips: [
                "O campo 446 é usado para indicar que um recurso foi dividido em dois ou mais recursos separados.",
                "Este campo estabelece uma relação de divisão bibliográfica, onde o recurso descrito no registro foi desmembrado em múltiplas publicações independentes.",
                "Diferente dos campos de absorção ou fusão, aqui um único recurso origina várias publicações distintas.",
                "O segundo indicador controla se uma nota explicativa deve ser gerada automaticamente a partir dos dados do campo.",
                "Este campo tem como inverso o campo 436 (FORMED BY MERGER OF...).",
                "Usado quando uma publicação é dividida em várias publicações especializadas ou regionais."
            ],
            subFieldDef: [
                { code: "0", label: "Record Control Number", repeatable: true, mandatory: false, tips: ["Números de controlo dos registos bibliográficos dos recursos resultantes da divisão."] },
                { code: "t", label: "Title", repeatable: true, mandatory: true, tips: ["Títulos dos recursos que resultaram da divisão deste registro."] },
                { code: "a", label: "General Material Designation", repeatable: true, mandatory: false, tips: ["Designação geral do material dos recursos resultantes."] },
                { code: "b", label: "Other Title Information", repeatable: true, mandatory: false, tips: ["Outras informações relacionadas aos títulos dos recursos resultantes."] },
                { code: "f", label: "First Statement of Responsibility", repeatable: true, mandatory: false, tips: ["Primeiras declarações de responsabilidade dos recursos resultantes."] },
                { code: "g", label: "Subsequent Statement of Responsibility", repeatable: true, mandatory: false, tips: ["Declarações subsequentes de responsabilidade dos recursos resultantes."] },
                { code: "c", label: "Place of Publication", repeatable: true, mandatory: false, tips: ["Locais de publicação dos recursos resultantes."] },
                { code: "n", label: "Name of Publisher, Distributor, etc.", repeatable: true, mandatory: false, tips: ["Nomes dos editores ou distribuidores dos recursos resultantes."] },
                { code: "d", label: "Date of Publication", repeatable: true, mandatory: false, tips: ["Datas de publicação dos recursos resultantes."] },
                { code: "p", label: "Physical Description", repeatable: true, mandatory: false, tips: ["Descrições físicas dos recursos resultantes (se aplicável)."] },
                { code: "v", label: "Volume Number", repeatable: true, mandatory: false, tips: ["Números de volume dos recursos resultantes, se aplicável."] },
                { code: "x", label: "ISSN", repeatable: true, mandatory: false, tips: ["Números ISSN dos recursos resultantes, se aplicável."] },
                { code: "y", label: "CODEN", repeatable: true, mandatory: false, tips: ["Códigos CODEN dos recursos resultantes, se aplicável."] },
                { code: "z", label: "ISBN", repeatable: true, mandatory: false, tips: ["Números ISBN dos recursos resultantes, se aplicável."] },
                { code: "5", label: "Institution to Which Field Applies", repeatable: true, mandatory: false, tips: ["Código da instituição à qual o campo se aplica."] },
                { code: "6", label: "Interfield Linking Data", repeatable: false, mandatory: false, tips: ["Dados de ligação entre campos."] }
            ]
        },
        {
            tag: "447",
            name: "MERGED WITH ... AND ... TO FORM ...",
            ind1Tips: ["# - Não definido"],
            ind2Tips: ["0 - Do not make a note", "1 - Make a note"],
            tips: [
                "O campo 447 é usado para indicar que este recurso foi fundido com um ou mais outros recursos para formar uma nova publicação.",
                "Este campo estabelece uma relação de fusão bibliográfica, onde o recurso descrito no registro é combinado com outros para criar um novo recurso.",
                "Todos os recursos originais (incluindo este) são normalmente descontinuados após a fusão.",
                "O segundo indicador controla se uma nota explicativa deve ser gerada automaticamente a partir dos dados do campo.",
                "Este campo é o inverso do campo 436 (FORMED BY MERGER OF...).",
                "Usado quando duas ou mais publicações são combinadas para formar uma nova publicação com identidade própria."
            ],
            subFieldDef: [
                { code: "0", label: "Record Control Number", repeatable: true, mandatory: false, tips: ["Números de controlo dos registos bibliográficos dos recursos envolvidos na fusão e do novo recurso formado."] },
                { code: "t", label: "Title", repeatable: true, mandatory: true, tips: ["Títulos dos recursos fundidos (incluindo este) e do novo recurso resultante."] },
                { code: "a", label: "General Material Designation", repeatable: true, mandatory: false, tips: ["Designação geral do material dos recursos envolvidos."] },
                { code: "b", label: "Other Title Information", repeatable: true, mandatory: false, tips: ["Outras informações relacionadas aos títulos dos recursos."] },
                { code: "f", label: "First Statement of Responsibility", repeatable: true, mandatory: false, tips: ["Primeiras declarações de responsabilidade dos recursos."] },
                { code: "g", label: "Subsequent Statement of Responsibility", repeatable: true, mandatory: false, tips: ["Declarações subsequentes de responsabilidade dos recursos."] },
                { code: "c", label: "Place of Publication", repeatable: true, mandatory: false, tips: ["Locais de publicação dos recursos envolvidos."] },
                { code: "n", label: "Name of Publisher, Distributor, etc.", repeatable: true, mandatory: false, tips: ["Nomes dos editores ou distribuidores dos recursos."] },
                { code: "d", label: "Date of Publication", repeatable: true, mandatory: false, tips: ["Datas de publicação dos recursos envolvidos."] },
                { code: "p", label: "Physical Description", repeatable: true, mandatory: false, tips: ["Descrições físicas dos recursos (se aplicável)."] },
                { code: "v", label: "Volume Number", repeatable: true, mandatory: false, tips: ["Números de volume dos recursos, se aplicável."] },
                { code: "x", label: "ISSN", repeatable: true, mandatory: false, tips: ["Números ISSN dos recursos envolvidos, se aplicável."] },
                { code: "y", label: "CODEN", repeatable: true, mandatory: false, tips: ["Códigos CODEN dos recursos, se aplicável."] },
                { code: "z", label: "ISBN", repeatable: true, mandatory: false, tips: ["Números ISBN dos recursos, se aplicável."] },
                { code: "5", label: "Institution to Which Field Applies", repeatable: true, mandatory: false, tips: ["Código da instituição à qual o campo se aplica."] },
                { code: "6", label: "Interfield Linking Data", repeatable: false, mandatory: false, tips: ["Dados de ligação entre campos."] }
            ]
        },
        {
            tag: "448",
            name: "CHANGED BACK TO",
            ind1Tips: ["# - Não definido"],
            ind2Tips: ["0 - Do not make a note", "1 - Make a note"],
            tips: [
                "O campo 448 é usado para indicar que um recurso retornou ao seu título anterior após uma mudança temporária.",
                "Este campo estabelece uma relação de reversão bibliográfica, onde o recurso descrito no registro retoma um título usado anteriormente.",
                "Diferente de outros campos de relacionamento, este documenta especificamente um retorno a uma denominação anterior.",
                "O segundo indicador controla se uma nota explicativa deve ser gerada automaticamente a partir dos dados do campo.",
                "Este campo é o inverso do campo 430 (CONTINUES) quando aplicado a reversões de título.",
                "Usado quando publicações retomam títulos anteriores após período com denominação diferente."
            ],
            subFieldDef: [
                { code: "0", label: "Record Control Number", repeatable: false, mandatory: false, tips: ["Número de controlo do registo bibliográfico do título anterior retomado."] },
                { code: "t", label: "Title", repeatable: true, mandatory: true, tips: ["Título anterior que foi retomado pelo recurso descrito neste registro."] },
                { code: "a", label: "General Material Designation", repeatable: true, mandatory: false, tips: ["Designação geral do material do título retomado."] },
                { code: "b", label: "Other Title Information", repeatable: true, mandatory: false, tips: ["Outras informações relacionadas ao título retomado."] },
                { code: "f", label: "First Statement of Responsibility", repeatable: true, mandatory: false, tips: ["Primeira declaração de responsabilidade do título retomado."] },
                { code: "g", label: "Subsequent Statement of Responsibility", repeatable: true, mandatory: false, tips: ["Declarações subsequentes de responsabilidade do título retomado."] },
                { code: "c", label: "Place of Publication", repeatable: true, mandatory: false, tips: ["Local de publicação do título retomado."] },
                { code: "n", label: "Name of Publisher, Distributor, etc.", repeatable: true, mandatory: false, tips: ["Nome do editor ou distribuidor do título retomado."] },
                { code: "d", label: "Date of Publication", repeatable: true, mandatory: false, tips: ["Datas de publicação associadas ao título retomado."] },
                { code: "p", label: "Physical Description", repeatable: true, mandatory: false, tips: ["Descrição física do título retomado (se aplicável)."] },
                { code: "v", label: "Volume Number", repeatable: true, mandatory: false, tips: ["Número de volume do título retomado, se aplicável."] },
                { code: "x", label: "ISSN", repeatable: true, mandatory: false, tips: ["Número ISSN do título retomado, se aplicável."] },
                { code: "y", label: "CODEN", repeatable: true, mandatory: false, tips: ["Código CODEN do título retomado, se aplicável."] },
                { code: "z", label: "ISBN", repeatable: true, mandatory: false, tips: ["Número ISBN do título retomado, se aplicável."] },
                { code: "5", label: "Institution to Which Field Applies", repeatable: true, mandatory: false, tips: ["Código da instituição à qual o campo se aplica."] },
                { code: "6", label: "Interfield Linking Data", repeatable: false, mandatory: false, tips: ["Dados de ligação entre campos."] }
            ]
        },
        {
            tag: "451",
            name: "OTHER EDITION IN THE SAME MEDIUM",
            ind1Tips: ["# - Não definido"],
            ind2Tips: ["0 - Do not make a note", "1 - Make a note"],
            tips: [
                "O campo 451 é usado para relacionar outras edições do mesmo recurso no mesmo formato físico ou meio.",
                "Este campo estabelece uma relação entre diferentes edições de uma obra que compartilham o mesmo suporte físico (ex.: ambas impressas, ambas digitais).",
                "Diferente do campo 452 (OTHER EDITION IN ANOTHER MEDIUM), que relaciona edições em formatos diferentes.",
                "O segundo indicador controla se uma nota explicativa deve ser gerada automaticamente a partir dos dados do campo.",
                "Usado para vincular edições alternativas, versões revisadas ou reimpressões no mesmo formato."
            ],
            subFieldDef: [
                { code: "0", label: "Record Control Number", repeatable: false, mandatory: false, tips: ["Número de controlo do registo bibliográfico da outra edição no mesmo meio."] },
                { code: "t", label: "Title", repeatable: true, mandatory: true, tips: ["Título da outra edição no mesmo meio."] },
                { code: "a", label: "General Material Designation", repeatable: true, mandatory: false, tips: ["Designação geral do material (deve ser igual ao do registro atual)."] },
                { code: "b", label: "Other Title Information", repeatable: true, mandatory: false, tips: ["Outras informações relacionadas ao título da outra edição."] },
                { code: "e", label: "Edition Statement", repeatable: true, mandatory: false, tips: ["Declaração de edição da outra publicação."] },
                { code: "f", label: "First Statement of Responsibility", repeatable: true, mandatory: false, tips: ["Primeira declaração de responsabilidade da outra edição."] },
                { code: "g", label: "Subsequent Statement of Responsibility", repeatable: true, mandatory: false, tips: ["Declarações subsequentes de responsabilidade."] },
                { code: "k", label: "Publication, Distribution, etc.", repeatable: true, mandatory: false, tips: ["Informações sobre publicação/distribuição da outra edição."] },
                { code: "n", label: "Number of Part/Section", repeatable: true, mandatory: false, tips: ["Número da parte/seção, se aplicável."] },
                { code: "p", label: "Physical Description", repeatable: true, mandatory: false, tips: ["Descrição física da outra edição."] },
                { code: "u", label: "Uniform Resource Identifier", repeatable: true, mandatory: false, tips: ["URI para acesso à outra edição, se disponível."] },
                { code: "x", label: "ISSN", repeatable: true, mandatory: false, tips: ["Número ISSN da outra edição, se aplicável."] },
                { code: "y", label: "CODEN", repeatable: true, mandatory: false, tips: ["Código CODEN da outra edição, se aplicável."] },
                { code: "z", label: "ISBN", repeatable: true, mandatory: false, tips: ["Número ISBN da outra edição."] },
                { code: "5", label: "Institution to Which Field Applies", repeatable: true, mandatory: false, tips: ["Código da instituição à qual o campo se aplica."] },
                { code: "6", label: "Interfield Linking Data", repeatable: false, mandatory: false, tips: ["Dados de ligação entre campos."] }
            ]
        },
        {
            tag: "452",
            name: "OTHER EDITION IN ANOTHER MEDIUM",
            ind1Tips: ["# - Não definido"],
            ind2Tips: ["0 - Do not make a note", "1 - Make a note"],
            tips: [
                "O campo 452 é usado para relacionar outras edições do mesmo recurso em formatos ou meios diferentes.",
                "Este campo estabelece uma relação entre edições de uma obra em suportes físicos distintos (ex.: versão impressa e versão digital).",
                "Diferente do campo 451 (OTHER EDITION IN THE SAME MEDIUM), que relaciona edições no mesmo formato.",
                "O segundo indicador controla se uma nota explicativa deve ser gerada automaticamente a partir dos dados do campo.",
                "Usado para vincular edições alternativas em formatos diferentes, como impresso/eletrônico, CD-ROM/online, etc."
            ],
            subFieldDef: [
                { code: "0", label: "Record Control Number", repeatable: false, mandatory: false, tips: ["Número de controlo do registo bibliográfico da outra edição em meio diferente."] },
                { code: "t", label: "Title", repeatable: true, mandatory: true, tips: ["Título da outra edição em meio diferente."] },
                { code: "a", label: "General Material Designation", repeatable: true, mandatory: true, tips: ["Designação geral do material (deve ser diferente do registro atual)."] },
                { code: "b", label: "Other Title Information", repeatable: true, mandatory: false, tips: ["Outras informações relacionadas ao título da outra edição."] },
                { code: "e", label: "Edition Statement", repeatable: true, mandatory: false, tips: ["Declaração de edição da outra publicação em formato diferente."] },
                { code: "f", label: "First Statement of Responsibility", repeatable: true, mandatory: false, tips: ["Primeira declaração de responsabilidade da outra edição."] },
                { code: "g", label: "Subsequent Statement of Responsibility", repeatable: true, mandatory: false, tips: ["Declarações subsequentes de responsabilidade."] },
                { code: "k", label: "Publication, Distribution, etc.", repeatable: true, mandatory: false, tips: ["Informações sobre publicação/distribuição da outra edição."] },
                { code: "n", label: "Number of Part/Section", repeatable: true, mandatory: false, tips: ["Número da parte/seção, se aplicável."] },
                { code: "p", label: "Physical Description", repeatable: true, mandatory: false, tips: ["Descrição física da outra edição."] },
                { code: "u", label: "Uniform Resource Identifier", repeatable: true, mandatory: false, tips: ["URI para acesso à outra edição, se disponível."] },
                { code: "x", label: "ISSN", repeatable: true, mandatory: false, tips: ["Número ISSN da outra edição, se aplicável."] },
                { code: "y", label: "CODEN", repeatable: true, mandatory: false, tips: ["Código CODEN da outra edição, se aplicável."] },
                { code: "z", label: "ISBN", repeatable: true, mandatory: false, tips: ["Número ISBN da outra edição."] },
                { code: "5", label: "Institution to Which Field Applies", repeatable: true, mandatory: false, tips: ["Código da instituição à qual o campo se aplica."] },
                { code: "6", label: "Interfield Linking Data", repeatable: false, mandatory: false, tips: ["Dados de ligação entre campos."] }
            ]
        },
        {
            tag: "453",
            name: "TRANSLATED AS",
            ind1Tips: ["# - Não definido"],
            ind2Tips: ["0 - Do not make a note", "1 - Make a note"],
            tips: [
                "O campo 453 é usado para relacionar uma tradução do recurso descrito no registro.",
                "Este campo estabelece uma relação entre a obra original e sua versão traduzida.",
                "Diferente dos campos de edição, aqui o conteúdo é apresentado em outro idioma.",
                "O segundo indicador controla se uma nota explicativa deve ser gerada automaticamente a partir dos dados do campo.",
                "Usado para vincular obras originais às suas traduções publicadas.",
                "Pode ser usado tanto para traduções completas quanto parciais."
            ],
            subFieldDef: [
                { code: "0", label: "Record Control Number", repeatable: false, mandatory: false, tips: ["Número de controlo do registo bibliográfico da tradução."] },
                { code: "t", label: "Title", repeatable: true, mandatory: true, tips: ["Título da obra traduzida."] },
                { code: "a", label: "General Material Designation", repeatable: true, mandatory: false, tips: ["Designação geral do material da tradução."] },
                { code: "b", label: "Other Title Information", repeatable: true, mandatory: false, tips: ["Outras informações relacionadas ao título da tradução."] },
                { code: "e", label: "Language of Translation", repeatable: false, mandatory: true, tips: ["Idioma para o qual a obra foi traduzida (usar código de 3 letras ISO 639-2)."] },
                { code: "f", label: "First Statement of Responsibility", repeatable: true, mandatory: false, tips: ["Primeira declaração de responsabilidade da tradução."] },
                { code: "g", label: "Subsequent Statement of Responsibility", repeatable: true, mandatory: false, tips: ["Declarações subsequentes de responsabilidade."] },
                { code: "k", label: "Publication, Distribution, etc.", repeatable: true, mandatory: false, tips: ["Informações sobre publicação/distribuição da tradução."] },
                { code: "l", label: "Language of Original", repeatable: false, mandatory: true, tips: ["Idioma original da obra (usar código de 3 letras ISO 639-2)."] },
                { code: "m", label: "Translator Statement", repeatable: true, mandatory: false, tips: ["Informação sobre o tradutor(es) da obra."] },
                { code: "n", label: "Number of Part/Section", repeatable: true, mandatory: false, tips: ["Número da parte/seção traduzida, se aplicável."] },
                { code: "p", label: "Physical Description", repeatable: true, mandatory: false, tips: ["Descrição física da tradução."] },
                { code: "u", label: "Uniform Resource Identifier", repeatable: true, mandatory: false, tips: ["URI para acesso à tradução, se disponível."] },
                { code: "x", label: "ISSN", repeatable: true, mandatory: false, tips: ["Número ISSN da tradução, se aplicável."] },
                { code: "y", label: "CODEN", repeatable: true, mandatory: false, tips: ["Código CODEN da tradução, se aplicável."] },
                { code: "z", label: "ISBN", repeatable: true, mandatory: false, tips: ["Número ISBN da tradução."] },
                { code: "5", label: "Institution to Which Field Applies", repeatable: true, mandatory: false, tips: ["Código da instituição à qual o campo se aplica."] },
                { code: "6", label: "Interfield Linking Data", repeatable: false, mandatory: false, tips: ["Dados de ligação entre campos."] }
            ]
        },
        {
            tag: "454",
            name: "TRANSLATION OF",
            ind1Tips: ["# - Não definido"],
            ind2Tips: ["0 - Do not make a note", "1 - Make a note"],
            tips: [
                "O campo 454 é usado para relacionar a obra original da qual o recurso descrito é uma tradução.",
                "Este campo estabelece uma relação inversa ao campo 453 (TRANSLATED AS), ligando a tradução ao seu original.",
                "Fundamental para identificar a fonte linguística de obras traduzidas.",
                "O segundo indicador controla se uma nota explicativa deve ser gerada automaticamente a partir dos dados do campo.",
                "Usado tanto para traduções completas quanto parciais.",
                "Particularmente importante para obras científicas e literárias."
            ],
            subFieldDef: [
                { code: "0", label: "Record Control Number", repeatable: false, mandatory: false, tips: ["Número de controlo do registo bibliográfico da obra original."] },
                { code: "t", label: "Title", repeatable: true, mandatory: true, tips: ["Título da obra original na língua fonte."] },
                { code: "a", label: "General Material Designation", repeatable: true, mandatory: false, tips: ["Designação geral do material da obra original."] },
                { code: "b", label: "Other Title Information", repeatable: true, mandatory: false, tips: ["Outras informações relacionadas ao título original."] },
                { code: "e", label: "Language of Original", repeatable: false, mandatory: true, tips: ["Idioma original da obra (usar código de 3 letras ISO 639-2)."] },
                { code: "f", label: "First Statement of Responsibility", repeatable: true, mandatory: false, tips: ["Primeira declaração de responsabilidade da obra original."] },
                { code: "g", label: "Subsequent Statement of Responsibility", repeatable: true, mandatory: false, tips: ["Declarações subsequentes de responsabilidade."] },
                { code: "k", label: "Publication, Distribution, etc.", repeatable: true, mandatory: false, tips: ["Informações sobre publicação/distribuição da obra original."] },
                { code: "l", label: "Language of Translation", repeatable: false, mandatory: true, tips: ["Idioma para o qual a obra foi traduzida (código ISO 639-2)."] },
                { code: "n", label: "Number of Part/Section", repeatable: true, mandatory: false, tips: ["Número da parte/seção traduzida, se aplicável."] },
                { code: "p", label: "Physical Description", repeatable: true, mandatory: false, tips: ["Descrição física da obra original."] },
                { code: "u", label: "Uniform Resource Identifier", repeatable: true, mandatory: false, tips: ["URI para acesso à obra original, se disponível."] },
                { code: "x", label: "ISSN", repeatable: true, mandatory: false, tips: ["Número ISSN da obra original, se aplicável."] },
                { code: "y", label: "CODEN", repeatable: true, mandatory: false, tips: ["Código CODEN da obra original, se aplicável."] },
                { code: "z", label: "ISBN", repeatable: true, mandatory: false, tips: ["Número ISBN da obra original."] },
                { code: "5", label: "Institution to Which Field Applies", repeatable: true, mandatory: false, tips: ["Código da instituição à qual o campo se aplica."] },
                { code: "6", label: "Interfield Linking Data", repeatable: false, mandatory: false, tips: ["Dados de ligação entre campos."] }
            ]
        },
        {
            tag: "455",
            name: "REPRODUCTION OF",
            ind1Tips: ["# - Não definido"],
            ind2Tips: ["0 - Do not make a note", "1 - Make a note"],
            tips: [
                "O campo 455 é usado para relacionar o recurso original que foi reproduzido no item descrito.",
                "Este campo estabelece uma relação entre uma reprodução (como fac-símile, microforma ou reimpressão) e seu original.",
                "Diferente dos campos de edição, aqui o conteúdo é uma reprodução fiel do original, sem alterações substantivas.",
                "O segundo indicador controla se uma nota explicativa deve ser gerada automaticamente a partir dos dados do campo.",
                "Usado para vincular reproduções fac-símile, reedições fotomecânicas, digitalizações fidedignas e microformas.",
                "Importante para recursos de preservação e materiais históricos reproduzidos."
            ],
            subFieldDef: [
                { code: "0", label: "Record Control Number", repeatable: false, mandatory: false, tips: ["Número de controlo do registo bibliográfico do original reproduzido."] },
                { code: "t", label: "Title", repeatable: true, mandatory: true, tips: ["Título do recurso original que foi reproduzido."] },
                { code: "a", label: "General Material Designation", repeatable: true, mandatory: true, tips: ["Designação geral do material do original (deve ser diferente quando o meio muda)."] },
                { code: "b", label: "Other Title Information", repeatable: true, mandatory: false, tips: ["Outras informações relacionadas ao título original."] },
                { code: "e", label: "Reproduction Details", repeatable: true, mandatory: false, tips: ["Detalhes específicos sobre a reprodução (ex.: 'Fac-símile da edição de 1853')."] },
                { code: "f", label: "First Statement of Responsibility", repeatable: true, mandatory: false, tips: ["Primeira declaração de responsabilidade do original."] },
                { code: "g", label: "Subsequent Statement of Responsibility", repeatable: true, mandatory: false, tips: ["Declarações subsequentes de responsabilidade."] },
                { code: "k", label: "Publication, Distribution, etc.", repeatable: true, mandatory: false, tips: ["Informações sobre publicação/distribuição do original."] },
                { code: "l", label: "Reproduction Agency", repeatable: true, mandatory: false, tips: ["Agência/entidade responsável pela reprodução."] },
                { code: "m", label: "Reproduction Date", repeatable: false, mandatory: false, tips: ["Data da reprodução (formato YYYY, YYYY-MM, ou YYYY-MM-DD)."] },
                { code: "n", label: "Reproduction Place", repeatable: true, mandatory: false, tips: ["Local onde a reprodução foi realizada."] },
                { code: "p", label: "Physical Description of Original", repeatable: true, mandatory: false, tips: ["Descrição física do recurso original."] },
                { code: "r", label: "Reproduction Type", repeatable: false, mandatory: false, tips: ["Tipo de reprodução (ex.: fac-símile, microfilme, digital)."] },
                { code: "u", label: "Uniform Resource Identifier", repeatable: true, mandatory: false, tips: ["URI para acesso ao original, se disponível."] },
                { code: "x", label: "ISSN", repeatable: true, mandatory: false, tips: ["Número ISSN do original, se aplicável."] },
                { code: "y", label: "CODEN", repeatable: true, mandatory: false, tips: ["Código CODEN do original, se aplicável."] },
                { code: "z", label: "ISBN", repeatable: true, mandatory: false, tips: ["Número ISBN do original."] },
                { code: "5", label: "Institution to Which Field Applies", repeatable: true, mandatory: false, tips: ["Código da instituição à qual o campo se aplica."] },
                { code: "6", label: "Interfield Linking Data", repeatable: false, mandatory: false, tips: ["Dados de ligação entre campos."] }
            ]
        },
        {
            tag: "456",
            name: "REPRODUCED AS",
            ind1Tips: ["# - Não definido"],
            ind2Tips: ["0 - Do not make a note", "1 - Make a note"],
            tips: [
                "O campo 456 é usado para relacionar reproduções derivadas do recurso descrito no registro.",
                "Este campo estabelece uma relação entre o recurso original e suas reproduções (fac-símiles, microformas, digitalizações, etc.).",
                "Funciona como o inverso do campo 455 (REPRODUCTION OF), ligando o original às suas reproduções.",
                "O segundo indicador controla se uma nota explicativa deve ser gerada automaticamente a partir dos dados do campo.",
                "Usado para documentar como um recurso foi reproduzido em diferentes formatos ou suportes.",
                "Particularmente útil para materiais históricos, raros ou de preservação."
            ],
            subFieldDef: [
                { code: "0", label: "Record Control Number", repeatable: false, mandatory: false, tips: ["Número de controlo do registo bibliográfico da reprodução."] },
                { code: "t", label: "Title", repeatable: true, mandatory: true, tips: ["Título da reprodução (pode ser idêntico ao original)."] },
                { code: "a", label: "General Material Designation", repeatable: true, mandatory: true, tips: ["Designação geral do material da reprodução (deve refletir o novo formato)."] },
                { code: "b", label: "Other Title Information", repeatable: true, mandatory: false, tips: ["Outras informações relacionadas ao título da reprodução."] },
                { code: "e", label: "Reproduction Statement", repeatable: true, mandatory: false, tips: ["Declaração sobre a reprodução (ex.: 'Reprodução digital', 'Fac-símile')."] },
                { code: "f", label: "First Statement of Responsibility", repeatable: true, mandatory: false, tips: ["Primeira declaração de responsabilidade da reprodução."] },
                { code: "g", label: "Subsequent Statement of Responsibility", repeatable: true, mandatory: false, tips: ["Declarações subsequentes de responsabilidade."] },
                { code: "k", label: "Publication, Distribution, etc.", repeatable: true, mandatory: false, tips: ["Informações sobre publicação/distribuição da reprodução."] },
                { code: "l", label: "Reproduction Agency", repeatable: true, mandatory: false, tips: ["Agência/entidade responsável pela reprodução."] },
                { code: "m", label: "Reproduction Date", repeatable: false, mandatory: false, tips: ["Data em que a reprodução foi realizada (formato YYYY, YYYY-MM ou YYYY-MM-DD)."] },
                { code: "n", label: "Reproduction Place", repeatable: true, mandatory: false, tips: ["Local onde a reprodução foi realizada."] },
                { code: "p", label: "Physical Description", repeatable: true, mandatory: false, tips: ["Descrição física da reprodução."] },
                { code: "r", label: "Reproduction Type", repeatable: false, mandatory: false, tips: ["Tipo de reprodução (ex.: microfilme, digital, fac-símile)."] },
                { code: "u", label: "Uniform Resource Identifier", repeatable: true, mandatory: false, tips: ["URI para acesso à reprodução, se disponível."] },
                { code: "x", label: "ISSN", repeatable: true, mandatory: false, tips: ["Número ISSN da reprodução, se aplicável."] },
                { code: "y", label: "CODEN", repeatable: true, mandatory: false, tips: ["Código CODEN da reprodução, se aplicável."] },
                { code: "z", label: "ISBN", repeatable: true, mandatory: false, tips: ["Número ISBN da reprodução."] },
                { code: "5", label: "Institution to Which Field Applies", repeatable: true, mandatory: false, tips: ["Código da instituição à qual o campo se aplica."] },
                { code: "6", label: "Interfield Linking Data", repeatable: false, mandatory: false, tips: ["Dados de ligação entre campos."] }
            ]
        },
        {
            tag: "461",
            name: "SET",
            ind1Tips: ["# - Não definido"],
            ind2Tips: ["0 - Do not make a note", "1 - Make a note"],
            tips: [
                "O campo 461 é usado para relacionar um recurso à coleção/conjunto (set) ao qual pertence.",
                "Este campo estabelece uma hierarquia 'parte-todo', vinculando um item individual ao conjunto completo.",
                "Usado para documentos que são partes físicas ou lógicas de um recurso agregador.",
                "O segundo indicador controla se uma nota explicativa deve ser gerada automaticamente a partir dos dados do campo.",
                "Aplicável a conjuntos monográficos, coleções, séries completas ou obras em múltiplos volumes.",
                "Diferente do campo 463 (SUBSET), que relaciona partes de conjuntos."
            ],
            subFieldDef: [
                { code: "0", label: "Record Control Number", repeatable: false, mandatory: false, tips: ["Número de controlo do registo bibliográfico do conjunto."] },
                { code: "t", label: "Title", repeatable: true, mandatory: true, tips: ["Título do conjunto ao qual o recurso pertence."] },
                { code: "a", label: "General Material Designation", repeatable: true, mandatory: false, tips: ["Designação geral do material do conjunto."] },
                { code: "b", label: "Other Title Information", repeatable: true, mandatory: false, tips: ["Outras informações relacionadas ao título do conjunto."] },
                { code: "e", label: "Set Details", repeatable: true, mandatory: false, tips: ["Informações específicas sobre o conjunto (ex.: 'Coleção completa')."] },
                { code: "f", label: "First Statement of Responsibility", repeatable: true, mandatory: false, tips: ["Primeira declaração de responsabilidade do conjunto."] },
                { code: "g", label: "Subsequent Statement of Responsibility", repeatable: true, mandatory: false, tips: ["Declarações subsequentes de responsabilidade."] },
                { code: "h", label: "Number of Part/Section", repeatable: true, mandatory: false, tips: ["Número/identificação da parte dentro do conjunto."] },
                { code: "i", label: "Name of Part/Section", repeatable: true, mandatory: false, tips: ["Nome da parte dentro do conjunto."] },
                { code: "k", label: "Publication, Distribution, etc.", repeatable: true, mandatory: false, tips: ["Informações sobre publicação/distribuição do conjunto."] },
                { code: "n", label: "Number of Units", repeatable: true, mandatory: false, tips: ["Número de unidades físicas que compõem o conjunto."] },
                { code: "p", label: "Physical Description", repeatable: true, mandatory: false, tips: ["Descrição física do conjunto completo."] },
                { code: "u", label: "Uniform Resource Identifier", repeatable: true, mandatory: false, tips: ["URI para acesso ao conjunto, se disponível."] },
                { code: "v", label: "Volume Number", repeatable: true, mandatory: false, tips: ["Número de volume dentro do conjunto, se aplicável."] },
                { code: "x", label: "ISSN", repeatable: true, mandatory: false, tips: ["Número ISSN do conjunto, se aplicável."] },
                { code: "y", label: "CODEN", repeatable: true, mandatory: false, tips: ["Código CODEN do conjunto, se aplicável."] },
                { code: "z", label: "ISBN", repeatable: true, mandatory: false, tips: ["Número ISBN do conjunto."] },
                { code: "5", label: "Institution to Which Field Applies", repeatable: true, mandatory: false, tips: ["Código da instituição à qual o campo se aplica."] },
                { code: "6", label: "Interfield Linking Data", repeatable: false, mandatory: false, tips: ["Dados de ligação entre campos."] }
            ]
        },
        {
            tag: "462",
            name: "SUBSET",
            ind1Tips: ["# - Não definido"],
            ind2Tips: ["0 - Do not make a note", "1 - Make a note"],
            tips: [
                "O campo 462 é usado para relacionar um subconjunto (subset) ao recurso descrito no registro.",
                "Este campo estabelece uma hierarquia 'todo-parte', vinculando um conjunto a um de seus subconjuntos componentes.",
                "Diferente do campo 461 (SET) que liga uma parte ao todo, este liga o todo a uma de suas partes.",
                "O segundo indicador controla se uma nota explicativa deve ser gerada automaticamente a partir dos dados do campo.",
                "Usado quando o recurso descrito é um conjunto que contém subconjuntos lógicos ou físicos.",
                "Aplicável a séries que contém sub-séries, coleções com subcoleções, ou conjuntos com agrupamentos internos."
            ],
            subFieldDef: [
                { code: "0", label: "Record Control Number", repeatable: false, mandatory: false, tips: ["Número de controlo do registo bibliográfico do subconjunto."] },
                { code: "t", label: "Title", repeatable: true, mandatory: true, tips: ["Título do subconjunto componente."] },
                { code: "a", label: "General Material Designation", repeatable: true, mandatory: false, tips: ["Designação geral do material do subconjunto."] },
                { code: "b", label: "Other Title Information", repeatable: true, mandatory: false, tips: ["Outras informações relacionadas ao título do subconjunto."] },
                { code: "e", label: "Subset Details", repeatable: true, mandatory: false, tips: ["Informações específicas sobre o subconjunto (ex.: 'Subsérie A')."] },
                { code: "f", label: "First Statement of Responsibility", repeatable: true, mandatory: false, tips: ["Primeira declaração de responsabilidade do subconjunto."] },
                { code: "g", label: "Subsequent Statement of Responsibility", repeatable: true, mandatory: false, tips: ["Declarações subsequentes de responsabilidade."] },
                { code: "h", label: "Number of Part/Section", repeatable: true, mandatory: false, tips: ["Número/identificação do subconjunto dentro do conjunto principal."] },
                { code: "i", label: "Name of Part/Section", repeatable: true, mandatory: false, tips: ["Nome do subconjunto dentro do conjunto principal."] },
                { code: "k", label: "Publication, Distribution, etc.", repeatable: true, mandatory: false, tips: ["Informações sobre publicação/distribuição do subconjunto."] },
                { code: "n", label: "Number of Units", repeatable: true, mandatory: false, tips: ["Número de unidades físicas que compõem o subconjunto."] },
                { code: "p", label: "Physical Description", repeatable: true, mandatory: false, tips: ["Descrição física do subconjunto."] },
                { code: "u", label: "Uniform Resource Identifier", repeatable: true, mandatory: false, tips: ["URI para acesso ao subconjunto, se disponível."] },
                { code: "v", label: "Volume Number", repeatable: true, mandatory: false, tips: ["Número de volume do subconjunto, se aplicável."] },
                { code: "x", label: "ISSN", repeatable: true, mandatory: false, tips: ["Número ISSN do subconjunto, se aplicável."] },
                { code: "y", label: "CODEN", repeatable: true, mandatory: false, tips: ["Código CODEN do subconjunto, se aplicável."] },
                { code: "z", label: "ISBN", repeatable: true, mandatory: false, tips: ["Número ISBN do subconjunto."] },
                { code: "5", label: "Institution to Which Field Applies", repeatable: true, mandatory: false, tips: ["Código da instituição à qual o campo se aplica."] },
                { code: "6", label: "Interfield Linking Data", repeatable: false, mandatory: false, tips: ["Dados de ligação entre campos."] }
            ]
        },
        {
            tag: "463",
            name: "PIECE",
            ind1Tips: ["# - Não definido"],
            ind2Tips: ["0 - Do not make a note", "1 - Make a note"],
            tips: [
                "O campo 463 é usado para relacionar uma peça física específica ao recurso descrito no registro.",
                "Este campo estabelece uma relação entre um item descrito de forma agregada e suas peças físicas individuais.",
                "Diferente dos campos de conjunto (461) e subconjunto (462), aqui o foco é em unidades físicas discretas.",
                "O segundo indicador controla se uma nota explicativa deve ser gerada automaticamente a partir dos dados do campo.",
                "Usado para vincular descrições de múltiplos volumes, partes físicas ou itens individuais de um recurso agregado.",
                "Particularmente útil para coleções de objetos físicos ou recursos com componentes separados."
            ],
            subFieldDef: [
                { code: "0", label: "Record Control Number", repeatable: false, mandatory: false, tips: ["Número de controlo do registo bibliográfico da peça física."] },
                { code: "t", label: "Title", repeatable: true, mandatory: true, tips: ["Título ou identificação da peça física."] },
                { code: "a", label: "General Material Designation", repeatable: true, mandatory: false, tips: ["Designação geral do material da peça física."] },
                { code: "b", label: "Other Title Information", repeatable: true, mandatory: false, tips: ["Outras informações relacionadas à peça física."] },
                { code: "e", label: "Piece Identification", repeatable: true, mandatory: false, tips: ["Identificação específica da peça (ex.: 'Disco 1 de 3')."] },
                { code: "f", label: "First Statement of Responsibility", repeatable: true, mandatory: false, tips: ["Primeira declaração de responsabilidade da peça."] },
                { code: "g", label: "Subsequent Statement of Responsibility", repeatable: true, mandatory: false, tips: ["Declarações subsequentes de responsabilidade."] },
                { code: "h", label: "Piece Number", repeatable: true, mandatory: false, tips: ["Número/identificação sequencial da peça."] },
                { code: "i", label: "Piece Name", repeatable: true, mandatory: false, tips: ["Nome/designação específica da peça."] },
                { code: "k", label: "Publication, Distribution, etc.", repeatable: true, mandatory: false, tips: ["Informações sobre publicação/distribuição da peça."] },
                { code: "m", label: "Material Specific Details", repeatable: true, mandatory: false, tips: ["Detalhes específicos do material da peça."] },
                { code: "n", label: "Note on Piece", repeatable: true, mandatory: false, tips: ["Notas específicas sobre a peça física."] },
                { code: "p", label: "Physical Description", repeatable: true, mandatory: false, tips: ["Descrição física detalhada da peça."] },
                { code: "u", label: "Uniform Resource Identifier", repeatable: true, mandatory: false, tips: ["URI para acesso à peça, se disponível digitalmente."] },
                { code: "v", label: "Volume Number", repeatable: true, mandatory: false, tips: ["Número de volume, se aplicável."] },
                { code: "x", label: "ISSN", repeatable: true, mandatory: false, tips: ["Número ISSN associado à peça, se aplicável."] },
                { code: "y", label: "CODEN", repeatable: true, mandatory: false, tips: ["Código CODEN associado à peça, se aplicável."] },
                { code: "z", label: "ISBN", repeatable: true, mandatory: false, tips: ["Número ISBN associado à peça, se aplicável."] },
                { code: "5", label: "Institution to Which Field Applies", repeatable: true, mandatory: false, tips: ["Código da instituição à qual o campo se aplica."] },
                { code: "6", label: "Interfield Linking Data", repeatable: false, mandatory: false, tips: ["Dados de ligação entre campos."] }
            ]
        },
        {
            tag: "464",
            name: "PIECE-ANALYTIC",
            ind1Tips: ["# - Não definido"],
            ind2Tips: ["0 - Do not make a note", "1 - Make a note"],
            tips: [
                "O campo 464 é usado para relacionar uma análise de parte específica de um recurso físico.",
                "Este campo estabelece uma relação analítica entre um item físico e seu conteúdo intelectual parcial.",
                "Diferente do campo 463 (PIECE) que trata da unidade física, este foca no conteúdo intelectual de partes específicas.",
                "O segundo indicador controla se uma nota explicativa deve ser gerada automaticamente a partir dos dados do campo.",
                "Usado para vincular análises de capítulos, artigos em coletâneas, ou partes intelectuais de recursos físicos.",
                "Particularmente útil para análise de conteúdos em coleções ou recursos compostos."
            ],
            subFieldDef: [
                { code: "0", label: "Record Control Number", repeatable: false, mandatory: false, tips: ["Número de controlo do registo bibliográfico da análise."] },
                { code: "t", label: "Title", repeatable: true, mandatory: true, tips: ["Título da parte analisada."] },
                { code: "a", label: "General Material Designation", repeatable: true, mandatory: false, tips: ["Designação geral do material da parte analisada."] },
                { code: "b", label: "Other Title Information", repeatable: true, mandatory: false, tips: ["Outras informações relacionadas ao título analisado."] },
                { code: "c", label: "Qualifying Information", repeatable: true, mandatory: false, tips: ["Informação qualificadora do título analisado."] },
                { code: "d", label: "Place of Publication", repeatable: true, mandatory: false, tips: ["Local de publicação da parte analisada."] },
                { code: "e", label: "Analytic Identification", repeatable: true, mandatory: false, tips: ["Identificação específica da análise (ex.: 'Capítulo 3')."] },
                { code: "f", label: "First Statement of Responsibility", repeatable: true, mandatory: false, tips: ["Primeira declaração de responsabilidade da parte analisada."] },
                { code: "g", label: "Subsequent Statement of Responsibility", repeatable: true, mandatory: false, tips: ["Declarações subsequentes de responsabilidade."] },
                { code: "h", label: "Number of Part/Section", repeatable: true, mandatory: false, tips: ["Número/identificação da parte analisada."] },
                { code: "i", label: "Name of Part/Section", repeatable: true, mandatory: false, tips: ["Nome da parte analisada."] },
                { code: "k", label: "Publication, Distribution, etc.", repeatable: true, mandatory: false, tips: ["Informações sobre publicação/distribuição da parte analisada."] },
                { code: "l", label: "Language of Analytic", repeatable: false, mandatory: false, tips: ["Idioma da parte analisada (código ISO 639-2)."] },
                { code: "m", label: "Material Specific Details", repeatable: true, mandatory: false, tips: ["Detalhes específicos do material analisado."] },
                { code: "n", label: "Note on Analytic", repeatable: true, mandatory: false, tips: ["Notas específicas sobre a análise."] },
                { code: "p", label: "Physical Description", repeatable: true, mandatory: false, tips: ["Descrição física da parte analisada."] },
                { code: "u", label: "Uniform Resource Identifier", repeatable: true, mandatory: false, tips: ["URI para acesso à parte analisada, se disponível digitalmente."] },
                { code: "v", label: "Volume Number", repeatable: true, mandatory: false, tips: ["Número de volume onde a parte aparece, se aplicável."] },
                { code: "x", label: "ISSN", repeatable: true, mandatory: false, tips: ["Número ISSN associado à parte analisada, se aplicável."] },
                { code: "y", label: "CODEN", repeatable: true, mandatory: false, tips: ["Código CODEN associado à parte analisada, se aplicável."] },
                { code: "z", label: "ISBN", repeatable: true, mandatory: false, tips: ["Número ISBN associado à parte analisada, se aplicável."] },
                { code: "5", label: "Institution to Which Field Applies", repeatable: true, mandatory: false, tips: ["Código da instituição à qual o campo se aplica."] },
                { code: "6", label: "Interfield Linking Data", repeatable: false, mandatory: false, tips: ["Dados de ligação entre campos."] }
            ]
        },
        {
            tag: "470",
            name: "RESOURCE REVIEWED",
            ind1Tips: ["# - Não definido"],
            ind2Tips: ["0 - Do not make a note", "1 - Make a note"],
            tips: [
                "O campo 470 é usado para relacionar um recurso que foi objeto de análise ou resenha no item descrito.",
                "Este campo estabelece uma relação entre uma resenha/crítica e o recurso que está sendo avaliado.",
                "Diferente dos campos de tradução ou reprodução, aqui o foco é na relação crítica entre recursos.",
                "O segundo indicador controla se uma nota explicativa deve ser gerada automaticamente a partir dos dados do campo.",
                "Usado para vincular resenhas publicadas aos trabalhos originais que estão sendo resenhados.",
                "Particularmente útil para artigos de revisão, críticas literárias e análises acadêmicas."
            ],
            subFieldDef: [
                { code: "0", label: "Record Control Number", repeatable: false, mandatory: false, tips: ["Número de controlo do registo bibliográfico do recurso resenhado."] },
                { code: "t", label: "Title", repeatable: true, mandatory: true, tips: ["Título do recurso que foi resenhado/analisado."] },
                { code: "a", label: "General Material Designation", repeatable: true, mandatory: false, tips: ["Designação geral do material do recurso resenhado."] },
                { code: "b", label: "Other Title Information", repeatable: true, mandatory: false, tips: ["Outras informações relacionadas ao título resenhado."] },
                { code: "c", label: "Qualifying Information", repeatable: true, mandatory: false, tips: ["Informação qualificadora sobre o recurso resenhado."] },
                { code: "d", label: "Place of Publication", repeatable: true, mandatory: false, tips: ["Local de publicação do recurso resenhado."] },
                { code: "e", label: "Review Details", repeatable: true, mandatory: false, tips: ["Detalhes específicos sobre a resenha (ex.: 'Resenha crítica')."] },
                { code: "f", label: "First Statement of Responsibility", repeatable: true, mandatory: false, tips: ["Primeira declaração de responsabilidade do recurso resenhado."] },
                { code: "g", label: "Subsequent Statement of Responsibility", repeatable: true, mandatory: false, tips: ["Declarações subsequentes de responsabilidade."] },
                { code: "h", label: "Number of Part/Section", repeatable: true, mandatory: false, tips: ["Número/identificação da parte resenhada, se aplicável."] },
                { code: "i", label: "Name of Part/Section", repeatable: true, mandatory: false, tips: ["Nome da parte resenhada, se aplicável."] },
                { code: "k", label: "Publication, Distribution, etc.", repeatable: true, mandatory: false, tips: ["Informações sobre publicação/distribuição do recurso resenhado."] },
                { code: "l", label: "Language of Reviewed Item", repeatable: false, mandatory: false, tips: ["Idioma do recurso resenhado (código ISO 639-2)."] },
                { code: "m", label: "Review Type", repeatable: true, mandatory: false, tips: ["Tipo de resenha (ex.: 'crítica', 'análise acadêmica')."] },
                { code: "n", label: "Note on Review", repeatable: true, mandatory: false, tips: ["Notas específicas sobre a relação de resenha."] },
                { code: "p", label: "Physical Description", repeatable: true, mandatory: false, tips: ["Descrição física do recurso resenhado."] },
                { code: "u", label: "Uniform Resource Identifier", repeatable: true, mandatory: false, tips: ["URI para acesso ao recurso resenhado, se disponível."] },
                { code: "v", label: "Volume Number", repeatable: true, mandatory: false, tips: ["Número de volume do recurso resenhado, se aplicável."] },
                { code: "x", label: "ISSN", repeatable: true, mandatory: false, tips: ["Número ISSN do recurso resenhado, se aplicável."] },
                { code: "y", label: "CODEN", repeatable: true, mandatory: false, tips: ["Código CODEN do recurso resenhado, se aplicável."] },
                { code: "z", label: "ISBN", repeatable: true, mandatory: false, tips: ["Número ISBN do recurso resenhado."] },
                { code: "5", label: "Institution to Which Field Applies", repeatable: true, mandatory: false, tips: ["Código da instituição à qual o campo se aplica."] },
                { code: "6", label: "Interfield Linking Data", repeatable: false, mandatory: false, tips: ["Dados de ligação entre campos."] }
            ]
        },
        {
            tag: "481",
            name: "ALSO BOUND IN THIS VOLUME",
            ind1Tips: ["# - Não definido"],
            ind2Tips: ["0 - Do not make a note", "1 - Make a note"],
            tips: [
                "O campo 481 é usado para relacionar outros recursos que estão encadernados no mesmo volume físico que o recurso descrito.",
                "Este campo estabelece uma relação física entre itens que compartilham a mesma encadernação.",
                "Diferente dos campos de conteúdo relacionado, aqui o foco é na unidade física compartilhada.",
                "O segundo indicador controla se uma nota explicativa deve ser gerada automaticamente a partir dos dados do campo.",
                "Usado para documentos encadernados juntos (como coleções de panfletos ou obras diversas em um único volume).",
                "Particularmente útil para materiais históricos e coleções especiais com encadernações compostas."
            ],
            subFieldDef: [
                { code: "0", label: "Record Control Number", repeatable: false, mandatory: false, tips: ["Número de controlo do registo bibliográfico do item encadernado junto."] },
                { code: "t", label: "Title", repeatable: true, mandatory: true, tips: ["Título do recurso encadernado no mesmo volume."] },
                { code: "a", label: "General Material Designation", repeatable: true, mandatory: false, tips: ["Designação geral do material do item encadernado junto."] },
                { code: "b", label: "Other Title Information", repeatable: true, mandatory: false, tips: ["Outras informações relacionadas ao título do item encadernado."] },
                { code: "e", label: "Binding Information", repeatable: true, mandatory: false, tips: ["Informações específicas sobre a encadernação conjunta."] },
                { code: "f", label: "First Statement of Responsibility", repeatable: true, mandatory: false, tips: ["Primeira declaração de responsabilidade do item encadernado."] },
                { code: "g", label: "Subsequent Statement of Responsibility", repeatable: true, mandatory: false, tips: ["Declarações subsequentes de responsabilidade."] },
                { code: "h", label: "Number of Part/Section", repeatable: true, mandatory: false, tips: ["Número/identificação do item na encadernação."] },
                { code: "i", label: "Name of Part/Section", repeatable: true, mandatory: false, tips: ["Nome do item na encadernação conjunta."] },
                { code: "k", label: "Publication, Distribution, etc.", repeatable: true, mandatory: false, tips: ["Informações sobre publicação/distribuição do item encadernado."] },
                { code: "m", label: "Material Specific Details", repeatable: true, mandatory: false, tips: ["Detalhes específicos do material encadernado."] },
                { code: "n", label: "Note on Binding", repeatable: true, mandatory: false, tips: ["Notas específicas sobre a encadernação conjunta."] },
                { code: "p", label: "Physical Description", repeatable: true, mandatory: false, tips: ["Descrição física do item encadernado."] },
                { code: "u", label: "Uniform Resource Identifier", repeatable: true, mandatory: false, tips: ["URI para acesso ao item encadernado, se disponível digitalmente."] },
                { code: "v", label: "Volume Designation", repeatable: true, mandatory: false, tips: ["Designação do volume compartilhado."] },
                { code: "x", label: "ISSN", repeatable: true, mandatory: false, tips: ["Número ISSN do item encadernado, se aplicável."] },
                { code: "y", label: "CODEN", repeatable: true, mandatory: false, tips: ["Código CODEN do item encadernado, se aplicável."] },
                { code: "z", label: "ISBN", repeatable: true, mandatory: false, tips: ["Número ISBN do item encadernado, se aplicável."] },
                { code: "5", label: "Institution to Which Field Applies", repeatable: true, mandatory: false, tips: ["Código da instituição à qual o campo se aplica."] },
                { code: "6", label: "Interfield Linking Data", repeatable: false, mandatory: false, tips: ["Dados de ligação entre campos."] }
            ]
        },
        {
            tag: "482",
            name: "BOUND WITH",
            ind1Tips: ["# - Não definido"],
            ind2Tips: ["0 - Do not make a note", "1 - Make a note"],
            tips: [
                "O campo 482 é usado para relacionar um recurso que está fisicamente encadernado com o item descrito no registro.",
                "Este campo estabelece uma relação física de encadernação conjunta entre múltiplos itens.",
                "Funciona como o inverso do campo 481 (ALSO BOUND IN THIS VOLUME), ligando um item individual à encadernação coletiva.",
                "O segundo indicador controla se uma nota explicativa deve ser gerada automaticamente a partir dos dados do campo.",
                "Usado para documentos que foram encadernados juntos posteriormente à sua publicação original.",
                "Particularmente útil para materiais de coleções especiais e obras raras com encadernações históricas."
            ],
            subFieldDef: [
                { code: "0", label: "Record Control Number", repeatable: false, mandatory: false, tips: ["Número de controlo do registo bibliográfico da encadernação coletiva."] },
                { code: "t", label: "Title", repeatable: true, mandatory: true, tips: ["Título da encadernação coletiva ou do volume que contém este item."] },
                { code: "a", label: "General Material Designation", repeatable: true, mandatory: false, tips: ["Designação geral do material da encadernação coletiva."] },
                { code: "b", label: "Other Title Information", repeatable: true, mandatory: false, tips: ["Outras informações relacionadas ao título da encadernação."] },
                { code: "e", label: "Binding Description", repeatable: true, mandatory: false, tips: ["Descrição física da encadernação conjunta."] },
                { code: "f", label: "First Statement of Responsibility", repeatable: true, mandatory: false, tips: ["Primeira declaração de responsabilidade da encadernação."] },
                { code: "g", label: "Subsequent Statement of Responsibility", repeatable: true, mandatory: false, tips: ["Declarações subsequentes de responsabilidade."] },
                { code: "h", label: "Position in Binding", repeatable: true, mandatory: false, tips: ["Posição/ordem deste item na encadernação conjunta."] },
                { code: "i", label: "Name of Binding Collection", repeatable: true, mandatory: false, tips: ["Nome da coleção ou conjunto de encadernação."] },
                { code: "k", label: "Publication, Distribution, etc.", repeatable: true, mandatory: false, tips: ["Informações sobre publicação/distribuição da encadernação."] },
                { code: "m", label: "Material Specific Details", repeatable: true, mandatory: false, tips: ["Detalhes específicos da encadernação física."] },
                { code: "n", label: "Note on Binding", repeatable: true, mandatory: false, tips: ["Notas específicas sobre a encadernação conjunta."] },
                { code: "p", label: "Physical Description", repeatable: true, mandatory: false, tips: ["Descrição física completa da encadernação."] },
                { code: "u", label: "Uniform Resource Identifier", repeatable: true, mandatory: false, tips: ["URI para acesso à encadernação digitalizada, se disponível."] },
                { code: "v", label: "Volume Designation", repeatable: true, mandatory: false, tips: ["Designação do volume onde este item está encadernado."] },
                { code: "x", label: "ISSN", repeatable: true, mandatory: false, tips: ["Número ISSN da encadernação coletiva, se aplicável."] },
                { code: "y", label: "CODEN", repeatable: true, mandatory: false, tips: ["Código CODEN da encadernação, se aplicável."] },
                { code: "z", label: "ISBN", repeatable: true, mandatory: false, tips: ["Número ISBN da encadernação coletiva, se aplicável."] },
                { code: "5", label: "Institution to Which Field Applies", repeatable: true, mandatory: false, tips: ["Código da instituição à qual o campo se aplica."] },
                { code: "6", label: "Interfield Linking Data", repeatable: false, mandatory: false, tips: ["Dados de ligação entre campos."] }
            ]
        },
        {
            tag: "488",
            name: "OTHER RELATED WORK",
            ind1Tips: ["# - Não definido"],
            ind2Tips: ["0 - Do not make a note", "1 - Make a note"],
            tips: [
                "O campo 488 é usado para relacionar trabalhos que têm uma associação com o recurso descrito, mas que não se encaixam em categorias de relacionamento mais específicas.",
                "Este campo estabelece relações genéricas entre recursos quando nenhum campo mais específico (como 45X) é apropriado.",
                "Diferente de outros campos de relacionamento, este serve como uma categoria geral para associações diversas.",
                "O segundo indicador controla se uma nota explicativa deve ser gerada automaticamente a partir dos dados do campo.",
                "Usado para vincular recursos com relações não-hierárquicas e não-específicas.",
                "Particularmente útil para relações complexas ou múltiplas que não se enquadram em outros campos."
            ],
            subFieldDef: [
                { code: "0", label: "Record Control Number", repeatable: false, mandatory: false, tips: ["Número de controlo do registo bibliográfico do trabalho relacionado."] },
                { code: "t", label: "Title", repeatable: true, mandatory: true, tips: ["Título do trabalho relacionado."] },
                { code: "a", label: "General Material Designation", repeatable: true, mandatory: false, tips: ["Designação geral do material do trabalho relacionado."] },
                { code: "b", label: "Other Title Information", repeatable: true, mandatory: false, tips: ["Outras informações relacionadas ao título do trabalho relacionado."] },
                { code: "c", label: "Qualifying Information", repeatable: true, mandatory: false, tips: ["Informação qualificadora sobre a natureza do relacionamento."] },
                { code: "d", label: "Place of Publication", repeatable: true, mandatory: false, tips: ["Local de publicação do trabalho relacionado."] },
                { code: "e", label: "Relationship Information", repeatable: true, mandatory: false, tips: ["Descrição textual da natureza do relacionamento."] },
                { code: "f", label: "First Statement of Responsibility", repeatable: true, mandatory: false, tips: ["Primeira declaração de responsabilidade do trabalho relacionado."] },
                { code: "g", label: "Subsequent Statement of Responsibility", repeatable: true, mandatory: false, tips: ["Declarações subsequentes de responsabilidade."] },
                { code: "h", label: "Number of Part/Section", repeatable: true, mandatory: false, tips: ["Número/identificação da parte relacionada, se aplicável."] },
                { code: "i", label: "Name of Part/Section", repeatable: true, mandatory: false, tips: ["Nome da parte relacionada, se aplicável."] },
                { code: "k", label: "Publication, Distribution, etc.", repeatable: true, mandatory: false, tips: ["Informações sobre publicação/distribuição do trabalho relacionado."] },
                { code: "l", label: "Language of Work", repeatable: false, mandatory: false, tips: ["Idioma do trabalho relacionado (código ISO 639-2)."] },
                { code: "m", label: "Relationship Type", repeatable: true, mandatory: false, tips: ["Tipo de relacionamento (ex.: 'companion to', 'response to')."] },
                { code: "n", label: "Note on Relationship", repeatable: true, mandatory: false, tips: ["Notas específicas sobre a natureza do relacionamento."] },
                { code: "p", label: "Physical Description", repeatable: true, mandatory: false, tips: ["Descrição física do trabalho relacionado."] },
                { code: "u", label: "Uniform Resource Identifier", repeatable: true, mandatory: false, tips: ["URI para acesso ao trabalho relacionado, se disponível."] },
                { code: "v", label: "Volume Number", repeatable: true, mandatory: false, tips: ["Número de volume do trabalho relacionado, se aplicável."] },
                { code: "x", label: "ISSN", repeatable: true, mandatory: false, tips: ["Número ISSN do trabalho relacionado, se aplicável."] },
                { code: "y", label: "CODEN", repeatable: true, mandatory: false, tips: ["Código CODEN do trabalho relacionado, se aplicável."] },
                { code: "z", label: "ISBN", repeatable: true, mandatory: false, tips: ["Número ISBN do trabalho relacionado."] },
                { code: "5", label: "Institution to Which Field Applies", repeatable: true, mandatory: false, tips: ["Código da instituição à qual o campo se aplica."] },
                { code: "6", label: "Interfield Linking Data", repeatable: false, mandatory: false, tips: ["Dados de ligação entre campos."] }
            ]
        }



    ]

    await Promise.all(
        dataFieldDefinitionsData.map(def =>
            prisma.dataFieldDefinition.create({
                data: {
                    tag: def.tag,
                    name: def.name,
                    ind1Name: Array.isArray(def.ind1Name) ? def.ind1Name.join(", ") : def.ind1Name ?? "",
                    ind2Name: Array.isArray(def.ind2Name) ? def.ind2Name.join(", ") : def.ind2Name ?? "",
                    ind1Tips: def.ind1Tips,
                    ind2Tips: def.ind2Tips,
                    tips: def.tips,
                    subFieldDef: {
                        create: def.subFieldDef.map(sub => ({
                            code: sub.code,
                            label: sub.label,
                            repeatable: sub.repeatable,
                            mandatory: sub.mandatory,
                            tips: sub.tips
                        }))
                    }
                }
            })
        )
    )

    console.log({ adminRole, userRole, adminUser })
}

main()
    .catch((e) => {
        throw e;
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
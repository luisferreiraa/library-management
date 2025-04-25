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
                {
                    code: "$a",
                    label: "Number (ISBN)",
                    repeatable: false,
                    mandatory: true,
                    tips: [
                        "Um ISBN definido corretamente, incluindo hífens.",
                        "O ISBN é definido pela entidade designada em cada país."
                    ]
                },
                {
                    code: "$b",
                    label: "Qualification",
                    repeatable: true,
                    mandatory: false,
                    tips: [
                        "Uma indicação do âmbito do ISBN no subcampo $a (se presente), geralmente o nome de um editor, uma indicação da encadernação do recurso, ou uma indicação da relação de um ISBN com um conjunto ou com um volume em particular.",
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
                    label: "Erroneous ISBN",
                    repeatable: true,
                    mandatory: false,
                    tips: [
                        "Um ISBN que foi identificado como tendo sido incorretamente aplicado ao recurso ou que não é válido.",
                        "Pode ter sido atribuído a duas publicações diferentes e, neste caso, cancelado ou pode ter sido incorretamente impresso."
                    ]
                },
                {
                    code: "$6",
                    label: "Interfield Linking Data",
                    repeatable: true,
                    mandatory: false,
                    tips: [
                        "Este subcampo contém informações que permitem que o campo seja ligado, para efeitos de processamento, a outros campos no registo.",
                    ]
                },
            ]
        },
        {
            tag: "011",
            name: "International Standard Serial Number (ISSN)",
            ind1Name: "Level of Interest Indicator",
            ind1Tips: [
                "#: Não especificado/ Não aplicável",
                "0: Continuing resource of international or national interest",
                "1: Continuing resource of local interest",
            ],
            ind2Name: "Cluster Identifier Indicator",
            ind2Tips: [
                "#: Não especificado/ Não aplicável",
                "0: ISSN-L",
                "1: ISSN-H"
            ],
            tips: [
                "Este campo contém um ISBN e uma qualificação que o distingue quando mais do que um está contido num registo.",
                "Área de Identificação de Recursos e Termos de Disponibilidade. O campo pode conter os termos de disponibilidade e ou preço, mesmo que não contenha ISBN."
            ],
            subFieldDef: [
                {
                    code: "$a",
                    label: "Number (ISSN)",
                    repeatable: false,
                    mandatory: true,
                    tips: [
                        "Um ISBN definido corretamente, incluindo hífens entre o quarto e quinto dígitos.",
                    ]
                },
                {
                    code: "$b",
                    label: "Qualification",
                    repeatable: false,
                    mandatory: false,
                    tips: [
                        "Utilizado para distinguir entre ISSN se um registo contiver mais do que um.",
                        "Não utilizado pelo ISSN International Center."
                    ]
                },
                {
                    code: "$d",
                    label: "Terms of Availability and/ or Price",
                    repeatable: true,
                    mandatory: false,
                    tips: [
                        "O preço do recurso e qualquer comentário sobre a sua disponibilidade.",
                    ]
                },
                {
                    code: "$f",
                    label: "Cluster ISSN Identifier",
                    repeatable: false,
                    mandatory: false,
                    tips: [
                        "Um ISSN designado pela rede ISSN para ligar recursos com relações específicas entre si como as versões média (ISSN-L) e os títulos anteriores (ISSN-H).",
                        "O prefixo adequado para o tipo de ISSN indicado pelo segundo valor do indicador pode ser gerado para display."
                    ]
                },
                {
                    code: "$g",
                    label: "Cancelled Cluster ISSN",
                    repeatable: true,
                    mandatory: false,
                    tips: [
                        "Um ISSN de agrupamento que foi associado ao recurso, mas que foi posteriormente anulado, frequentemente porque foi atribuído um ISSN de agrupamento duplicado.",
                        "Cada ISSN de agrupamento anulado está contido num ficheiro separado $g."
                    ]
                },
                {
                    code: "$y",
                    label: "Cancelled ISSN",
                    repeatable: true,
                    mandatory: false,
                    tips: [
                        "Inclui qualquer ISSN que tenha sido válido anteriormente, mas que tenha sido anulado por um centro ISSN.",
                    ]
                },
                {
                    code: "$z",
                    label: "Erroneous ISSN or Cluster ISSN",
                    repeatable: true,
                    mandatory: false,
                    tips: [
                        "Inclui qualquer ISSN ou Cluster ISSN incorreto, não registado em $g ou $y.",
                        "Normalmente resultado de um erro de impressão."
                    ]
                },
                {
                    code: "$2",
                    label: "Source",
                    repeatable: false,
                    mandatory: false,
                    tips: [
                        "Uma identificação sob a forma codificada para o sistema de onde provém o identificador",
                        "O ISSN Center responsável pela atribuição e manutenção dos ISSN e/ ou Cluster ISSN."
                    ]
                },
                {
                    code: "$3",
                    label: "Authority Record Identifier or Standard Number",
                    repeatable: false,
                    mandatory: false,
                    tips: [
                        "O identificador ou o número normalizado do registo de autoridade ou do registo de classificação correspondente, ou o identificador normalizado.",
                        "O identificador pode ter a forma de texto ou de um identificador Uniforme de Recursos (URI).",
                        "Se o identificador for texto, o número de controlo ou identificador é precedido pelo código de organização adequado do Identificador Internacional Normalizado para Bibliotecas e Organizações Relacionadas (ISIL) ou da Lista de Códigos MARC para Organizações.",
                        " Não é utilizado um parêntesis anterior quando o identificador é fornecido como protocolo de recuperação da Web, por exemplo, HTTP URI.",
                        "O subcampo pode conter um URI que identifica um nome ou etiqueta de uma entidade. Quando desreferenciado, o URI aponta para informações que descrevem esse nome. Um URI que identifica diretamente a própria entidade está contido em $R."
                    ]
                },
                {
                    code: "$R",
                    label: "Real World Object URI",
                    repeatable: true,
                    mandatory: false,
                    tips: [
                        "Um URI que identifica uma entidade, é por vezes referido como uma Coisa, um Objeto do Mundo Real ou RWO, quer seja real ou conceptual.",
                        "Um URI que identifica um nome ou rótulo para uma entidade está contido em $3."
                    ]
                },


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
                {
                    code: "$a",
                    label: "Fingerprint",
                    repeatable: false,
                    mandatory: true,
                    tips: [
                        "Calculated Fingerprint Identifier. O Fingerprint é designado pela agência que cria o registo.",
                    ]
                },
                {
                    code: "$2",
                    label: "Source",
                    repeatable: false,
                    mandatory: false,
                    tips: [
                        "Uma identificação em forma de código com origem no sistema de onde o fingerprint identifier é originário.",
                    ]
                },
                {
                    code: "$5",
                    label: "Institution to which the Field Applies",
                    repeatable: false,
                    mandatory: false,
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
                {
                    code: "$a",
                    label: "Number (ISMN)",
                    repeatable: false,
                    mandatory: true,
                    tips: [
                        "Um ISMN corretamente aplicado, incluindo hífenes.",
                        "Os ISMN são atribuídos pela agência designada de cada país."
                    ]
                },
                {
                    code: "$b",
                    label: "Qualification",
                    repeatable: false,
                    mandatory: false,
                    tips: [
                        "Uma indicação do âmbito do ISMN no subcampo $a (se presente), normalmente o nome de um editor, uma indicação da ligação do recurso ou uma indicação da relação de um ISMN com um conjunto ou com um volume específico.",
                    ]
                },
                {
                    code: "$d",
                    label: "Terms of Availability and/ or Price",
                    repeatable: false,
                    mandatory: false,
                    tips: [
                        "O preço do recurso e qualquer comentário sobre a sua disponibilidade.",
                        "Se existir um campo 010 ISBN e o conteúdo deste subcampo se limitar a repetir o que está em 010$d, o subcampo pode ser omitido.",
                    ]
                },
                {
                    code: "$z",
                    label: "Erroneous ISMN",
                    repeatable: true,
                    mandatory: false,
                    tips: [
                        "Um ISMN que foi identificado como tendo sido incorretamente aplicado a um recurso ou que é inválido.",
                        "Pode ter sido atribuído a duas publicações diferentes e, neste caso, cancelado, ou pode ter sido incorretamente impresso.",
                    ]
                },
                {
                    code: "$6",
                    label: "Interfield Linking Data",
                    repeatable: true,
                    mandatory: false,
                    tips: [
                        "Este subcampo contém informações que permitem que o campo seja ligado, para efeitos de processamento, a outros campos no registo",
                    ]
                },
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
                {
                    code: "$a",
                    label: "Article Identifier",
                    repeatable: false,
                    mandatory: true,
                },
                {
                    code: "$z",
                    label: "Erroneous Article Identifier",
                    repeatable: true,
                    mandatory: false,
                },
                {
                    code: "$2",
                    label: "Source",
                    repeatable: false,
                    mandatory: false,
                    tips: [
                        "O subcampo contém uma identificação do sistema no âmbito do qual o identificador foi construído.",
                    ]
                },
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
                {
                    code: "$a",
                    label: "Number (ISRN)",
                    repeatable: false,
                    mandatory: true,
                    tips: [
                        "Um ISRN corretamente aplicado, incluindo hífenes.",
                        "Os ISRN são atribuídos pela agência designada de cada país."
                    ]
                },
                {
                    code: "$b",
                    label: "Qualification",
                    repeatable: false,
                    mandatory: false,
                    tips: [
                        "Uma indicação do âmbito do ISRN no subcampo $a (se presente), normalmente o nome de um editor, uma indicação da ligação do recurso ou uma indicação da relação de um ISRN com um conjunto ou com um volume específico.",
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
            name: "Coded Data Field: Cartographic Resources - Scale and Co-ordinates",
            ind1Name: "Type of Scale Code Indicator",
            ind1Tips: [
                "0: Scale indeterminable",
                "1: Single scale",
                "2: Multiple scales",
                "3: Range of scales",
                "4: Approximate scale"
            ],
            ind2Tips: [
                "#: Em branco (não definido)",
            ],
            tips: [
                "Este campo contém os dados de escala e coordenadas tal como são introduzidos no campo 206, mas de forma codificada. Foi concebido antes do lançamento do FRBR e do IFLA LRM, bem como das regras de catalogação que conformar-se com elas.",
                "De acordo com o FRBR/IFLA LRM, algumas das informações transportadas neste campo refere-se a entidades FRBR/IFLA LRM que não a Manifestação.",
                "Tais dados devem ser preferencialmente carregado em registos de autoridade vinculados que descrevem a entidade relacionada relevante, em vez de no registo descrevendo a Manifestação. No entanto, estes dados podem ainda ser encontrados em registos bibliográficos que descrevem manifestações sob determinadas condições, especialmente quando os registos são/foram criados num contexto LRM pré-FRBR/IFLA ou não-FRBR/IFLA.",
                "Repetível quando o recurso contém material em diferentes escalas e com diferentes coordenadas."
            ],
            subFieldDef: [
                {
                    code: "$a",
                    label: "Type of Scale",
                    tips: [
                        "Obrigatório. Não repetível. Um código de um caractere que indica o tipo de escala com os seguintes valores:",
                        "a linear scale",
                        "b angular scale",
                        "z other type of scale (e.g., time scale, quantitative statistical scale)"
                    ],
                    repeatable: false,
                    mandatory: true,
                },
                {
                    code: "$b",
                    label: "Constant Ratio Linear Horizontal Scale",
                    tips: [
                        "A escala horizontal sob a forma do denominador de uma fracção representativa. Usado para planetário como bem como recursos cartográficos terrestres. Repetível."
                    ],
                    repeatable: true,
                    mandatory: false,
                },
                {
                    code: "$c",
                    label: "Constant Ratio Linear Vertical Scale",
                    tips: [
                        "A escala vertical sob a forma do denominador de uma fracção representativa. Usado também para planetários como recursos terrestres. Repetível."
                    ],
                    repeatable: true,
                    mandatory: false,
                },
                {
                    code: "$d",
                    label: "Co-ordinates - Westernmost Longitude",
                    repeatable: false,
                    mandatory: false,
                },
                {
                    code: "$e",
                    label: "Co-ordinates - Easternmost Longitude",
                    repeatable: false,
                    mandatory: false,
                },
                {
                    code: "$f",
                    label: "Co-ordinates - Northernmost Longitude",
                    repeatable: false,
                    mandatory: false,
                },
                {
                    code: "$g",
                    label: "Co-ordinates - Southernmost Longitude",
                    tips: [
                        "Coordenadas para recursos planetários ou terrestres. Cada subcampo está fixado em 8 caracteres e não é repetível.",
                    ],
                    repeatable: false,
                    mandatory: false,
                },
                {
                    code: "$h",
                    label: "Angular Scale",
                    tips: [
                        "A escala angular dos mapas celestes sob a forma de um número de 4 caracteres justificado à direita e preenchido com zeros, dando a escala em termos de milímetros para um grau. Repetível.",
                    ],
                    repeatable: true,
                    mandatory: false,
                },
                {
                    code: "$i",
                    label: "Declination - Northern Limit",
                    repeatable: false,
                    mandatory: false,
                },
                {
                    code: "$j",
                    label: "Declination - Southern Limit",
                    repeatable: false,
                    mandatory: false,
                },
                {
                    code: "$k",
                    label: "Right Ascension - Eastern Limits",
                    repeatable: false,
                    mandatory: false,
                },
                {
                    code: "$m",
                    label: "Right Ascension - Western Limits",
                    tips: [
                        "Coordenadas para recursos cartográficos celestes. Os subcampos não são repetíveis. Os subcampos $i e $j são cada um 8 caracteres de comprimento e contém as mesmas componentes dos subcampos $f e $g (ver acima), excepto que a posição do caractere 0 contém um sinal de mais (para o hemisfério celeste norte) ou um sinal de menos (para o hemisfério hemisfério celeste sul).",
                    ],
                    repeatable: false,
                    mandatory: false,
                },
                {
                    code: "$n",
                    label: "Equinox",
                    tips: [
                        "O equinócio para os recursos cartográficos celestes com o ano inserido de acordo com o calendário gregoriano como uma data de quatro caracteres justificada à direita com zeros. Não repetível.",
                    ],
                    repeatable: false,
                    mandatory: false,
                },
                {
                    code: "$o",
                    label: "Epoch",
                    tips: [
                        "A época dos recursos cartográficos celestes com o ano inserido de acordo com o calendário gregoriano como uma data de quatro caracteres justificada à direita com zeros. Não repetível.",
                    ],
                    repeatable: false,
                    mandatory: false,
                },
                {
                    code: "$p",
                    label: "Planet to which the Field Applies",
                    tips: [
                        "Este subcampo indica se as coordenadas registadas nos subcampos $d-$g se aplicam à Terra ou a outro planeta, ou para um satélite desses corpos. Obrigatório, exceto para os recursos cartográficos relacionados com os mapas terrestres e celestes.",
                        "O planeta é expresso na posição 0-1, enquanto a posição 2 indica se o corpo é um satélite do planeta codificado em pos. 0-1."
                    ],
                    repeatable: false,
                    mandatory: true,
                },
            ]
        },
        {
            tag: "124",
            name: "Coded Data Field: Cartographic Resources - Specific Material Designation Analysis",
            ind1Tips: [
                "#: Em branco (não definido)",
            ],
            ind2Tips: [
                "#: Em branco (não definido)",
            ],
            tips: [
                "Este campo contém dados codificados de comprimento fixo relacionados com as características de tipos de imagens fotográficas, não fotográficas e de deteção remota de características cartográficas."
            ],
            subFieldDef: [
                {
                    code: "$a",
                    label: "Character of Image",
                    tips: [
                        "Código de 1 caractere. Não repetível."
                    ],
                    repeatable: false,
                    mandatory: false,
                },
                {
                    code: "$b",
                    label: "Form of Cartographic Resource",
                    tips: [
                        "Código de 1 caractere. Repetível."
                    ],
                    repeatable: true,
                    mandatory: false,
                },
                {
                    code: "$c",
                    label: "Presentation Technique for Photographic or Non-Photographic Image",
                    tips: [
                        "Código de 2 caracteres. Repetível."
                    ],
                    repeatable: true,
                    mandatory: false,
                },
                {
                    code: "$d",
                    label: "Position of Platform for Photographic or Remote Sensing Image",
                    tips: [
                        "Código de 1 caractere. Repetível."
                    ],
                    repeatable: true,
                    mandatory: false,
                },
                {
                    code: "$e",
                    label: "Category of Satellite for Remote Sensing Image",
                    tips: [
                        "Código de 1 caractere. Repetível."
                    ],
                    repeatable: true,
                    mandatory: false,
                },
                {
                    code: "$f",
                    label: "Name of Satellite for Remote Sensing Image",
                    tips: [
                        "Código de 2 caracteres. Repetível."
                    ],
                    repeatable: true,
                    mandatory: false,
                },
            ]
        },
        {
            tag: "125",
            name: "Coded Data Field: Sound Recordings and Music",
            ind1Tips: [
                "#: Em branco (não definido)",
            ],
            ind2Tips: [
                "#: Em branco (não definido)",
            ],
            tips: [
                "Este campo descreve o formato da música, observa se existem partes e codifica o tipo de texto literário para atuações não musicais."
            ],
            subFieldDef: [
                {
                    code: "$a",
                    label: "Format of Notated Music",
                    tips: [
                        "Os códigos indicam os aspetos do formato da música notada. O subcampo tem 2 caracteres de comprimento. Não repetível.",
                        "Subcampo $a elementos de dados de comprimento fixo:",
                        "Type of Score: 1 char/ Pos: 0",
                        "Parts Indicator: 1 char/ Pos: 1",
                    ],
                    repeatable: false,
                    mandatory: false,
                },
                {
                    code: "$b",
                    label: "Literary Text Indicator (Non-Music Performance)",
                    tips: [
                        "Código de 2 caracteres. Não repetível."
                    ],
                    repeatable: false,
                    mandatory: false,
                },
                {
                    code: "$c",
                    label: "Multiple Musical Formats",
                    tips: [
                        "Comprimento variável. Não repetível."
                    ],
                    repeatable: false,
                    mandatory: false,
                },
            ]
        },
        {
            tag: "126",
            name: "Coded Data Field: Sound Recordings - Physical Attributes",
            ind1Tips: [
                "#: Em branco (não definido)",
            ],
            ind2Tips: [
                "#: Em branco (não definido)",
            ],
            tips: [
                "Este campo contém dados codificados relacionados com os atributos físicos das gravações sonoras.",
                "Este campo foi projetado antes do lançamento do FRBR e do IFLA LRM, pelo que todos os dados deste campo são relevantes para o contexto LRM pré-FRBR/IFLA ou não-FRBR/IFLA.",
                "De acordo com o FRBR/IFLA LRM, alguns dados neste campo são preferencialmente transportados na autoridade vinculada dados (ver Campos Relacionados) que descrevem a entidade relacionada relevante, a menos que a informação pertença à entidade manifestação.",
            ],
            subFieldDef: [
                {
                    code: "$a",
                    label: "Sound Recording Coded Data (General)",
                    tips: [
                        "Os códigos indicam os aspetos gerais da gravação sonora.",
                        "O subcampo tem 15 caracteres de comprimento. Não repetível.",
                        "Subcampo $a elementos de dados de comprimento fixo:",
                        "Form of Release 1 0",
                        "Speed 1 1",
                        "Kind of Sound 1 2",
                        "Groove Width 1 3",
                        "Dimensions (Sound Recordings) 1 4",
                        "Tape Width 1 5",
                        "Tape Configuration 1 6",
                        "Accompanying Textual Material 6 7-12",
                        "Recording Technique 1 13",
                        "Special Reproduction Characteristics 1 14"
                    ],
                    repeatable: false,
                    mandatory: false,
                },
                {
                    code: "$b",
                    label: "Sound Recording Coded Data (Detail)",
                    tips: [
                        "Os códigos indicam os aspetos detalhados da gravação sonora.",
                        "O subcampo tem 3 caracteres de comprimento. Não repetível.",
                        "Este subcampo é apenas utilizado para o contexto LRM pré-FRBR/IFLA. Não utilize este subcampo se estiver a catalogar o código é baseado no FRBR/IFLA LRM.",
                        "Elementos de dados de comprimento fixo do subcampo $b:",
                        "Kind of Disc or Cylinder 1 1",
                        "Kind of Material 1 1",
                        "Kind of Cutting 1 2"
                    ],
                    repeatable: false,
                    mandatory: false,
                },
            ]
        },
        {
            tag: "127",
            name: "Coded Data Field: Duration of Sound Recordings and Notated Music",
            ind1Tips: [
                "#: Em branco (não definido)",
            ],
            ind2Tips: [
                "#: Em branco (não definido)",
            ],
            tips: [
                "O campo contém um ou mais números de seis caracteres correspondentes à duração de uma manifestação consistindo ou contendo gravações sonoras ou uma parte de uma gravação sonora, ou ao valor estimado duração de uma composição conforme consta na partitura que está a ser descrita.",
            ],
            subFieldDef: [
                {
                    code: "$a",
                    label: "Duration",
                    tips: [
                        "Este subcampo contém uma sequência numérica de seis caracteres que representa a duração de uma manifestação consistindo ou contendo gravações sonoras ou uma secção de uma gravação sonora, ou a duração estimada de qualquer composição musical contida na manifestação.",
                        "O tempo está dividido em três subelementos, cada um com dois caracteres, representando o número de horas, minutos e segundos.",
                        "Cada subelemento é justificado à direita; posições não utilizadas contêm espaços em branco ou zeros. Repetível.",
                    ],
                    repeatable: true,
                    mandatory: false,
                },
            ]
        },
        {
            tag: "128",
            name: "Coded Data Field: Form of Musical Work and Key or Mode",
            ind1Tips: [
                "#: Em branco (não definido)",
            ],
            ind2Tips: [
                "#: Em branco (não definido)",
            ],
            tips: [
                "Este campo descreve a forma e a tonalidade ou modo de uma obra musical.",
                "Foi concebido antes do lançamento do FRBR e do IFLA LRM, bem como das regras de catalogação que conformar-se com elas.",
                "De acordo com o FRBR/IFLA LRM, algumas das informações transportadas neste campo refere-se a entidades FRBR/IFLA LRM que não a Manifestação.",
                "Tais dados devem ser preferencialmente carregado em registos de autoridade vinculados que descrevem a entidade relacionada relevante, em vez de no registo descrevendo a Manifestação.",
                "No entanto, estes dados podem ainda ser encontrados em registos bibliográficos que descrevem manifestações sob determinadas condições, especialmente quando os registos são/foram criados num contexto LRM pré-FRBR/IFLA ou não-FRBR/IFLA.",
            ],
            subFieldDef: [
                {
                    code: "$a",
                    label: "Form of Musical Work",
                    tips: [
                        "Contém um código que indica a forma de uma obra musical.",
                        "Se existir mais do que um formulário, o subcampo é repetido.",
                        "Utilize os códigos mantidos e atualizados pela IAML (Associação Internacional de Bibliotecas e Arquivos Musicais) e Centros de Documentação Musical).",
                    ],
                    repeatable: true,
                    mandatory: false,
                },
                {
                    code: "$d",
                    label: "Key or Mode of Musical Work",
                    tips: [
                        "Contém um código que indica a tonalidade ou o modo eclesiástico da obra musical, se significativo.",
                        "As tonalidades maiores são indicado com uma letra “a”-“g”, tons menores com uma letra “a”-“g” seguida de “m”; sustenidos com “x”, bemóis com “b” a seguir o código da chave.",
                        "Os modos eclesiásticos “gregorianos” são indicados com um número “01”-“13” (EX 4). Não repetível.",
                        "Utilize os códigos mantidos e atualizados pela IAML (Associação Internacional de Bibliotecas e Arquivos Musicais) e Centros de Documentação Musical).",
                    ],
                    repeatable: false,
                    mandatory: false,
                },
            ]
        },
        {
            tag: "130",
            name: "Coded Data Field: Microforms - Physical Attributes",
            ind1Tips: [
                "#: Em branco (não definido)",
            ],
            ind2Tips: [
                "#: Em branco (não definido)",
            ],
            tips: [
                "Este campo contém dados codificados relacionados com microformas.",
                "Repetível quando mais do que uma microforma é descrita num único registo bibliográfico.",
                "Este campo foi projetado antes do lançamento do FRBR e do IFLA LRM, pelo que todos os dados deste campo são relevantes para o contexto LRM pré-FRBR/IFLA ou não-FRBR/IFLA.",
                "De acordo com o FRBR/IFLA LRM, alguns dados neste campo são preferencialmente transportados na autoridade vinculada dados (ver Campos Relacionados) que descrevem a entidade relacionada relevante, a menos que a informação pertença à entidade manifestação.",
            ],
            subFieldDef: [
                {
                    code: "$a",
                    label: "Mircroform Coded Data - Physical Attributes",
                    tips: [
                        "Os códigos indicam os atributos físicos da microforma.",
                        "O subcampo tem 11 caracteres de comprimento. Não repetível.",
                        "Subcampo $a elementos de dados de comprimento fixo:",
                        "Specific Material Designation 1 0",
                        "Polarity 1 1",
                        "Dimensions 1 2",
                        "Reduction Ratio 1 3",
                        "Specific Reduction Ratio 3 4-6",
                        "Colour 1 7",
                        "Emulsion on Film 1 8",
                        "Generation 1 9",
                        "Base of Film 1 10"
                    ],
                    repeatable: false,
                    mandatory: false,
                },
            ]
        },
        {
            tag: "131",
            name: "Coded Data Field: Cartographic Resources - Geodetic, Gridand Vertical Measurement",
            ind1Tips: [
                "#: Em branco (não definido)",
            ],
            ind2Tips: [
                "#: Em branco (não definido)",
            ],
            tips: [
                "Este campo contém dados codificados relativos aos detalhes geodésicos, de grelha e de medição vertical de recursos cartográficos.",
            ],
            subFieldDef: [
                {
                    code: "$a",
                    label: "Spheroid",
                    tips: [
                        "Um código de dois caracteres indica o esferóide utilizado para construir o mapa. Repetível.",
                    ],
                    repeatable: true,
                    mandatory: false,
                },
                {
                    code: "$b",
                    label: "Horizontal Datum",
                    tips: [
                        "Um código de três caracteres utilizado para indicar o(s) datum(s) horizontal(ais) nomeado(s) no recurso cartográfico. Repetível para cada dado.",
                    ],
                    repeatable: true,
                    mandatory: false,
                },
                {
                    code: "$c",
                    label: "Grid and Referencing System",
                    tips: [
                        "A two-character code indicating the main grid or referencing system. This code (and those in subfields $d and $e) includes the spheroid of construction of the grid (as opposed to the spheroid of construction of the map given in subfield $a). Repeatable.",
                    ],
                    repeatable: true,
                    mandatory: false,
                },
                {
                    code: "$d",
                    label: "Overlapping and Referencing System",
                    tips: [
                        "Um código de dois caracteres que indica uma grelha subsidiária ou sistema de referência que se estende pela face de o recurso cartográfico. Repetível.",
                    ],
                    repeatable: true,
                    mandatory: false,
                },
                {
                    code: "$e",
                    label: "Secondary Grid and Referencing System",
                    tips: [
                        "Um código de dois caracteres que indica uma grelha subsidiária ou sistema de referência que aparece sob a forma de carraças marginais. Repetível.",
                    ],
                    repeatable: true,
                    mandatory: false,
                },
                {
                    code: "$f",
                    label: "Vertical Datum",
                    tips: [
                        "Um código de dois caracteres utilizado para indicar o(s) datum(s) vertical(ais) nomeado(s) no recurso cartográfico. Repetível para cada dado.",
                    ],
                    repeatable: true,
                    mandatory: false,
                },
                {
                    code: "$g",
                    label: "Unit of Measurement of Heighting",
                    tips: [
                        "Um código de dois caracteres que indica a unidade de medida de altura. Repetível.",
                    ],
                    repeatable: true,
                    mandatory: false,
                },
                {
                    code: "$h",
                    label: "Contour Interval",
                    tips: [
                        "Até quatro caracteres indicando o valor do intervalo dos contornos principais (ou seja, aqueles contornos que aparecem sempre quando aplicável) na unidade de medida fornecida no subcampo $g.",
                        "Até uma casa decimal podem ser registados, os valores com mais de uma casa decimal devem ser arredondados para um.",
                        "Repetível para cada valor quando, por exemplo, o valor varia com a altura.",
                    ],
                    repeatable: true,
                    mandatory: false,
                },
                {
                    code: "$i",
                    label: "Supplementary Contour Interval",
                    tips: [
                        "Até quatro caracteres indicando o valor do intervalo de contornos suplementares, ou seja, contornos utilizados entre as curvas de nível principais para aumentar a expressão topográfica da área (por exemplo, em áreas de baixo relevo) ou contornos cujo valor não se repete na superfície do mapa.",
                        "A unidade de medida é aquela que é dada em subcampo $g.",
                        "Podem ser registados até uma casa decimal, os valores com mais de uma casa decimal devem ser arredondado para um. Repetível.",
                    ],
                    repeatable: true,
                    mandatory: false,
                },
                {
                    code: "$j",
                    label: "Unit of Measurement of Bathymetry",
                    repeatable: true,
                    mandatory: false,
                },
                {
                    code: "$k",
                    label: "Bathymetric Interval",
                    repeatable: true,
                    mandatory: false,
                },
                {
                    code: "$l",
                    label: " Supplementary Bathymetric Interval",
                    tips: [
                        "O equivalente oceanográfico dos subcampos $g a $i. As regras para estes subcampos aplicam-se aos subcampos $j a $l. Repetível.",
                    ],
                    repeatable: true,
                    mandatory: false,
                },
            ]
        },
        {
            tag: "135",
            name: "Coded Data Field: Electronic Resources",
            ind1Tips: [
                "#: Em branco (não definido)",
            ],
            ind2Tips: [
                "#: Em branco (não definido)",
            ],
            tips: [
                "Este campo contém dados codificados relacionados com recursos eletrónicos.",
                "Repetível quando mais do que um tipo de ficheiro/programa de software é descrito no mesmo registo.",
                "Este campo foi projetado antes do lançamento do FRBR e do IFLA LRM, pelo que todos os dados deste campo são relevantes para o contexto LRM pré-FRBR/IFLA ou não-FRBR/IFLA.",
                "De acordo com o FRBR/IFLA LRM, alguns dados neste campo são preferencialmente transportados na autoridade vinculada dados (ver Campos Relacionados) que descrevem a entidade relacionada relevante, a menos que a informação pertença à entidade manifestação."
            ],
            subFieldDef: [
                {
                    code: "$a",
                    label: "Coded Data for Electronic Resource",
                    tips: [
                        "Os códigos indicam os aspetos do recurso eletrónico.",
                        "O subcampo tem 13 caracteres de comprimento. Não repetível.",
                        "Subcampo $a elementos de dados de comprimento fixo:",
                        "Type of Electronic Resource 1 0",
                        "Special Material Designation 1 1",
                        "Colour 1 2",
                        "Dimensions 1 3",
                        "Sound 1 4",
                        "Image Bit Depth 3 5-7",
                        "Number of File Formats 1 8",
                        "Quality Assurance Target(s) 1 9",
                        "Antecedent/Source 1 10",
                        "Level of Compression 1 11",
                        "Reformatting Quality 1 12"
                    ],
                    repeatable: false,
                    mandatory: false,
                },
            ]
        },
        {
            tag: "140",
            name: "Coded Data Field: Antoquarian - General",
            ind1Tips: [
                "#: Em branco (não definido)",
            ],
            ind2Tips: [
                "#: Em branco (não definido)",
            ],
            tips: [
                "Este campo contém dados codificados de comprimento fixo relacionados com a forma física de publicações monográficas mais antigas (antiquárias) e também materiais posteriores descritos em detalhes bibliográficos semelhantes.",
            ],
            subFieldDef: [
                {
                    code: "$a",
                    label: "Antiquarian Coded Data – General",
                    tips: [
                        "Os códigos indicam os aspetos do recurso antiquário.",
                        "O subcampo tem 28 caracteres de comprimento. Não repetível.",
                        "Subcampo $a elementos de dados de comprimento fixo:",
                        "Illustration Codes – Book 4 0-3",
                        "Illustration Codes – Full Page Plates 4 4-7",
                        "Illustration Code – Technique 1 8",
                        "Form of Contents Code 8 9-16",
                        "Literature Code 2 17-18",
                        "Biography Code 1 19",
                        "Support Material – Book 1 20",
                        "Support Material – Plates 1 21",
                        "Watermark Code 1 22",
                        "Printer’s Device Code 1 23",
                        "Publisher’s Device Code 1 24",
                        "Ornamental Device Code 1 25",
                        "Unassigned 2 26-27"
                    ],
                    repeatable: false,
                    mandatory: false,
                },
            ]
        },
        {
            tag: "141",
            name: "Coded Data Field: Item Specific Attributes",
            ind1Tips: [
                "#: Em branco (não definido)",
            ],
            ind2Tips: [
                "#: Em branco (não definido)",
            ],
            tips: [
                "Este campo contém dados de comprimento fixo relacionados com os atributos específicos da encadernação e do corpo de um item de um livro.",
                "Repetível se o registo contiver detalhes de mais do que uma cópia.",
            ],
            subFieldDef: [
                {
                    code: "$a",
                    label: "Coded Data - Item Specific Attributes",
                    tips: [
                        "Os códigos indicam os atributos do artigo.",
                        "O subcampo tem 8 caracteres de comprimento. Não repetível.",
                        "Subcampo $a elementos de dados de comprimento fixo:",
                        "Binding Material Code – General 3 0-2",
                        "Types of Binding Code 1 3",
                        "'Bound with' Code 1 4",
                        "State of Preservation Code – Binding –",
                        "General 1 5",
                        "State of Preservation Code – Body of the Book – General 2 6-7"
                    ],
                    repeatable: false,
                    mandatory: false,
                },
                {
                    code: "$b",
                    label: "Binding Specific Characteristics",
                    tips: [
                        "Os códigos indicam características específicas de encadernação do artigo do Código de Material de Encadernação – Geral ($a/0-2).",
                        "O subcampo tem 8 caracteres de comprimento. Não repetível.",
                        "Elementos de dados de comprimento fixo do subcampo $b:",
                        "Primary Binding Material 2 0 - 1",
                        "Secondary Binding Material 2 2 - 3",
                        "Binding Decoration 1 4",
                        "Decoration Motifs 1 5",
                        "Binding Pieces 1 6",
                        "Boards 1 7"
                    ],
                    repeatable: false,
                    mandatory: false,
                },
                {
                    code: "$c",
                    label: "Age",
                    tips: [
                        "O século relativo à encadernação da cópia. Não repetível."
                    ],
                    repeatable: false,
                    mandatory: false,
                },

            ]
        },
    ]

    await Promise.all(
        dataFieldDefinitionsData.map(def =>
            prisma.dataFieldDefinition.create({
                data: {
                    tag: def.tag,
                    name: def.name,
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
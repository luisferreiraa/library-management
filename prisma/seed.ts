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
            ind1Tips: ["Não definido"],
            ind2Tips: ["Não definido"],
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
            ind1Tips: ["Não definido"],
            ind2Tips: ["Não definido"],
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
            ind1Tips: ["Não definido"],
            ind2Tips: ["Não definido"],
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
            ind1Tips: ["Não definido"],
            ind2Tips: ["Não definido"],
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
            ind1Tips: ["Não definido"],
            ind2Tips: ["Não definido"],
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
            ind2Tips: ["Não definido"],
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
            ind1Tips: ["Não definido"],
            ind2Tips: ["Não definido"],
            tips: [
                "Contém informações sobre o tipo e extensão dos recursos eletrónicos, de acordo com a ISBD(ER).",
                "Usado para designar o tipo de ficheiro e número de ficheiros de um recurso digital."
            ],
            subFieldDef: [
                { code: "a", label: "Designation and Extent of File", repeatable: false, mandatory: true, tips: ["Designação do tipo de ficheiro e extensão (ex: número de ficheiros, bytes, registros)."] }
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
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
            name: "Language of the Resource",
            ind1Name: "Translation Indicator",
            ind1Tips: [
                "0: O recurso está na(s) língua(s) original(ais) da obra",
                "1: O recurso é uma tradução da obra original ou uma obra intermédia",
                "2: O recurso contém traduções para além dos resumos traduzidos",
                "8: Os dados relativos à expressão da obra são codificados num registo separado da autoridade que descreve essa expressão."
            ],
            ind2Name: "Source of Code",
            ind2Tips: [
                "#: ISO 639-2 language code",
                "7: Fonte especificada no subcampo $2",
            ],
            tips: [
                "Este campo contém informação codificada relativa à língua ou línguas utilizadas na manifestação que está a ser descrita.",
                "Foi concebido antes do lançamento do FRBR e do IFLA LRM, bem como das regras de catalogação que estão em conformidade com eles.",
                "De acordo com o FRBR/IFLA LRM, algumas das informações contidas neste campo pertencem a entidades FRBR/IFLA LRM que não a manifestação. Esses dados devem, de preferência, ser transportados em registos de autoridade ligados que descrevam a entidade relacionada relevante e não no registo que descreve a Manifestação.",
                "No entanto, esses dados podem ainda ser incluídos em registos bibliográficos que descrevam manifestações em determinadas condições, especialmente quando os registos são/foram criados num contexto LRM pré-FRBR/IFLA ou num contexto LRM não-FRBR/IFLA."
            ],
            subFieldDef: [
                {
                    code: "$a",
                    label: "Language of Text, Soundtrack, etc",
                    tips: [
                        "O idioma do texto, da banda sonora, etc. Repetível quando o texto está em mais do que um idioma.",
                    ],
                    repeatable: true,
                    mandatory: false,
                },
                {
                    code: "$b",
                    label: "Language of Intermediate Text when Resource is not Translated from Original",
                    tips: [
                        "O idioma de qualquer tradução intermédia (EX 2, 4, 6). Repetível quando o texto é traduzido de mais do que um idioma intermédio (EX 6), ou quando a tradução ocorreu através de mais do que um idioma intermédio (por exemplo, grego - latim - francês - inglês).",
                    ],
                    repeatable: true,
                    mandatory: false,
                },
                {
                    code: "$c",
                    label: "Language of Original Work",
                    tips: [
                        "O idioma da obra original quando o recurso a registar é uma tradução (EX 1, 2, 4, 6, 8).",
                        "Repetível quando o original está em mais de um idioma.",
                    ],
                    repeatable: false,
                    mandatory: false,
                },
                {
                    code: "$d",
                    label: "Language of Summary",
                    tips: [
                        "O idioma de quaisquer resumos ou abstracts do recurso ou de obras, artigos, etc. contidos no mesmo.",
                        "Repetível quando o recurso contém resumos em mais de um idioma.",
                    ],
                    repeatable: false,
                    mandatory: false,
                },
                {
                    code: "$e",
                    label: "Language of Contents Page",
                    tips: [
                        "O idioma do índice quando este difere da idioma do texto (EX 3).",
                        "Repetível para cada idioma da(s) página(s) de índice.",
                    ],
                    repeatable: false,
                    mandatory: false,
                },
                {
                    code: "$f",
                    label: "Language of Preferred Source of Information for the Title Page when it Differs from the Language or Languages of the Text",
                    tips: [
                        "Repetível para cada idioma da página de rosto.",
                    ],
                    repeatable: true,
                    mandatory: false,
                },
                {
                    code: "$g",
                    label: "Language of Title Proper if not First Language of Text, Soundtrack, etc.",
                    tips: [
                        "O idioma do título propriamente dito quando difere do idioma da primeira ou única ocorrência do subcampo $a (EX 1).",
                        "Não é repetível, uma vez que o título próprio é, por definição, num único idioma.",
                        "Quaisquer repetições do título propriamente dito noutros idiomas são títulos paralelos e o seu idioma é indicado num subcampo $z no campo 200."
                    ],
                    repeatable: false,
                    mandatory: false,
                },
                {
                    code: "$h",
                    label: "Language of Libretto, etc.",
                    tips: [
                        "O idioma ou idiomas do texto quando o recurso que está a ser catalogado inclui o conteúdo vocal/textual da(s) obra(s) impressa(s) como texto, quer como material de acompanhamento ou impresso com o recurso.",
                        "Note-se que este subcampo não se limita aos libretos propriamente ditos.",
                    ],
                    repeatable: true,
                    mandatory: false,
                },
                {
                    code: "$i",
                    label: "Language of Accompanying Material (Other than Summaries, Abstracts or Librettos)",
                    tips: [
                        "O idioma ou idiomas  do material de acompanhamento, como notas de programa, prefácios, comentários, instruções do sítio , etc.",
                    ],
                    repeatable: true,
                    mandatory: false,
                },
                {
                    code: "$j",
                    label: "Language of Subtitles",
                    tips: [
                        "O(s) idioma(s) das legendas (títulos sobrepostos) de filmes, quando diferente(s) do idioma da banda sonora.",
                    ],
                    repeatable: true,
                    mandatory: false,
                },
                {
                    code: "$2",
                    label: "Source",
                    tips: [
                        "Uma identificação em forma codificada para o esquema de códigos linguísticos a partir do qual o código é derivado. Utilizar apenas quando o segundo código contiver o valor 7 (Fonte especificada no subcampo $2).",
                    ],
                    repeatable: true,
                    mandatory: false,
                },
            ]
        },
        {
            tag: "102",
            name: "Country of Publication or Production",
            ind1Tips: [
                "#: Em branco (não definido)",
            ],
            ind2Tips: [
                "#: Em branco (não definido)",
            ],
            tips: [
                "Este campo contém códigos para um ou mais países de publicação ou produção do recurso.",
            ],
            subFieldDef: [
                {
                    code: "$a",
                    label: "Country of Publication",
                    tips: [
                        "Contém um código que representa o país em que o recurso foi publicado ou produzido.",
                        "Para os códigos do país, utilizar a norma ISO 3166-1.",
                        "Repetível se o recurso for publicado em mais de um país ou em mais de uma localidade do mesmo país"
                    ],
                    repeatable: true,
                    mandatory: false,
                },
                {
                    code: "$b",
                    label: "Locality (non-ISO)",
                    tips: [
                        "Um código que representa a localidade, quando é necessário um código mais específico.",
                        "Repetível se houver mais de um código de país. Os códigos são retirados de outras listas de códigos para além da ISO 3166-2.",
                        "Os pormenores da lista de códigos são indicados no subcampo $2"
                    ],
                    repeatable: true,
                    mandatory: false,
                },
                {
                    code: "$c",
                    label: "Locality (ISO)",
                    tips: [
                        "Um código que representa a localidade, quando é necessário um código mais específico.",
                        "Repetível se houver mais de um código de país. Os códigos devem ser retirados da norma ISO 3166-2."
                    ],
                    repeatable: true,
                    mandatory: false,
                },
                {
                    code: "$2",
                    label: "Source of non-ISO Code",
                    tips: [
                        "A fonte do código utilizado no subcampo $b. Para uma lista de fontes de códigos, ver apêndice A.",
                        "Repetível se houver mais de um código de país"
                    ],
                    repeatable: true,
                    mandatory: false,
                },
            ]
        },
        {
            tag: "105",
            name: "Coded Data Field: Textual Language Material, Monographic",
            ind1Tips: [
                "#: Em branco (não definido)",
            ],
            ind2Tips: [
                "#: Em branco (não definido)",
            ],
            tips: [
                "Este campo contém dados codificados relativos a material linguístico monográfico.",
                "Recomenda-se que esteja sempre presente nos registos de materiais linguísticos monográficos impressos."
            ],
            subFieldDef: [
                {
                    code: "$a",
                    label: "Monograph Coded Data",
                    tips: [
                        "Os códigos indicam aspectos do material linguístico monográfico.",
                        "O subcampo tem um comprimento de 13 caracteres. Não repetível.",
                        "Illustration Codes 4 0-3",
                        "Form of Contents Codes 4 4-7",
                        "Conference or Meeting Code 1 8",
                        "Festschrift Indicator 1 9",
                        "Index Indicator 1 10",
                        "Literature Code 1 11",
                        "Biography Code 1 12"
                    ],
                    repeatable: false,
                    mandatory: true,
                },
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
            name: "Coded Data Field: Continuing Resources",
            ind1Tips: [
                "#: Em branco (não definido)",
            ],
            ind2Tips: [
                "#: Em branco (não definido)",
            ],
            tips: [
                "Este campo contém dados codificados relativos a recursos contínuos, incluindo séries monográficas catalogadas como séries e não como monografias individuais.",
                "Recomenda-se que esteja sempre presente nos registos de recursos contínuos.",
            ],
            subFieldDef: [
                {
                    code: "$a",
                    label: "Continuing Resource Coded Data",
                    tips: [
                        "Os códigos indicam aspetos de recursos contínuos.",
                        "O subcampo tem 11 caracteres de comprimento. Não repetível.",
                        "Type of Continuing Resource Designator 1 0",
                        "Frequency of Issue 1 1",
                        "Regularity 1 2",
                        "Type of Material Code 1 3",
                        "Nature of Contents Code 3 4-6",
                        "Conference Publication Indicator 1 7",
                        "Title Page Availability Codes 1 8",
                        "Index Availability Code 1 9",
                        "Cumulative Index Availability Code 1 l0"
                    ],
                    repeatable: false,
                    mandatory: true,
                },
            ]
        },
        {
            tag: "111",
            name: "Coded Data Field: Visual Projections, Video Recordings and Motion Pictures",
            ind1Tips: [
                "#: Em branco (não definido)",
            ],
            ind2Tips: [
                "#: Em branco (não definido)",
            ],
            tips: [
                "Este campo contém dados codificados de comprimento fixo aplicáveis a projeções visuais, gravações de vídeo e movimento fotos.",
                "Este campo foi projetado antes do lançamento do FRBR e do IFLA LRM, pelo que todos os dados deste campo são relevantes para o contexto LRM pré-FRBR/IFLA ou não-FRBR/IFLA.",
                "De acordo com o FRBR/IFLA LRM, alguns dados neste campo são preferencialmente transportados na autoridade vinculada dados que descrevem a entidade relacionada relevante (ver Campos Relacionados), a menos que a informação pertença à entidade manifestação."
            ],
            subFieldDef: [
                {
                    code: "$a",
                    label: "Coded Data - General",
                    tips: [
                        "Os códigos indicam aspetos de projeção visual, gravação de vídeo ou filme.",
                        "O subcampo tem 20 caracteres de comprimento. Não repetível.",
                        "Type of Material 1 0",
                        "Length 3 1-3",
                        "Colour Indicator 1 4",
                        "Sound Indicator 1 5",
                        "Media for Sound 1 6",
                        "Width or Dimensions 1 7",
                        "Form of Release – Visual Projection, Motion Picture 1 8",
                        "Technique – Video recording, Motion Picture 1 9",
                        "Presentation Format – Motion Picture 1 10",
                        "Accompanying Material 4 11-14",
                        "Form of Release – Video recording 1 15",
                        "Presentation Format – Video recording 1 16",
                        "Base of Emulsion Material – Visual Projection 1 17",
                        "Secondary Support Material – Visual Projection 1 18",
                        "Broadcast Standard – Video recording 1 19"
                    ],
                    repeatable: false,
                    mandatory: false,
                },
                {
                    code: "$b",
                    label: "Motion Picture Coded Data Archival",
                    tips: [
                        "Os códigos indicam aspetos de filmes.",
                        "O subcampo tem 15 caracteres de comprimento. Não repetível.",
                        "Generation 1 0",
                        "Production Elements 1 1",
                        "Refined Categories of Colour for Moving Pictures 1 2",
                        "Film Emulsion (Polarity) 1 3",
                        "Film Base 1 4",
                        "Kind of Sound for Moving Images 1 5",
                        "Kind of Film Stock or Print 1 6",
                        "Deterioration Stage 1 7",
                        "Completeness 1 8",
                        "Film Inspection Date 6 9-14",
                    ],
                    repeatable: false,
                    mandatory: false,
                },
            ]
        },
    ]

    console.log({ adminRole, userRole, adminUser })
}

main()
    .catch((e) => {
        throw e;
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
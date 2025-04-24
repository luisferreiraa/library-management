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
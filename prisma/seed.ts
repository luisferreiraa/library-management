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
                name: "RECORD IDENTIFIER",
                tips: [
                    "Este campo contém caracteres associados exclusivamente ao registo, ou seja, o identificador do registo da agência que o preparou.",
                    "Em conformidade com a norma ISO 2709, este campo não contém subcampos.",
                    "Em conformidade com a norma ISO 2709, este campo não contém indicadores.",
                    "Quando consiste ou incorpora qualquer forma de um ISN, a informação deve ser inserida no campo especificado para estes dados, além de as registar como identificador de registo neste campo."
                ]
            },
            {
                tag: "003",
                name: "PERSISTENT RECORD IDENTIFIER",
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
                name: "VERSION IDENTIFIER",
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
            name: "INTERNATIONAL STANDARD BOOK NUMBER (ISBN)",
            ind1Tips: ["# - Em branco (não definido)"],
            ind2Tips: ["# - Em branco (não definido)"],
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
            name: "INTERNATIONAL STANDARD SERIAL NUMBER (ISSN)",
            ind1Name: "Level of Interest Indicator",
            ind1Tips: ["#: Não especificado/ Não aplicável, 0: Continuing resource of international or national interest, 1: Continuing resource of local interest"],
            ind2Name: "Cluster Identifier Indicator",
            ind2Tips: ["# - Não especificado/ Não aplicável, 0 - ISSN-L, 1 - ISSN-H"],
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
                    code: "3", label: "Authority Record Identifier or Standard Number", repeatable: false, mandatory: false, tips: [
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
            name: "FINGERPRINT IDENTIFIER",
            ind1Tips: ["# - Em branco (não definido)"],
            ind2Tips: ["# - Em branco (não definido)"],
            tips: [
                "Este campo contém o Fingerprint Identifier para publicações monográficas mais antigas (antiquários) e um código para a instituição a que o campo se aplica, que distingue entre Fingerprint Identifiers quando mais do que um está contido num registo.",
                "O campo corresponde ao identificador de recurso ISBD e aos termos da área de disponibilidade."
            ],
            subFieldDef: [
                { code: "a", label: "Fingerprint", repeatable: false, mandatory: true, tips: ["Calculated Fingerprint Identifier. O Fingerprint é designado pela agência que cria o registo."] },
                { code: "2", label: "Source", repeatable: false, mandatory: false, tips: ["Uma identificação em forma de código com origem no sistema de onde o fingerprint identifier é originário."] },
                {
                    code: "5", label: "Institution to which the Field Applies", repeatable: false, mandatory: false, tips: [
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
            name: "INTERNATIONAL STANDARD MUSIC NUMBER (ISMN)",
            ind1Tips: ["# - Em branco (não definido)"],
            ind2Tips: ["# - Em branco (não definido)"],
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
            name: "ARTICLE IDENTIFIER",
            ind1Tips: ["# - Em branco (não definido)"],
            ind2Tips: ["# - Em branco (não definido)"],
            tips: ["Este campo contém um código único e não ambíguo atribuído aos artigos de periódicos."],
            subFieldDef: [
                { code: "a", label: "Article Identifier", repeatable: false, mandatory: true },
                { code: "z", label: "Erroneous Article Identifier", repeatable: true, mandatory: false },
                { code: "2", label: "Source", repeatable: false, mandatory: false, tips: ["O subcampo contém uma identificação do sistema no âmbito do qual o identificador foi construído."] },
            ]
        },
        {
            tag: "015",
            name: "INTERNATIONAL STANDARD TECHNICAL REPORT NUMBER (ISRN)",
            ind1Tips: ["# - Em branco (não definido)"],
            ind2Tips: ["# - Em branco (não definido)"],
            tips: ["Este campo contém o número internacional normalizado de relatório técnico atribuído por um centro nacional ISRN", "Corresponde ao identificador de recurso ISBD e aos termos da área de disponibilidade"],
            subFieldDef: [
                { code: "a", label: "Number (ISRN)", repeatable: false, mandatory: true, tips: ["Um ISRN corretamente aplicado, incluindo hífenes.", "Os ISRN são atribuídos pela agência designada de cada país."] },
                { code: "b", label: "Qualification", repeatable: false, mandatory: false, tips: ["Uma indicação do âmbito do ISRN no subcampo $a (se presente), normalmente o nome de um editor, uma indicação da ligação do recurso ou uma indicação da relação de um ISRN com um conjunto ou com um volume específico."] },
                { code: "d", label: "Terms of Availability and/ or Price", repeatable: false, mandatory: false, tips: ["O preço do recurso e qualquer comentário sobre a sua disponibilidade."] },
                { code: "z", label: "Cancelled/ Invalid/ Erroneous ISRN", repeatable: true, mandatory: false, tips: ["Um ISRN que foi identificado como tendo sido incorretamente aplicado a um recurso ou que é inválido.", "Pode ter sido atribuído a duas publicações diferentes e, neste caso, cancelado, ou pode ter sido incorretamente impresso."] }
            ]
        },
        {
            tag: "017",
            name: "OTHER IDENTIFIER",
            ind1Name: "Type of Identifier",
            ind1Tips: ["7: System specified in subfield $2, 8: Unspecified type of identifier"],
            ind2Name: "Difference Indicator",
            ind2Tips: ["1: No difference, 2: Difference"],
            tips: [
                "Este campo contém um identificador, publicado no recurso que não pode ser acomodado noutro campo e uma qualificação que distingue entre identificadores quando mais do que um identificador do mesmo tipo está contido num registo.",
                "O campo corresponde ao identificador de recurso da ISBD e à área das condições de disponibilidade. O campo pode conter as condições de disponibilidade e/ou o preço, mesmo que não contenha um identificador.",
            ],
            subFieldDef: [
                { code: "a", label: "Identifier", repeatable: false, mandatory: true, tips: ["Um identificador corretamente formatado. Os números ou códigos são formulados de acordo com o tipo"] },
                { code: "b", label: "Qualification", repeatable: false, mandatory: false, tips: ["Uma indicação do âmbito do identificador nos subcampos $a (se presente), normalmente o nome do editor, uma identificação da ligação do recurso, ou uma indicação da relação de um identificador com um conjunto ou com um volume específico."] },
                { code: "d", label: "Terms of Availability and/ or Price", repeatable: false, mandatory: false, tips: ["O preço do recurso e qualquer comentário sobre a sua disponibilidade."] },
                { code: "z", label: "Erroneous Identifier", repeatable: true, mandatory: false, tips: ["Um identificador que foi identificado como tendo sido incorretamente aplicado ao recurso ou que é inválido. Pode ter sido atribuído a duas publicações ou produtos diferentes e, neste caso, cancelado, ou pode ter sido incorretamente impresso. Se não for conhecido um identificador válido do mesmo tipo, o subcampo $z pode aparecer sozinho no campo 017"] },
                { code: "2", label: "Source", repeatable: true, mandatory: false, tips: ["Uma identificação em forma codificada para o sistema do qual o identificador é derivado. Utilizar apenas quando o primeiro código do sítio contiver o valor 7 (sistema especificado no subcampo $2)."] },
            ]
        },
        {
            tag: "020",
            name: "NATIONAL BIBLIOGRAPHY NUMBER",
            ind1Tips: ["#: Em branco (não definido)"],
            ind2Tips: ["#: Em branco (não definido)"],
            tips: [
                "Uma identificação em forma codificada para o sistema do qual o identificador é derivado. Utilizar apenas quando o primeiro código do sítio contém o valor 7 (sistema especificado no subcampo d $2).",
            ],
            subFieldDef: [
                { code: "a", label: "Country Code", repeatable: false, mandatory: true, tips: ["Uma identificação do país da bibliografia nacional (EX 1-4). Dois caracteres. Para os códigos de país , utilizar a norma ISO 3166-1.d $2)."] },
                { code: "b", label: "Number", repeatable: false, mandatory: false, tips: ["O número como designado pela agência."] },
                { code: "z", label: "Erroneous Number", repeatable: true, mandatory: false, tips: ["Um identificador que foi identificado como tendo sido incorretamente aplicado ao recurso."] },
            ]
        },
        {
            tag: "021",
            name: "LEGAL DEPOSIT NUMBER",
            ind1Tips: ["#: Em branco (não definido)"],
            ind2Tips: ["#: Em branco (não definido)"],
            tips: [
                "Este campo contém o número atribuído ao recurso que está a ser registado pelo gabinete de depósito legal ou de direitos de autor em cada país.d $2).",
            ],
            subFieldDef: [
                { code: "a", label: "Country Code", repeatable: false, mandatory: true, tips: ["Uma identificação do país da agência de depósito legal que atribui o número. Para os códigos de país, utilizar ISO 3166-1. Dois caracteres.d $2). "] },
                { code: "b", label: "Number", repeatable: false, mandatory: false, tips: ["O número como designado pela agência."] },
                { code: "z", label: "Erroneous Number", repeatable: true, mandatory: false, tips: ["Um número erradamente atribuído ao recurso $2)."] },
            ]
        },
        {
            tag: "022",
            name: "GOVERNMENT PUBLICATION NUMBER",
            ind1Tips: ["#: Em branco (não definido)"],
            ind2Tips: ["#: Em branco (não definido)"],
            tips: [
                "Este campo contém o número atribuído a uma das suas próprias publicações ou a um recurso publicado em seu nome por um organismo governamental.d $2).",
            ],
            subFieldDef: [
                { code: "a", label: "Country Code", repeatable: false, mandatory: true, tips: ["Uma identificação do país em que o recurso é publicado (EX 1-3). Dois caracteres. Para os códigos do país , utilizar a norma ISO 3166-1."] },
                { code: "b", label: "Number", repeatable: false, mandatory: false, tips: ["O número como designado pelo organismo governamental."] },
                { code: "z", label: "Erroneous Number", repeatable: true, mandatory: false, tips: ["Um número erradamente atribuído a uma publicação governamental."] },
            ]
        },
        {
            tag: "033",
            name: "OTHER SYSTEM PERSISTENT RECORD IDENTIFIER",
            ind1Tips: ["#: Em branco (não definido)"],
            ind2Tips: ["#: Em branco (não definido)"],
            tips: [
                "Este campo contém o identificador persistente dos registos obtidos de outras fontes. O identificador persistente é atribuído pela agência que cria, utiliza ou emite o registo.",
                "Este é o identificador persistente para o registo bibliográfico, não para o recurso em si."
            ],
            subFieldDef: [
                { code: "a", label: "Persistent Record Identifier", repeatable: false, mandatory: true },
                { code: "z", label: "Cancelled or Invalid Persistent Record Identifier", repeatable: true, mandatory: false },
            ]
        },
        {
            tag: "035",
            name: "OTHER SYSTEM IDENTIFIERS",
            ind1Tips: ["#: Em branco (não definido)"],
            ind2Tips: ["#: Em branco (não definido)"],
            tips: [
                "Este campo contém o identificador dos registos obtidos a partir de outras fontes",
            ],
            subFieldDef: [
                {
                    code: "a", label: "System Identifier",
                    tips: [
                        "Um código para a organização entre parênteses, seguido do identificador de sistema para o registo na base de dados dessa organização",
                        "Uma vez que não existem códigos internacionalmente aceites, recomenda-se a utilização dos códigos da Lista de Códigos MARC para Organizações.",
                        "Caso contrário, pode ser utilizado o nome completo da agência ou um código nacional.",
                    ],
                    repeatable: false,
                    mandatory: true,
                },
                { code: "z", label: "Cancelled or Invalid Identifier", repeatable: true, mandatory: false },
            ]
        },
        {
            tag: "036",
            name: "MUSIC INCIPIT",
            ind1Tips: ["#: Em branco (não definido)"],
            ind2Tips: ["#: Em branco (não definido)"],
            tips: [
                "Este campo contém dados que descrevem o incipit musical para música em forma parcialmente codificada.",
                "Este campo é amplamente utilizado para identificar manuscritos de música, mas também pode ser aplicado à música impressa ou a outros recursos musicais (registos sonoros, etc.).",
            ],
            subFieldDef: [
                { code: "a", label: "Number of Work", tips: ["Um código de dois dígitos indica a obra a que o incipit se refere, se um conjunto de composições (por exemplo, seis sonatas) for inteiramente descrito num único registo, sem a utilização de registos de nível peça-analítico. Se o registo descrever apenas uma obra, utilizar '01'."], repeatable: false, mandatory: true },
                { code: "b", label: "Number of Movement", tips: ["Um código de dois dígitos indica o andamento dentro de uma obra a que o incipit se refere. Se a obra tiver apenas um andamento, utilizar '01'."], repeatable: false, mandatory: true },
                { code: "c", label: "Number of Incipit", tips: ["Um código de dois dígitos distingue os diferentes incipits referentes ao mesmo movimento. Se existir apenas um incipit para um movimento, utilizar '01'."], repeatable: false, mandatory: true },
                { code: "d", label: "Voice/ Instrument", tips: ["A voz ou o instrumento codificado em 036 $p. Obrigatório se 036 $p estiver presente."], repeatable: false, mandatory: false },
                { code: "e", label: "Role", tips: ["O nome do carácter que canta o incipit codificado em 036 $p."], repeatable: false, mandatory: false },
                { code: "f", label: "Movement Caption/ Heading", tips: ["Legenda ou título do movimento, tal como aparece na fonte."], repeatable: true, mandatory: false },
                { code: "g", label: "Key or Mode", tips: ["A tonalidade ou modo do movimento, se aplicável. Utilizar letras maiúsculas A-G para indicar as tonalidades maiores, minúsculas a-g para indicar as tonalidades menores, “x” para sustenidos e “b” para bemóis, números 1-12 para os modos gregorianos."], repeatable: false, mandatory: false },
                { code: "m", label: "Clef", tips: ["Código de três caracteres. Use “F” ou “C” ou 'G' maiúsculo para indicar a forma da clave, depois “-” como separador, depois números 1-5 para indicar a posição da clave na pauta, começando na linha de baixo. Usar “+” como separador para indicar a notação mensural.", "Obrigatório se 036 $p estiver presente, caso contrário não é válido."], repeatable: false, mandatory: false },
                { code: "n", label: "Key Signature", tips: ["Utilize “x” para indicar sustenidos e “b” para indicar bemóis, seguidos de F,C,G,D,A,E,B maiúsculos ou B,E,A,D,G,C,F respetivamente para indicar notas sustenidas ou bemóis."], repeatable: false, mandatory: false },
                { code: "o", label: "Time Signature", tips: ["O valor do tempo ou o sinal de mensuração indicado na pauta é transcrito com um símbolo (c, c/, c., o, etc.) e/ou um número (3, 2, c3, etc.) ou uma fração (4/4, 12/8, etc.)."], repeatable: false, mandatory: false },
                { code: "p", label: "Musical Notation", tips: ["Use os símbolos de notação do código Plaine & Easie ou do código DARMS para transcrever as primeiras notas da pauta selecionada."], repeatable: false, mandatory: false },
                { code: "q", label: "Comments (free text)", tips: ["Nota de texto livre."], repeatable: true, mandatory: false },
                { code: "r", label: "Codified Note", tips: ["Um código de um carácter indica uma nota de comentário. Utilizar “?” para indicar um erro no incipit, não corrigido, “+” para indicar um erro no incipit, corrigido, “t” para indicar que o incipit foi transcrito (por exemplo, da notação mensural)."], repeatable: true, mandatory: false },
                { code: "t", label: "Text Incipit", tips: ["O texto literário (se existir) tal como aparece na fonte. Se a fonte tiver vários textos, cada um deles é transcrito numa ocorrência separada de 036$t"], repeatable: true, mandatory: false },
                { code: "u", label: "Uniform Resource Identifier (URI)", tips: ["Um Identificador Uniforme de Recursos (URI), tal como um URL (Uniform Resource Locator) ou URN (Uniform Resource Name), serve como uma cadeia normalizada que identifica um recurso e fornece acesso eletrónico através de protocolos da Internet. ", "Isto permite a recuperação automática ou a interação com o recurso de uma forma consistente."], repeatable: false, mandatory: false },
                {
                    code: "z", label: "Language of Text", tips: [
                        "Identificação codificada da língua do incipit. Utilizar se o texto for diferente ou puder ser mal interpretado a partir de 101 Língua do recurso.",
                        "Quando o subcampo é repetido, a ordem dos códigos linguísticos deve refletir a extensão e importância das línguas na obra.",
                        "Se tal não for possível, introduzir os códigos da língua por ordem alfabética. O código “mul” pode ser introduzido quando se aplica um grande número de línguas no subcampo.",
                    ],
                    repeatable: true,
                    mandatory: false,
                },
                { code: "2", label: "Source", tips: ["Um código que especifica o sistema utilizado para codificar a notação musical.", "Um código de dois caracteres indica o código utilizado para transcrever em $p. Obrigatório se 036 $p estiver presente."], repeatable: false, mandatory: false },
            ]
        },
        {
            tag: "040",
            name: "CODEN",
            ind1Tips: ["#: Em branco (não definido)"],
            ind2Tips: ["#: Em branco (não definido)"],
            tips: ["Este campo contém um código único e inequívoco anteriormente atribuído aos títulos dos recursos contínuos pelo serviço internacional CODEN."],
            subFieldDef: [
                { code: "a", label: "CODEN", tips: ["O código de seis caracteres em que o último carácter é um dígito alfanumérico."], repeatable: false, mandatory: true },
                { code: "z", label: "Erroneous CODEN", tips: ["Um CODEN que foi identificado como tendo sido incorretamente aplicado ao recurso ou que é inválido.", "Pode ter sido atribuído a duas publicações diferentes e, neste caso, cancelado, ou pode ter sido incorretamente impresso."], repeatable: true, mandatory: false },
            ]
        },
        {
            tag: "071",
            name: "PUBLISHER'S NUMBER",
            ind1Name: "Type of Publisher's Number",
            ind1Tips: ["0 - Sound recording: Issue number, 1 - Sound recording: Matrix number, 2 - Printed music: Plate number, 3 - Printed music: Other publisher's number, 4 - Video recording number, 5 - Other type of publisher's number, 6 - Eletronic resource number (ex: CD-ROM)"],
            ind2Name: "Note Indicator",
            ind2Tips: ["0 - Do not make a note, 1 - Make a note"],
            tips: [
                "Este campo contém um número de editor não regido por uma norma internacional. Trata-se geralmente de utilizado para gravações de som, publicações de música, gravações de vídeo e recursos electrónicos.",
                "The field corresponds to the ISBD Resource Identifier and Terms of Availability Area. The field may contain the terms of availability and/or price, even if it does not contain a publisher's number.",
            ],
            subFieldDef: [
                { code: "a", label: "Publisher's Number", tips: ["Este código especifica o tipo de número de editor contido no campo. Pode ser utilizado para gerar o texto introdutório se for necessário apresentar uma nota a partir deste campo."], repeatable: false, mandatory: true },
                { code: "b", label: "Source", tips: ["O editor que atribuiu o número."], repeatable: false, mandatory: true },
                { code: "c", label: "Qualification", tips: ["Utilizado para distinguir entre números se um registo contiver mais do que um número de editor."], repeatable: false, mandatory: true },
                { code: "d", label: "Terms of Availability and/ or Price", tips: ["O preço do recurso e qualquer comentário sobre a sua disponibilidade."], repeatable: false, mandatory: true },
                { code: "z", label: "Erroneous Publisher's Number", tips: ["Um número de editor que foi identificado como tendo sido erroneamente aplicado ao recurso ou de outra forma inválido.", "Por exemplo, pode ter sido aplicado a duas publicações e, neste caso, cancelado ou pode ter sido incorretamente impresso."], repeatable: false, mandatory: false },
            ]
        },
        {
            tag: "072",
            name: "UNIVERSAL PRODUCT CODE (UPC)",
            ind1Tips: ["#: Em branco (não definido)"],
            ind2Name: "Differenfe Indicator",
            ind2Tips: ["0 - No information provided, 1 - No difference, 2 - Difference"],
            tips: [
                "Este campo contém o Código Universal do Produto.",
                "O campo corresponde ao identificador de recurso ISBD e à área das condições de disponibilidade. O campo pode conter as condições de disponibilidade e/ou o preço, mesmo que não contenha um número.",
            ],
            subFieldDef: [
                { code: "a", label: "Standard Number", tips: ["Um número ou código normalizado corretamente formatado. O número ou código está formatado de acordo com o tipo."], repeatable: false, mandatory: true },
                { code: "b", label: "Qualification", tips: ["Uma indicação do âmbito do número ou código no subcampo $a, normalmente o nome de um editor, uma indicação da encadernação do recurso, ou uma indicação da relação de um número ou código com um conjunto ou com um volume específico."], repeatable: false, mandatory: true },
                { code: "c", label: "Additional Codes Following Standard Number or Codes", tips: ["Contém qualquer sufixo codificado para o identificador."], repeatable: false, mandatory: true },
                { code: "d", label: "Terms of Availability and/ or Price", tips: ["O preço do recurso e qualquer comentário sobre a sua disponibilidade."], repeatable: false, mandatory: true },
                { code: "z", label: "Erroneous Number or Code", tips: ["Um número ou código que foi identificado como tendo sido incorretamente aplicado ao recurso ou que é inválido.", "Pode ter sido atribuído a duas publicações ou produtos diferentes e, neste caso, cancelado ou pode ter sido incorretamente impresso."], repeatable: true, mandatory: false },
            ]
        },
        {
            tag: "073",
            name: "INTERNATIONAL ARTICLE NUMBER (EAN)",
            ind1Tips: ["#: Em branco (não definido)"],
            ind2Name: "Differenfe Indicator",
            ind2Tips: ["0 - No information provided, 1 - No difference, 2 - Difference"],
            tips: [
                "Este campo contém o número internacional do artigo. O campo corresponde ao identificador do recurso da ISBD e à área das condições de disponibilidade.",
                "O campo pode conter as condições de disponibilidade e/ou preço, mesmo que não contenha um número.",
            ],
            subFieldDef: [
                { code: "a", label: "Standard Number", tips: ["Um número ou código normalizado corretamente formatado."], repeatable: false, mandatory: true },
                { code: "b", label: "Qualification", tips: ["Uma indicação do âmbito do número ou código no subcampo $a, normalmente o nome de um editor, uma indicação da encadernação do recurso, ou uma indicação da relação de um número ou código com um conjunto ou com um volume específico."], repeatable: false, mandatory: true },
                { code: "c", label: "Additional Codes Following Standard Number or Codes", tips: ["Contém qualquer sufixo codificado para o identificador."], repeatable: false, mandatory: true },
                { code: "d", label: "Terms of Availability and/ or Price", tips: ["O preço do recurso e qualquer comentário sobre a sua disponibilidade."], repeatable: false, mandatory: true },
                { code: "z", label: "Erroneous Number or Code", tips: ["Um número ou código que foi identificado como tendo sido incorretamente aplicado ao recurso ou que é inválido.", "Pode ter sido atribuído a duas publicações ou produtos diferentes e, neste caso, cancelado ou pode ter sido incorretamente impresso."], repeatable: true, mandatory: false },
            ]
        },
        {
            tag: "100",
            name: "INTERNATIONAL ARTIVLE NUMBER (EAN)",
            ind1Tips: ["#: Em branco (não definido)"],
            ind2Tips: ["#: Em branco (não definido)"],
            tips: [
                "Este campo contém dados codificados de comprimento fixo aplicáveis aos registos de materiais em qualquer suporte.",
            ],
            subFieldDef: [
                { code: "a", label: "General Processing Data", tips: ["Os códigos indicam os aspectos do tratamento geral.", "O subcampo tem um comprimento de 36 caracteres."], repeatable: false, mandatory: true },
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
                { code: "a", label: "Dados codificados da monografia", repeatable: false, mandatory: true, tips: ["Campo fixo de 13 caracteres.", "Inclui: Ilustração (0-3), Conteúdo (4-7), Conferência (8), Festschrift (9), Índice (10), Literatura (11), Biografia (12)"] }
            ]
        },
        {
            tag: "106",
            name: "CODED DATA FIELD: TEXTUAL LANGUAGE MATERIAL, MONOGRAPHIC",
            ind1Tips: ["#: Em branco (não definido)"],
            ind2Tips: ["#: Em branco (não definido)"],
            tips: [
                "Este campo contém dados codificados relativos à forma dos recursos textuais não mediados (ou seja, não é necessário qualquer dispositivo de mediação para utilizar ou percecionar o conteúdo textual do recurso).",
            ],
            subFieldDef: [
                { code: "a", label: "Form of Resource: Coded Data: Medium Designator", tips: ["d - large print, e - newspaper format, f - braille or moon script, g: micropoint, h: hand-written, i: multimedia, j: mini-print, r: regular print, z: other form of material"], repeatable: false, mandatory: true },
            ]
        },
        {
            tag: "110",
            name: "CONTINUING RESOURCES",
            ind1Tips: ["Em branco (não definido)"],
            ind2Tips: ["Em branco (não definido)"],
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
            ind1Tips: ["Em branco (não definido)"],
            ind2Tips: ["Em branco (não definido)"],
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
            ind1Tips: ["Em branco (não definido)"],
            ind2Tips: ["Em branco (não definido)"],
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
            ind1Tips: ["Em branco (não definido)"],
            ind2Tips: ["Em branco (não definido)"],
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
            ind1Tips: ["Em branco (não definido)"],
            ind2Tips: ["Em branco (não definido)"],
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
            ind1Tips: ["Em branco (não definido)"],
            ind2Tips: ["Em branco (não definido)"],
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
            ind1Tips: ["0 - Single dated resource, 1 - Multiple single dates, 2 - Range of dates"],
            ind2Tips: ["Em branco (não definido)"],
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
            ind1Tips: ["0 - Scale indeterminable, 1 - Single scale, 2 - Multiple scales"],
            ind2Tips: ["Em branco (não definido)"],
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
            ind1Tips: ["Em branco (não definido)"],
            ind2Tips: ["Em branco (não definido)"],
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
            ind1Tips: ["Em branco (não definido)"],
            ind2Tips: ["Em branco (não definido)"],
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
            ind1Tips: ["Em branco (não definido)"],
            ind2Tips: ["Em branco (não definido)"],
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
            ind1Tips: ["Em branco (não definido)"],
            ind2Tips: ["Em branco (não definido)"],
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
            ind1Tips: ["Em branco (não definido)"],
            ind2Tips: ["Em branco (não definido)"],
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
            ind1Tips: ["Em branco (não definido)"],
            ind2Tips: ["Em branco (não definido)"],
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
            ind1Tips: ["Em branco (não definido)"],
            ind2Tips: ["Em branco (não definido)"],
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
            ind1Tips: ["Em branco (não definido)"],
            ind2Tips: ["Em branco (não definido)"],
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
            ind1Tips: ["Em branco (não definido)"],
            ind2Tips: ["Em branco (não definido)"],
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
            ind1Tips: ["Em branco (não definido)"],
            ind2Tips: ["Em branco (não definido)"],
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
            ind1Tips: ["Em branco (não definido)"],
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
            ind1Tips: ["Em branco (não definido)"],
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
            ind1Tips: ["Em branco (não definido)"],
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
            ind2Tips: ["Em branco (não definido)"],
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
            ind1Tips: ["# - Em branco (não definido)"],
            ind2Tips: ["# - Em branco (não definido)"],
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
            ind1Tips: ["# - Em branco (não definido)"],
            ind2Tips: ["# - Em branco (não definido)"],
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
            ind2Tips: ["Em branco (não definido)"],
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
            ind1Tips: ["Em branco (não definido)"],
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
            ind1Tips: ["# - Em branco (não definido)"],
            ind2Tips: ["# - Em branco (não definido)"],
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
            ind1Tips: ["# - Em branco (não definido)"],
            ind2Tips: ["# - Em branco (não definido)"],
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
            ind1Tips: ["# - Em branco (não definido)"],
            ind2Tips: ["# - Em branco (não definido)"],
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
            ind2Tips: ["# - Em branco (não definido)"],
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
            ind1Tips: ["# - Em branco (não definido)"],
            ind2Tips: ["# - Em branco (não definido)"],
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
            ind1Tips: ["# - Em branco (não definido)"],
            ind2Tips: ["# - Em branco (não definido)"],
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
            ind1Tips: ["# - Em branco (não definido)"],
            ind2Tips: ["# - Em branco (não definido)"],
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
            ind1Tips: ["# - Em branco (não definido)"],
            ind2Tips: ["# - Em branco (não definido)"],
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
            ind1Tips: ["# - Em branco (não definido)"],
            ind2Tips: ["# - Em branco (não definido)"],
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
            ind1Tips: ["# - Em branco (não definido)"],
            ind2Tips: ["# - Em branco (não definido)"],
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
            ind1Tips: ["# - Em branco (não definido)"],
            ind2Tips: ["# - Em branco (não definido)"],
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
            ind1Tips: ["# - Em branco (não definido)"],
            ind2Tips: ["# - Em branco (não definido)"],
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
            ind1Tips: ["# - Em branco (não definido)"],
            ind2Tips: ["# - Em branco (não definido)"],
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
        },
        {
            tag: "500",
            name: "PREFERRED TITLE ACCESS POINT",
            ind1Name: "Title Significance Indicator",
            ind1Tips: ["0 — Access point is not significant, 1 — Access point is significant"],
            ind2Name: "Primary Entry Indicator",
            ind2Tips: ["0 — Title is not primary entry, 1 — Title is primary entry"],
            tips: [
                "Este campo contém o título preferido escolhido pela agência bibliográfica para identificar uma obra que apareceu sob diferentes títulos.",
                "Pode incluir elementos adicionais para tornar o título único.",
                "Pode ser utilizado como ponto de acesso principal ou como ponto de acesso adicional."
            ],
            subFieldDef: [
                { code: "a", label: "Preferred Title", repeatable: false, mandatory: true, tips: ["Título pelo qual a obra é conhecida, sem qualificações."] },
                { code: "b", label: "General Material Designation", repeatable: true, mandatory: false, tips: ["Designação geral do material."] },
                { code: "h", label: "Number of Section or Part", repeatable: true, mandatory: false, tips: ["Número da parte ou seção da obra."] },
                { code: "i", label: "Name of Section or Part", repeatable: true, mandatory: false, tips: ["Nome da parte ou seção da obra."] },
                { code: "g", label: "Form Subdivision for Title", repeatable: true, mandatory: false, tips: ["Subdivisão de forma associada ao título."] },
                { code: "k", label: "Date of Publication", repeatable: false, mandatory: false, tips: ["Data de publicação associada ao título."] },
                { code: "l", label: "Form Subheading", repeatable: true, mandatory: false, tips: ["Subcabeçalho padrão que especifica o título."] },
                { code: "m", label: "Language (when Part of a Access Point)", repeatable: false, mandatory: false, tips: ["Língua associada ao título como parte do ponto de acesso."] },
                { code: "n", label: "Miscellaneous Information", repeatable: true, mandatory: false, tips: ["Informações diversas sobre o título."] },
                { code: "q", label: "Version (or Date of Version)", repeatable: false, mandatory: false, tips: ["Versão ou data da versão da obra."] },
                { code: "r", label: "Medium of Performance (for Music)", repeatable: true, mandatory: false, tips: ["Instrumentação ou meios de execução da obra musical."] },
                { code: "s", label: "Numeric Designation (for Music)", repeatable: true, mandatory: false, tips: ["Designação numérica da obra musical, como número de opus."] },
                { code: "u", label: "Key (for Music)", repeatable: false, mandatory: false, tips: ["Tom musical da obra."] },
                { code: "v", label: "Volume Designation", repeatable: false, mandatory: false, tips: ["Designação de volume (quando usado num campo 4--)."] },
                { code: "w", label: "Additional Elements (for Music)", repeatable: false, mandatory: false, tips: ["Elementos adicionais como arranjos ou destaques."] },
                { code: "j", label: "Form Subdivision", repeatable: true, mandatory: false, tips: ["Subdivisão por forma (autoridade)."] },
                { code: "x", label: "Topical Subdivision", repeatable: true, mandatory: false, tips: ["Subdivisão temática (quando embutido em 604)."] },
                { code: "y", label: "Geographical Subdivision", repeatable: true, mandatory: false, tips: ["Subdivisão geográfica (quando embutido em 604)."] },
                { code: "z", label: "Chronological Subdivision", repeatable: true, mandatory: false, tips: ["Subdivisão cronológica (quando embutido em 604)."] },
                { code: "2", label: "Source", repeatable: false, mandatory: false, tips: ["Fonte codificada do ponto de acesso (em 604)."] },
                { code: "3", label: "Authority Record Identifier or Standard Number", repeatable: false, mandatory: false, tips: ["Identificador do registo de autoridade."] }
            ]
        },
        {
            tag: "501",
            name: "COLLECTIVE PREFERRED TITLE",
            ind1Name: "Type of Collective Title Indicator",
            ind1Tips: ["0 — Complete collected works, 1 — Selected works, 2 — Other (not exactly defined by cataloguing code)"],
            ind2Tips: ["# — Em branco (não definido)"],
            tips: [
                "O campo 501 contém um ou mais termos usados para reunir obras de um autor prolífico sob um título coletivo.",
                "É utilizado para coleções completas ou selecionadas de obras.",
                "O conteúdo e formato deste campo pode variar de acordo com o código de catalogação da agência responsável.",
                "Quando embutido num campo 604, permite subdivisões adicionais como forma, tópico, tempo e localização."
            ],
            subFieldDef: [
                { code: "a", label: "Collective Preferred Title", repeatable: false, mandatory: true, tips: ["Título coletivo principal utilizado para reunir obras semelhantes."] },
                { code: "b", label: "General Material Designation", repeatable: true, mandatory: false, tips: ["Designação geral do material (ex.: Texto impresso, gravação sonora)."] },
                { code: "e", label: "Collective Preferred Subtitle", repeatable: false, mandatory: false, tips: ["Subtítulo coletivo para especificar mais a natureza da coleção."] },
                { code: "g", label: "Form Subdivision for Title", repeatable: true, mandatory: false, tips: ["Subdivisão de forma associada ao título coletivo."] },
                { code: "k", label: "Date of Publication, etc.", repeatable: false, mandatory: false, tips: ["Data da obra para distinguir edições ou volumes."] },
                { code: "m", label: "Language (when Part of Access Point)", repeatable: false, mandatory: false, tips: ["Língua da obra quando usada como parte do ponto de acesso."] },
                { code: "r", label: "Medium of Performance (for Music)", repeatable: true, mandatory: false, tips: ["Meio de execução musical (instrumentos, vozes)."] },
                { code: "s", label: "Numeric Designation (for Music)", repeatable: true, mandatory: false, tips: ["Designação numérica da obra musical, como número de opus."] },
                { code: "u", label: "Key (for Music)", repeatable: false, mandatory: false, tips: ["Tom musical da obra."] },
                { code: "w", label: "Arranged Statement (for Music)", repeatable: false, mandatory: false, tips: ["Indicação de que a obra musical é um arranjo."] },
                { code: "j", label: "Form Subdivision", repeatable: true, mandatory: false, tips: ["Usado em 604 para subdivisão por forma."] },
                { code: "x", label: "Topical Subdivision", repeatable: true, mandatory: false, tips: ["Usado em 604 para subdivisão temática."] },
                { code: "y", label: "Geographical Subdivision", repeatable: true, mandatory: false, tips: ["Usado em 604 para subdivisão geográfica."] },
                { code: "z", label: "Chronological Subdivision", repeatable: true, mandatory: false, tips: ["Usado em 604 para subdivisão cronológica."] },
                { code: "2", label: "Source", repeatable: false, mandatory: false, tips: ["Fonte codificada do ponto de acesso (em 604)."] },
                { code: "3", label: "Authority Record Identifier or Standard Number", repeatable: false, mandatory: false, tips: ["Identificador do registo de autoridade para o ponto de acesso."] }
            ]
        },
        {
            tag: "503",
            name: "CONVENTIONAL PREFERRED TITLE",
            ind1Name: "Title Significance Indicator",
            ind1Tips: ["0 — Access point is not significant, 1 — Access point is significant"],
            ind2Tips: ["# — Em branco (não definido)"],
            tips: [
                "Campo usado para pontos de acesso convencionais preferidos, conforme definidos por certos códigos de catalogação.",
                "Agrupa obras de forma similar (ex: exposições, catálogos de leilão, coletâneas legislativas), especialmente quando não há autor individual.",
                "Corresponde ao parágrafo 11.6 do Statement of Principles da Conferência de Paris, 1961."
            ],
            subFieldDef: [
                { code: "a", label: "Form Heading Proper", repeatable: false, mandatory: true, tips: ["Cabeçalho principal da forma (ex: Exposition, Vente, Loi, Mélanges)."] },
                { code: "b", label: "Form Subheading", repeatable: false, mandatory: false, tips: ["Subdivisão do cabeçalho principal (ex: Recueil, Livres)."] },
                { code: "d", label: "Month and Day", repeatable: true, mandatory: false, tips: ["Mês e dia do evento (formato: MMDD)."] },
                { code: "e", label: "Personal Name - Entry Element", repeatable: false, mandatory: false, tips: ["Elemento de entrada de nome pessoal (ex: Menéndez-Pidal)."] },
                { code: "f", label: "Personal Name - Forename", repeatable: false, mandatory: false, tips: ["Nome próprio (usado em conjunto com $e, ex: Henri)."] },
                { code: "g", label: "Personal Names - Dates", repeatable: false, mandatory: false, tips: ["Datas associadas ao nome da pessoa (ex: 1906-....)."] },
                { code: "h", label: "Personal Name Qualifier", repeatable: false, mandatory: false, tips: ["Título, cargo ou epíteto do nome pessoal."] },
                { code: "i", label: "Title of Part", repeatable: false, mandatory: false, tips: ["Título de uma parte da obra."] },
                { code: "j", label: "Year", repeatable: true, mandatory: false, tips: ["Ano(s) do evento (ex: 1985, 1991)."] },
                { code: "k", label: "Numeration (Arabic)", repeatable: false, mandatory: false, tips: ["Numeração árabe (ex: 1re, 2e)."] },
                { code: "l", label: "Numeration (Roman)", repeatable: false, mandatory: false, tips: ["Numeração romana (ex: III)."] },
                { code: "m", label: "Locality", repeatable: false, mandatory: false, tips: ["Cidade/local do evento (ex: Paris, Brest)."] },
                { code: "n", label: "Institution in Locality", repeatable: false, mandatory: false, tips: ["Instituição no local (ex: Musée du Luxembourg)."] },
                { code: "o", label: "Place in Locality", repeatable: false, mandatory: false, tips: ["Lugar público no local (ex: Jardin du Luxembourg, Avenue des Champs-Élysées)."] }
            ]
        },
        {
            tag: "506",
            name: "PREFERRED ACCESS POINT - IDENTIFICATION OF A WORK",
            ind1Name: "Primary Entry Indicator",
            ind1Tips: ["0 — Title is not primary entry or value is not specified, 1 — Title is primary entry"],
            ind2Tips: ["# — Em branco (não definido)"],
            tips: [
                "Este campo contém o título preferido que identifica uma obra anónima incorporada na manifestação descrita no registo.",
                "Utilizado em registos compatíveis com o modelo FRBR/LRM, substitui o campo 500 quando não há nome associado à obra.",
                "É possível associar este campo a um registo de autoridade (via subcampo $3)."
            ],
            subFieldDef: [
                { code: "a", label: "Title", repeatable: true, mandatory: true, tips: ["Título pelo qual a obra é conhecida, sem qualificações."] },
                { code: "h", label: "Number of Section or Part", repeatable: true, mandatory: false, tips: ["Número de uma parte da obra, quando aplicável."] },
                { code: "i", label: "Name of Section or Part", repeatable: true, mandatory: false, tips: ["Nome de uma parte da obra, quando aplicável."] },
                { code: "c", label: "Form of Work", repeatable: false, mandatory: false, tips: ["Indicação padrão do tipo ou género da obra."] },
                { code: "d", label: "Date of Work", repeatable: false, mandatory: false, tips: ["Data associada à obra para a diferenciar de outras semelhantes."] },
                { code: "e", label: "Place of Origin of Work", repeatable: false, mandatory: false, tips: ["País ou jurisdição territorial de origem da obra."] },
                { code: "f", label: "Original Language of the Work", repeatable: false, mandatory: false, tips: ["Língua original da obra."] },
                { code: "k", label: "Other Distinguishing Characteristics of a Work", repeatable: true, mandatory: false, tips: ["Qualquer outra característica usada para distinguir a obra."] },
                { code: "r", label: "Medium of Performance (for Music)", repeatable: true, mandatory: false, tips: ["Instrumentação ou vozes para obras musicais."] },
                { code: "s", label: "Numeric Designation (for Music)", repeatable: true, mandatory: false, tips: ["Número de opus, serial, etc. para obras musicais."] },
                { code: "u", label: "Key (for Music)", repeatable: false, mandatory: false, tips: ["Tom musical da obra."] },
                { code: "3", label: "Authority Record Identifier or Standard Number", repeatable: false, mandatory: false, tips: ["Identificador do registo de autoridade associado à obra."] }
            ]
        },
        {
            tag: "507",
            name: "PREFERRED ACCESS POINT - IDENTIFICATION OF AN EXPRESSION",
            ind1Name: "Primary Entry Indicator",
            ind1Tips: ["0 — Title is not primary entry or value is not specified, 1 — Title is primary entry"],
            ind2Tips: ["# — Em branco (não definido)"],
            tips: [
                "Este campo contém o título preferido que identifica uma expressão específica de uma obra anónima.",
                "É usado em catálogos que seguem o modelo FRBR/IFLA LRM e aparece num registo que descreve uma manifestação.",
                "Se existir um nome associado à expressão, deve-se usar o campo 577 em vez do 507.",
                "O campo pode estar vinculado a um registo de autoridade através do subcampo $3."
            ],
            subFieldDef: [
                { code: "a", label: "Title [Work]", repeatable: true, mandatory: true, tips: ["Título da obra, sem qualificações."] },
                { code: "h", label: "Number of Section or Part [Work]", repeatable: true, mandatory: false, tips: ["Número da parte da obra, se aplicável."] },
                { code: "i", label: "Name of Section or Part [Work]", repeatable: true, mandatory: false, tips: ["Nome da parte da obra, se aplicável."] },
                { code: "c", label: "Form of Work [Work]", repeatable: false, mandatory: false, tips: ["Forma, classe ou género da obra."] },
                { code: "d", label: "Date of Work [Work]", repeatable: false, mandatory: false, tips: ["Data associada à criação da obra."] },
                { code: "e", label: "Place of Origin of Work [Work]", repeatable: false, mandatory: false, tips: ["Local de origem territorial da obra."] },
                { code: "f", label: "Original Language of the Work [Work]", repeatable: false, mandatory: false, tips: ["Língua original da obra."] },
                { code: "k", label: "Other Distinguishing Characteristics of a Work [Work]", repeatable: true, mandatory: false, tips: ["Características adicionais que distinguem a obra."] },
                { code: "r", label: "Medium of Performance (for Music) [Work]", repeatable: true, mandatory: false, tips: ["Instrumentação ou vozes para obras musicais."] },
                { code: "s", label: "Numeric Designation (for Music) [Work]", repeatable: true, mandatory: false, tips: ["Designação numérica como opus, serial, etc."] },
                { code: "u", label: "Key (for Music) [Work]", repeatable: false, mandatory: false, tips: ["Tom musical da obra."] },
                { code: "l", label: "Form of the Expression [Expression]", repeatable: false, mandatory: false, tips: ["Forma ou tipo da expressão."] },
                { code: "m", label: "Language of the Expression [Expression]", repeatable: false, mandatory: false, tips: ["Língua da expressão."] },
                { code: "n", label: "Content Type [Expression]", repeatable: false, mandatory: false, tips: ["Tipo de conteúdo da expressão (ex.: texto, áudio)."] },
                { code: "o", label: "Date of Expression [Expression]", repeatable: false, mandatory: false, tips: ["Data original da expressão."] },
                { code: "v", label: "Medium of Performance (for Music) [Expression]", repeatable: true, mandatory: false, tips: ["Instrumentação na expressão musical."] },
                { code: "w", label: "Other Characteristics of Expression [Expression]", repeatable: true, mandatory: false, tips: ["Outras características distintivas da expressão."] },
                { code: "3", label: "Authority Record Identifier or Standard Number", repeatable: false, mandatory: false, tips: ["Identificador do registo de autoridade da expressão."] }
            ]

        },
        {
            tag: "510",
            name: "PARALLEL TITLE PROPER",
            ind1Name: "Title Significance Indicator",
            ind1Tips: ["0 — Parallel title is not significant, 1 — Parallel title is significant"],
            ind2Tips: ["# — Em branco (não definido)"],
            tips: [
                "Este campo contém o título paralelo (título principal noutra língua ou escrita) para o qual se deseja criar uma nota ou um ponto de acesso.",
                "Usado para criar acesso alternativo ou nota para títulos paralelos importantes ou pertinentes.",
                "Se o título paralelo não for encontrado diretamente no item, ou se for traduzido pelo catalogador, deve ser registrado no campo 541, não no 510."
            ],
            subFieldDef: [
                { code: "a", label: "Parallel Title", repeatable: false, mandatory: true, tips: ["Título principal em outra língua ou escrita."] },
                { code: "e", label: "Other Title Information", repeatable: true, mandatory: false, tips: ["Subtítulos ou outras informações associadas ao título paralelo."] },
                { code: "h", label: "Number of Part", repeatable: true, mandatory: false, tips: ["Número de uma parte identificada relacionada ao título paralelo."] },
                { code: "i", label: "Name of Part", repeatable: true, mandatory: false, tips: ["Nome de uma parte relacionada ao título paralelo."] },
                { code: "j", label: "Volume or Dates Associated with Title", repeatable: false, mandatory: false, tips: ["Volume ou datas associadas ao título paralelo."] },
                { code: "n", label: "Miscellaneous Information", repeatable: false, mandatory: false, tips: ["Informação variada ou nota relacionada ao título paralelo."] },
                { code: "z", label: "Language of Title", repeatable: false, mandatory: false, tips: ["Código de língua do título paralelo (ISO 639-2 ou especificado em $2)."] },
                { code: "2", label: "Source", repeatable: false, mandatory: false, tips: ["Fonte do esquema de código de língua utilizado em $z, se não ISO 639-2."] }
            ]
        },
        {
            tag: "511",
            name: "HALF TITLE",
            ind1Name: "Significance of Title",
            ind1Tips: ["0 — Title is not significant, 1 — Title is significant"],
            ind2Tips: ["# — Em branco (não definido)"],
            tips: [
                "Este campo contém um título variante que aparece na página de ante-rosto (half-title page), quando difere suficientemente do título principal (campo 200) para justificar a criação de uma nota ou ponto de acesso.",
                "Utilizado apenas se o título de ante-rosto diferir substancialmente do título principal.",
                "O título de ante-rosto é normalmente uma forma abreviada do título principal."
            ],
            subFieldDef: [
                { code: "a", label: "Half Title", repeatable: false, mandatory: true, tips: ["Título variante conforme aparece na página de ante-rosto."] },
                { code: "e", label: "Other Title Information", repeatable: true, mandatory: false, tips: ["Subtítulos e outras informações subordinadas ao half title."] },
                { code: "h", label: "Number of Part", repeatable: true, mandatory: false, tips: ["Número de parte para recursos com títulos principais e secundários."] },
                { code: "i", label: "Name of Part", repeatable: true, mandatory: false, tips: ["Nome da parte para recursos identificados por título principal e subseção."] },
                { code: "j", label: "Volume or Dates Associated with Title", repeatable: false, mandatory: false, tips: ["Volume ou datas associadas ao half title."] },
                { code: "n", label: "Miscellaneous Information", repeatable: false, mandatory: false, tips: ["Informação adicional para exibição, como 'varies slightly'."] },
                { code: "z", label: "Language of Title", repeatable: false, mandatory: false, tips: ["Código de língua do half title, conforme ISO 639-2 ou indicado em $2."] },
                { code: "2", label: "Source", repeatable: false, mandatory: false, tips: ["Fonte do esquema de codificação de língua usado em $z, se diferente de ISO 639-2."] }
            ]
        },
        {
            tag: "512",
            name: "COVER TITLE",
            ind1Name: "Title Significance Indicator",
            ind1Tips: ["0 — Cover title is not significant, 1 — Cover title is significant"],
            ind2Tips: ["# — Em branco (não definido)"],
            tips: [
                "Este campo contém o título que aparece na capa do item, quando difere suficientemente do título principal (campo 200) para justificar a criação de uma nota ou um ponto de acesso.",
                "O título de capa é usado apenas se houver uma diferença significativa em relação ao título principal.",
                "Se necessário, pode ser feito um ponto de acesso adicional ou uma nota baseada no título de capa."
            ],
            subFieldDef: [
                { code: "a", label: "Cover Title", repeatable: false, mandatory: true, tips: ["Título conforme aparece na capa do item, sem outras informações de título ou responsabilidade."] },
                { code: "e", label: "Other Title Information", repeatable: true, mandatory: false, tips: ["Subtítulos e outras informações associadas ao título de capa."] },
                { code: "h", label: "Number of Part", repeatable: true, mandatory: false, tips: ["Número de parte relacionado ao título de capa."] },
                { code: "i", label: "Name of Part", repeatable: true, mandatory: false, tips: ["Nome da parte relacionada ao título de capa."] },
                { code: "j", label: "Volume or Dates Associated with Title", repeatable: false, mandatory: false, tips: ["Volume ou datas associadas ao título de capa."] },
                { code: "n", label: "Miscellaneous Information", repeatable: false, mandatory: false, tips: ["Informações adicionais, como 'varia ligeiramente', 'edição paperback'."] },
                { code: "z", label: "Language of Title", repeatable: false, mandatory: false, tips: ["Código da língua do título de capa (ISO 639-2 ou outro indicado no $2)."] },
                { code: "2", label: "Source", repeatable: false, mandatory: false, tips: ["Fonte do esquema de codificação de língua usado em $z, se não for ISO 639-2."] }
            ]
        },
        {
            tag: "513",
            name: "ADDED TITLE-PAGE TITLE",
            ind1Name: "Title Significance Indicator",
            ind1Tips: ["0 — Added title-page title is not significant, 1 — Added title-page title is significant"],
            ind2Tips: ["# — Em branco (não definido)"],
            tips: [
                "Este campo contém o título que aparece numa página de título adicional, quando justifica registo como nota ou ponto de acesso.",
                "Utilizado apenas se o título da página de título adicional diferir significativamente do título principal.",
                "Um ponto de acesso pode ser criado a partir deste título, dependendo do valor do primeiro indicador."
            ],
            subFieldDef: [
                { code: "a", label: "Added Title-Page Title", repeatable: false, mandatory: true, tips: ["Título como aparece na página de título adicional, sem informações adicionais de responsabilidade."] },
                { code: "e", label: "Other Title Information", repeatable: true, mandatory: false, tips: ["Subtítulos e outras informações subordinadas ao título da página de título adicional."] },
                { code: "h", label: "Number of Part", repeatable: true, mandatory: false, tips: ["Número de uma parte relacionada ao título adicional."] },
                { code: "i", label: "Name of Part", repeatable: true, mandatory: false, tips: ["Nome de uma parte relacionada ao título adicional."] },
                { code: "j", label: "Volume or Dates Associated with Title", repeatable: false, mandatory: false, tips: ["Volume ou datas associadas ao título da página de título adicional."] },
                { code: "n", label: "Miscellaneous Information", repeatable: false, mandatory: false, tips: ["Informações adicionais, como 'varia ligeiramente', 'edição paperback'."] },
                { code: "z", label: "Language of Title", repeatable: false, mandatory: false, tips: ["Código de língua do título da página adicional (ISO 639-2 ou outra fonte indicada em $2)."] },
                { code: "2", label: "Source", repeatable: false, mandatory: false, tips: ["Fonte de codificação usada para o código de língua indicado em $z."] }
            ]
        },
        {
            tag: "514",
            name: "CAPTION TITLE",
            ind1Name: "Title Significance Indicator",
            ind1Tips: ["0 — Caption title is not significant, 1 — Caption title is significant"],
            ind2Tips: ["# — Em branco (não definido)"],
            tips: [
                "Este campo contém o título dado no início da primeira página do texto quando este difere suficientemente do título principal no campo 200 para justificar a criação de uma nota ou um ponto de acesso.",
                "Utilizar este campo apenas se o título de início de texto tiver relevância ou diferença significativa em relação ao título principal.",
                "Se necessário, um ponto de acesso ou nota pode ser gerado a partir deste título."
            ],
            subFieldDef: [
                { code: "a", label: "Caption Title", repeatable: false, mandatory: true, tips: ["Título conforme aparece no início da primeira página do texto, sem outras informações de título ou responsabilidade."] },
                { code: "e", label: "Other Title Information", repeatable: true, mandatory: false, tips: ["Subtítulos e outras informações subordinadas ao título de cabeçalho."] },
                { code: "h", label: "Number of Part", repeatable: true, mandatory: false, tips: ["Número da parte relacionada ao título de cabeçalho."] },
                { code: "i", label: "Name of Part", repeatable: true, mandatory: false, tips: ["Nome da parte relacionada ao título de cabeçalho."] },
                { code: "j", label: "Volume or Dates Associated with Title", repeatable: false, mandatory: false, tips: ["Volume ou datas associadas ao título de cabeçalho."] },
                { code: "n", label: "Miscellaneous Information", repeatable: false, mandatory: false, tips: ["Informações adicionais como 'varia ligeiramente' ou 'edição em brochura'."] },
                { code: "z", label: "Language of Title", repeatable: false, mandatory: false, tips: ["Código da língua do título, usando ISO 639-2 ou outro indicado em $2."] },
                { code: "2", label: "Source", repeatable: false, mandatory: false, tips: ["Fonte de codificação usada para a língua indicada em $z, se não for ISO 639-2."] }
            ]
        },
        {
            tag: "515",
            name: "RUNNING TITLE",
            ind1Name: "Title Significance Indicator",
            ind1Tips: ["0 — Running title is not significant, 1 — Running title is significant"],
            ind2Tips: ["# — Em branco (não definido)"],
            tips: [
                "O campo contém o título que aparece no cabeçalho ou rodapé da página do recurso quando este difere suficientemente do título apropriado no campo 200 para garantir o registo como nota ou como ponto de acesso."
            ],
            subFieldDef: [
                { code: "a", label: "Running Title", repeatable: false, mandatory: true, tips: ["O título é retirado do cabeçalho ou rodapé da página do item. Não repetível."] },
                { code: "e", label: "Other Title Information", repeatable: true, mandatory: false, tips: ["Subtítulos e outras informações subordinadas ao título de cabeçalho."] },
                { code: "h", label: "Number of Part", repeatable: true, mandatory: false, tips: ["Número da parte relacionada ao título de cabeçalho."] },
                { code: "i", label: "Name of Part", repeatable: true, mandatory: false, tips: ["Nome da parte relacionada ao título de cabeçalho."] },
                { code: "j", label: "Volume or Dates Associated with Title", repeatable: false, mandatory: false, tips: ["Volume ou datas associadas ao título de cabeçalho."] },
                { code: "n", label: "Miscellaneous Information", repeatable: false, mandatory: false, tips: ["Informações adicionais como 'varia ligeiramente' ou 'edição em brochura'."] },
                { code: "z", label: "Language of Title", repeatable: false, mandatory: false, tips: ["Código da língua do título, usando ISO 639-2 ou outro indicado em $2."] },
                { code: "2", label: "Source", repeatable: false, mandatory: false, tips: ["Fonte de codificação usada para a língua indicada em $z, se não for ISO 639-2."] }
            ]
        },
        {
            tag: "516",
            name: "SPINE TITLE",
            ind1Name: "Title Significance Indicator",
            ind1Tips: ["0 — Spine title is not significant, 1 — Spine title is significant"],
            ind2Tips: ["# — Em branco (não definido)"],
            tips: [
                "Este campo contém o título impresso na lombada do item quando difere significativamente do título principal (campo 200).",
                "Utiliza-se este campo apenas quando a diferença justifica a criação de uma nota ou de um ponto de acesso.",
                "Pode ser feita uma nota (campo 312) em vez de se usar este campo, se preferido."
            ],
            subFieldDef: [
                { code: "a", label: "Spine Title", repeatable: false, mandatory: true, tips: ["Título tal como aparece na lombada do item."] },
                { code: "e", label: "Other Title Information", repeatable: true, mandatory: false, tips: ["Informações adicionais subordinadas ao título da lombada."] },
                { code: "h", label: "Number of Part", repeatable: true, mandatory: false, tips: ["Número da parte relacionada ao título da lombada."] },
                { code: "i", label: "Name of Part", repeatable: true, mandatory: false, tips: ["Nome da parte relacionada ao título da lombada."] },
                { code: "j", label: "Volume or Dates Associated with Title", repeatable: false, mandatory: false, tips: ["Volume ou datas associadas ao título."] },
                { code: "n", label: "Miscellaneous Information", repeatable: false, mandatory: false, tips: ["Informações adicionais como 'varia ligeiramente', 'edição brochada', etc."] },
                { code: "z", label: "Language of Title", repeatable: false, mandatory: false, tips: ["Código de língua (ISO 639-2 ou outro, conforme $2)."] },
                { code: "2", label: "Source", repeatable: false, mandatory: false, tips: ["Fonte da codificação da língua em $z, se não for ISO 639-2."] }
            ]
        },
        {
            tag: "517",
            name: "OTHER VARIANT TITLES",
            ind1Name: "Title Significance Indicator",
            ind1Tips: ["0 — Variant title is not significant, 1 — Variant title is significant"],
            ind2Tips: ["# — Em branco (não definido)"],
            tips: [
                "Este campo contém qualquer outro título variante que não esteja definido nos campos 510-516 ou 518.",
                "É usado, por exemplo, para títulos de encadernação, caixa, slipcase, títulos parciais, títulos subordinados, etc.",
                "Use este campo quando a fonte não permite identificar o tipo específico de título variante para os campos 510–516 ou 518.",
                "Se necessário, crie uma nota no campo 312 para contextualizar o uso do título variante."
            ],
            subFieldDef: [
                { code: "a", label: "Variant Title", repeatable: false, mandatory: true, tips: ["Título variante sem outras informações de título ou responsabilidade."] },
                { code: "e", label: "Other Title Information", repeatable: true, mandatory: false, tips: ["Subtítulos e outras informações subordinadas ao título variante."] },
                { code: "h", label: "Number of Part", repeatable: true, mandatory: false, tips: ["Numeração da parte correspondente ao título variante."] },
                { code: "i", label: "Name of Part", repeatable: true, mandatory: false, tips: ["Nome da parte correspondente ao título variante."] },
                { code: "j", label: "Volume or Dates Associated with Title", repeatable: false, mandatory: false, tips: ["Volume ou datas associadas ao título variante."] },
                { code: "n", label: "Miscellaneous Information", repeatable: false, mandatory: false, tips: ["Texto adicional, como 'varia ligeiramente', 'edição brochada'."] },
                { code: "z", label: "Language of Title", repeatable: false, mandatory: false, tips: ["Código da língua (ISO 639-2 ou outra indicada em $2)."] },
                { code: "2", label: "Source", repeatable: false, mandatory: false, tips: ["Fonte do código de língua usada em $z, se não for ISO 639-2."] }
            ]
        },
        {
            tag: "518",
            name: "TITLE IN STANDARD MODERN SPELLING",
            ind1Name: "Title Significance Indicator",
            ind1Tips: ["0 — Title in standard modern spelling is not significant, 1 — Title in standard modern spelling is significant"],
            ind2Tips: ["# — Em branco (não definido)"],
            tips: [
                "Este campo contém o título, ou palavras individuais do título, repetido em ortografia moderna normalizada quando a forma no item é suficientemente arcaica para justificar a criação de uma nota ou ponto de acesso.",
                "Usado principalmente para publicações monográficas antigas (antiquarian).",
                "Se o conteúdo do campo 518 for idêntico ao do subcampo 500$a, não se deve criar o campo 518.",
                "É possível usar palavras selecionadas do título apenas para efeitos de recuperação online, com o indicador 1 = 0.",
                "Subcampos disponíveis são semelhantes aos do campo 510, embora normalmente apenas $a seja usado."
            ],
            subFieldDef: [
                { code: "a", label: "Title Proper, Variant Title or Preferred Title in Standard Modern Spelling", repeatable: false, mandatory: true, tips: ["Título principal ou variante repetido em ortografia moderna normalizada."] },
                { code: "e", label: "Other Title Information", repeatable: true, mandatory: false, tips: ["Subtítulos ou informações subordinadas ao título em ortografia moderna."] },
                { code: "h", label: "Number of Part", repeatable: true, mandatory: false, tips: ["Numeração da parte correspondente ao título."] },
                { code: "i", label: "Name of Part", repeatable: true, mandatory: false, tips: ["Nome da parte correspondente ao título."] },
                { code: "j", label: "Volume or Dates Associated with Title", repeatable: false, mandatory: false, tips: ["Volume ou datas associadas ao título."] },
                { code: "n", label: "Miscellaneous Information", repeatable: false, mandatory: false, tips: ["Informações adicionais como 'varia ligeiramente', 'edição brochada', etc."] },
                { code: "z", label: "Language of Title", repeatable: false, mandatory: false, tips: ["Código de língua (ISO 639-2 ou outro indicado em $2)."] },
                { code: "2", label: "Source", repeatable: false, mandatory: false, tips: ["Fonte da codificação da língua em $z, se não for ISO 639-2."] }
            ]
        },
        {
            tag: "520",
            name: "FORMER TITLE (CONTINUING RESOURCES)",
            ind1Name: "Title Significance Indicator",
            ind1Tips: ["0 — Former title is not significant, 1 — Former title is significant"],
            ind2Tips: ["# — Em branco (não definido)"],
            tips: [
                "Este campo contém um título anterior de um recurso contínuo catalogado sob um título posterior.",
                "Utiliza-se quando o recurso contínuo é tratado como uma única entidade bibliográfica apesar de ter tido vários títulos ao longo do tempo.",
                "Permite manter um único registo com o título corrente no campo 200, e os títulos anteriores como variantes ou acessos alternativos.",
                "Evita a criação de registos bibliográficos separados para cada título sucessivo."
            ],
            subFieldDef: [
                { code: "a", label: "Former Title Proper", repeatable: false, mandatory: true, tips: ["Título principal anterior do recurso contínuo."] },
                { code: "e", label: "Other Title Information", repeatable: true, mandatory: false, tips: ["Informações complementares ao título anterior."] },
                { code: "h", label: "Number of Part", repeatable: false, mandatory: false, tips: ["Número de parte do recurso anterior, se subdividido."] },
                { code: "i", label: "Name of Part", repeatable: false, mandatory: false, tips: ["Nome da parte do recurso anterior, se subdividido."] },
                { code: "j", label: "Volumes or Dates of Former Title", repeatable: false, mandatory: false, tips: ["Numeração de volumes ou datas que cobrem o período do título anterior."] },
                { code: "n", label: "Miscellaneous Information", repeatable: false, mandatory: false, tips: ["Texto adicional, normalmente usado em notas visíveis ao utilizador."] },
                { code: "x", label: "ISSN of Former Title", repeatable: false, mandatory: false, tips: ["ISSN atribuído ao título anterior, quando disponível."] }
            ]
        },
        {
            tag: "530",
            name: "KEY TITLE",
            ind1Name: "Title Proper Indicator",
            ind1Tips: ["0 — Key title is the same as the title proper, 1 — Key title differs from the title proper"],
            ind2Tips: ["# — Em branco (não definido)"],
            tips: [
                "Contém o título-chave — o nome único para um recurso contínuo estabelecido pela Rede ISSN.",
                "O título-chave pode coincidir com o título principal (campo 200 $a), ou conter elementos adicionais (entidade editora, lugar, data, etc.) para garantir unicidade.",
                "Apenas centros da rede ISSN podem estabelecer títulos-chave. Agências externas devem inseri-lo somente se constar no recurso ou após confirmação com o centro ISSN.",
                "Está intimamente ligado ao campo 011 (ISSN). Se disponível, ambos devem constar no registo."
            ],
            subFieldDef: [
                { code: "a", label: "Key Title", repeatable: false, mandatory: true, tips: ["Título-chave sem qualificação adicional."] },
                { code: "b", label: "Qualifier", repeatable: false, mandatory: false, tips: ["Qualificação adicional (entidade, local, data, etc.) para distinguir títulos idênticos."] },
                { code: "j", label: "Volume or Dates Associated with Key Title", repeatable: false, mandatory: false, tips: ["Indica os volumes ou datas aos quais o título-chave se aplica."] },
                { code: "v", label: "Volume Designation", repeatable: false, mandatory: false, tips: ["Indica a parte (volume, número, página, etc.) a que o campo se refere, usado apenas quando embutido num campo 4--."] }
            ]
        },
        {
            tag: "531",
            name: "ABBREVIATED KEY TITLE (CONTINUING RESOURCES)",
            ind1Tips: ["# — Em branco (não definido)"],
            ind2Tips: ["# — Em branco (não definido)"],
            tips: [
                "Este campo contém a forma abreviada do título-chave estabelecida pela Rede ISSN.",
                "A forma abreviada é construída de acordo com o manual do ISSN, com base na norma ISO 4.",
                "A abreviação pode incluir um qualificador entre parênteses, quando necessário, para distinguir títulos semelhantes.",
                "Este campo é usado principalmente por centros do ISSN e é ligado logicamente ao campo 530."
            ],
            subFieldDef: [
                { code: "a", label: "Abbreviated Title", repeatable: false, mandatory: true, tips: ["Título-chave abreviado, sem qualificação adicional. Baseado em ISSN + ISO 4."] },
                { code: "b", label: "Qualifier", repeatable: false, mandatory: false, tips: ["Informação qualificada (entidade, local, ano) entre parênteses, para distinguir títulos idênticos."] },
                { code: "v", label: "Volume Designation", repeatable: false, mandatory: false, tips: ["Designação de volume associada ao título (usado apenas quando o campo está embutido em 4--)."] }
            ]
        },
        {
            tag: "532",
            name: "EXPANDED TITLE",
            ind1Name: "Title Significance Indicator",
            ind1Tips: ["0 - Expanded title is not significant, 1 - Expanded title is significant"],
            ind2Name: "Type of Expansion Indicator",
            ind2Tips: ["0 - Initialism, 1 - Numeral, 2 - Abbreviation, 3 - Other, non-roman symbol, etc"],
            tips: [
                "Este campo contém uma forma expandida do título quando a forma original usa abreviaturas, siglas, números ou símbolos que podem causar dificuldades de pesquisa, visualização ou compreensão.",
                "Utilizado para criar pontos de acesso adicionais ou notas, especialmente quando o título principal (campo 200) ou o título-chave (campo 530) não são suficientemente informativos ou legíveis.",
                "O indicador 2 define o tipo de expansão: sigla, número, abreviação ou símbolo não romano.",
                "Se a expansão estiver em outro idioma, pode-se usar $z com código de língua e $2 com o esquema da codificação linguística."
            ],
            subFieldDef: [
                { code: "a", label: "Expanded Title", repeatable: false, mandatory: true, tips: ["Texto completo do título expandido."] },
                { code: "z", label: "Language of Title", repeatable: false, mandatory: false, tips: ["Código da língua da expansão (ex: 'fre' para francês). Usar ISO 639-2 ou esquema indicado em $2."] },
                { code: "2", label: "Source", repeatable: false, mandatory: false, tips: ["Fonte da codificação do código de língua no $z (ex: iso639-3)."] }
            ]
        },
        {
            tag: "540",
            name: "ADDITIONAL TITLE SUPPLIED BY CATALOGUE",
            ind1Name: "Title Significance Indicator",
            ind1Tips: ["0 - Additional title is not significant, 1 - Additional title is significant"],
            ind2Tips: ["# - Em branco (não definido)"],
            tips: [
                "Este campo contém títulos adicionais fornecidos pelo catalogador, como títulos populares ou de referência, que não aparecem na publicação.",
                "Pode ser também utilizado para criar pontos de acesso derivados do título principal, especialmente quando não se deseja considerar esse título como o título preferido.",
                "Tais títulos são, em alguns contextos, usados apenas como referências na estrutura de autoridade, em vez de pontos de acesso no registo bibliográfico."
            ],
            subFieldDef: [
                { code: "a", label: "Additional Title", repeatable: false, mandatory: true, tips: ["Texto do título adicional fornecido pelo catalogador."] },
                { code: "e", label: "Other Title Information", repeatable: true, mandatory: false, tips: ["Subtítulos ou outras informações associadas ao título adicional."] },
                { code: "h", label: "Number of Part", repeatable: false, mandatory: false, tips: ["Numeração da parte correspondente ao título adicional."] },
                { code: "i", label: "Name of Part", repeatable: false, mandatory: false, tips: ["Nome da parte correspondente ao título adicional."] },
                { code: "j", label: "Volume or Dates Associated with Title", repeatable: false, mandatory: false, tips: ["Volume ou datas associadas ao título adicional."] },
                { code: "n", label: "Miscellaneous Information", repeatable: false, mandatory: false, tips: ["Informações variadas como 'varia ligeiramente', 'edição brochada', etc."] },
                { code: "z", label: "Language of Title", repeatable: false, mandatory: false, tips: ["Código de língua da forma do título adicional (ISO 639-2 ou esquema definido em $2)."] },
                { code: "2", label: "Source", repeatable: false, mandatory: false, tips: ["Identificação da fonte do código de língua se diferente de ISO 639-2."] }
            ]
        },
        {
            tag: "541",
            name: "TRANSLATED TITLE SUPPLIED BY CATALOGUER",
            ind1Name: "Title Significance Indicator",
            ind1Tips: ["0 - Translated title is not significant, 1 - Translated title is significant"],
            ind2Tips: ["# - Em branco (não definido)"],
            tips: [
                "Este campo contém a tradução de um dos títulos da publicação, fornecida pelo catalogador.",
                "É utilizado quando a tradução não aparece no recurso original, sendo inferida ou traduzida por decisão do catalogador.",
                "Se a tradução constar da própria publicação, deve ser usada em campos como 200 $d ou 510.",
                "Não se deve usar para títulos preferidos prescritos por códigos de catalogação (usar 500 nesses casos)."
            ],
            subFieldDef: [
                { code: "a", label: "Translated Title", repeatable: false, mandatory: true, tips: ["Tradução do título principal, sem informações complementares."] },
                { code: "e", label: "Other Title Information", repeatable: true, mandatory: false, tips: ["Subtítulos ou outras informações associadas à tradução do título."] },
                { code: "h", label: "Number of Part", repeatable: false, mandatory: false, tips: ["Numeração da parte, se a obra estiver subdividida."] },
                { code: "i", label: "Name of Part", repeatable: false, mandatory: false, tips: ["Nome da parte, se aplicável."] },
                { code: "z", label: "Language of Translated Title", repeatable: false, mandatory: false, tips: ["Código da língua da tradução, de acordo com ISO 639-2 ou outro esquema indicado em $2."] },
                { code: "2", label: "Source", repeatable: false, mandatory: false, tips: ["Identificação do esquema de codificação linguística usado em $z (ex: iso639-3)."] }
            ]
        },
        {
            tag: "545",
            name: "SECTION TITLE",
            ind1Name: "Section Title Significance Indicator",
            ind1Tips: ["0 - Section title is not significant, 1 - Section title is significant"],
            ind2Tips: ["# - Em branco (não definido)"],
            tips: [
                "Este campo contém o título de uma secção geral onde uma parte da obra (como um artigo em volume coletivo) está contida.",
                "Utilizado tipicamente em registos de análises de partes (piece-analytics).",
                "Serve para indicar que o item faz parte de uma secção nomeada, mas que não constitui o título principal.",
                "Quando relevante, pode ser usado como ponto de acesso bibliográfico ou apenas como nota contextual."
            ],
            subFieldDef: [
                { code: "a", label: "Section Title", repeatable: false, mandatory: true, tips: ["Título da secção geral onde o recurso está contido."] },
                { code: "e", label: "Other Title Information", repeatable: true, mandatory: false, tips: ["Subtítulos ou outras informações subordinadas ao título da secção."] },
                { code: "h", label: "Number of Part", repeatable: false, mandatory: false, tips: ["Numeração da parte associada ao título da secção."] },
                { code: "i", label: "Name of Part", repeatable: false, mandatory: false, tips: ["Nome da parte associada ao título da secção."] },
                { code: "j", label: "Volume or Dates Associated with Title", repeatable: false, mandatory: false, tips: ["Volume ou datas a que o título da secção se refere."] },
                { code: "n", label: "Miscellaneous Information", repeatable: false, mandatory: false, tips: ["Informações variadas, como 'varia ligeiramente', 'edição brochada', etc."] },
                { code: "z", label: "Language of Title", repeatable: false, mandatory: false, tips: ["Código da língua do título da secção (ISO 639-2 ou conforme definido em $2)."] },
                { code: "2", label: "Source", repeatable: false, mandatory: false, tips: ["Esquema de codificação utilizado em $z, caso não seja ISO 639-2."] }
            ]
        },
        {
            tag: "560",
            name: "ARTIFICIAL TITLE",
            ind1Name: "Title Significance Indicator",
            ind1Tips: ["0 - Title is not significant, 1 - Title is significant"],
            ind2Tips: ["# - Em branco (não definido)"],
            tips: [
                "Este campo é usado para registar um título atribuído ao recurso após a sua publicação.",
                "Exemplos incluem títulos de encadernação ou rótulos posteriores ao fabrico.",
                "É utilizado apenas quando o item tem, por exemplo na capa ou contracapa, um título artificial que difere do título principal.",
                "Pode incluir indicação da instituição a que esse campo se aplica (subcampo $5)."
            ],
            subFieldDef: [
                { code: "a", label: "Artificial Title", repeatable: false, mandatory: true, tips: ["Título artificial atribuído ao item, normalmente não impresso originalmente."] },
                { code: "e", label: "Other Title Information", repeatable: true, mandatory: false, tips: ["Informações complementares ao título artificial, como subtítulo."] },
                { code: "5", label: "Institution to which the Field Applies", repeatable: false, mandatory: false, tips: ["Código ou nome da instituição à qual este campo se aplica.", "Pode seguir o padrão ISIL (ISO 15511), MARC Code List ou nome completo da instituição.", "Se houver várias cópias, pode incluir o shelfmark após dois pontos (ex: TO0741 MOS: R 105)."] }
            ]
        },
        {
            tag: "576",
            name: "NAME/ ACCESS POINT - IDENTIFICATION OF A WORK",
            ind1Name: "Primary Entry Indicator",
            ind1Tips: ["0 - Title is not primary entry or value is not specified, 1 - Title is primary entry"],
            ind2Name: "Structure Indicator",
            ind2Tips: ["# - Not applicable (embedded fields technique) or No information available (standard subfields technique), 0 - Unstructured title (standard subfields technique), 1 - Structured title (standard subfields technique)"],
            tips: [
                "Este campo contém o ponto de acesso nome/título que identifica uma obra, conforme descrita na manifestação do registo.",
                "É utilizado quando há uma associação entre o nome (pessoa, entidade) e o título da obra.",
                "Segue os princípios do modelo FRBR/IFLA LRM e pode substituir o campo 500.",
                "Utilizar o campo 506 quando não existir um nome associado ao título da obra."
            ],
            subFieldDef: [
                { code: "a", label: "Name", repeatable: false, mandatory: true, tips: ["Nome da pessoa, entidade ou família com responsabilidade principal pela obra."] },
                { code: "t", label: "Title", repeatable: false, mandatory: true, tips: ["Título pelo qual a obra é conhecida."] },
                { code: "h", label: "Number of Section or Part", repeatable: true, mandatory: false, tips: ["Número da parte da obra, se aplicável."] },
                { code: "i", label: "Name of Section or Part", repeatable: true, mandatory: false, tips: ["Nome da parte da obra, se aplicável."] },
                { code: "c", label: "Form of Work", repeatable: false, mandatory: false, tips: ["Forma da obra — categoria ou género (ex: romance, sinfonia)."] },
                { code: "d", label: "Date of Work", repeatable: false, mandatory: false, tips: ["Data da criação ou publicação da obra, para fins de distinção."] },
                { code: "e", label: "Place of Origin of Work", repeatable: false, mandatory: false, tips: ["País ou jurisdição de origem da obra."] },
                { code: "f", label: "Original Language of the Work", repeatable: false, mandatory: false, tips: ["Língua original da obra."] },
                { code: "k", label: "Other Distinguishing Characteristics of a Work", repeatable: true, mandatory: false, tips: ["Outros atributos que distinguem a obra (ex: versão, editor responsável)."] },
                { code: "r", label: "Medium of Performance (for Music)", repeatable: true, mandatory: false, tips: ["Instrumentação ou desempenho da obra musical."] },
                { code: "s", label: "Numeric Designation (for Music)", repeatable: true, mandatory: false, tips: ["Número designado pelo compositor (opus, catálogo, série, etc)."] },
                { code: "u", label: "Key (for Music)", repeatable: false, mandatory: false, tips: ["Tonalidade musical da obra."] },
                { code: "j", label: "Form Subdivision", repeatable: true, mandatory: false, tips: ["Subdivisão de forma para pontos de acesso de assunto."] },
                { code: "x", label: "Topical Subdivision", repeatable: true, mandatory: false, tips: ["Subdivisão temática para pontos de acesso de assunto."] },
                { code: "y", label: "Geographical Subdivision", repeatable: true, mandatory: false, tips: ["Subdivisão geográfica para pontos de acesso de assunto."] },
                { code: "z", label: "Chronological Subdivision", repeatable: true, mandatory: false, tips: ["Subdivisão cronológica para pontos de acesso de assunto."] },
                { code: "3", label: "Authority Record Identifier or Standard Number", repeatable: false, mandatory: false, tips: ["Identificador de registo de autoridade ou número normalizado."] }
            ]
        },
        {
            tag: "577",
            name: "NAME/ACCESS POINT - IDENTIFICATION OF AN EXPRESSION",
            ind1Name: "Primary Entry Indicator",
            ind1Tips: ["0 - Title is not primary, 1 - Title is primary entry"],
            ind2Name: "Structure Indicator",
            ind2Tips: ["# — Not applicable (embedded fields technique) or No information available (standard subfields technique), 0 — Unstructured title (standard subfields technique), 1 — Structured title (standard subfields technique)"],
            tips: [
                "Contém o nome/título preferido que identifica uma expressão específica de uma obra.",
                "Utiliza-se em registos de manifestações, especialmente quando é necessário ligar a expressão ao nome de autor.",
                "Substitui o campo 500 em catálogos que seguem o modelo IFLA LRM.",
                "Quando não há nome associado ao título da expressão, deve-se usar o campo 507."
            ],
            subFieldDef: [
                { code: "a", label: "Name", repeatable: false, mandatory: true, tips: ["Nome da pessoa ou entidade responsável pela obra."] },
                { code: "t", label: "Title", repeatable: false, mandatory: true, tips: ["Título da obra à qual a expressão pertence."] },
                { code: "h", label: "Number of Section or Part", repeatable: true, mandatory: false, tips: ["Número da parte da obra."] },
                { code: "i", label: "Name of Section or Part", repeatable: true, mandatory: false, tips: ["Nome da parte da obra."] },
                { code: "c", label: "Form of Work", repeatable: false, mandatory: false, tips: ["Género ou forma da obra."] },
                { code: "d", label: "Date of Work", repeatable: false, mandatory: false, tips: ["Data associada à obra."] },
                { code: "e", label: "Place of Origin of Work", repeatable: false, mandatory: false, tips: ["Local de origem da obra."] },
                { code: "f", label: "Original Language of the Work", repeatable: false, mandatory: false, tips: ["Língua original da obra."] },
                { code: "k", label: "Other Distinguishing Characteristics of a Work", repeatable: true, mandatory: false, tips: ["Outras características distintivas da obra."] },
                { code: "r", label: "Medium of Performance (for Music)", repeatable: true, mandatory: false, tips: ["Instrumentação ou desempenho (música)."] },
                { code: "s", label: "Numeric Designation (for Music)", repeatable: false, mandatory: false, tips: ["Designação numérica como opus, catálogo."] },
                { code: "u", label: "Key (for Music)", repeatable: false, mandatory: false, tips: ["Tonalidade musical."] },
                { code: "l", label: "Form of the Expression", repeatable: false, mandatory: false, tips: ["Forma da expressão, como versão, extrato, etc."] },
                { code: "m", label: "Language of the Expression", repeatable: false, mandatory: false, tips: ["Língua da expressão."] },
                { code: "n", label: "Content Type", repeatable: false, mandatory: false, tips: ["Tipo de conteúdo expresso."] },
                { code: "o", label: "Date of Expression", repeatable: false, mandatory: false, tips: ["Data da expressão da obra."] },
                { code: "v", label: "Medium of Performance (for Music) [Expression]", repeatable: true, mandatory: false, tips: ["Instrumentação específica da expressão."] },
                { code: "w", label: "Other Characteristics of Expression", repeatable: true, mandatory: false, tips: ["Versão, intérpretes ou outras características únicas da expressão."] },
                { code: "j", label: "Form Subdivision", repeatable: true, mandatory: false, tips: ["Subdivisão de forma (acesso por assunto)."] },
                { code: "x", label: "Topical Subdivision", repeatable: true, mandatory: false, tips: ["Subdivisão temática."] },
                { code: "y", label: "Geographical Subdivision", repeatable: true, mandatory: false, tips: ["Subdivisão geográfica."] },
                { code: "z", label: "Chronological Subdivision", repeatable: true, mandatory: false, tips: ["Subdivisão cronológica."] },
                { code: "3", label: "Authority Record Identifier or Standard Number", repeatable: false, mandatory: false, tips: ["Identificador do registo de autoridade (campo 242)."] }
            ]
        },
        {
            tag: "600",
            name: "PERSONAL NAME USED AS SUBJECT",
            ind1Name: "Primary Entry Indicator",
            ind1Tips: ["# - Em branco (não definido)"],
            ind2Name: "Form of Name Indicator",
            ind2Tips: ["0 — Name entered under forename or in direct order, 1 — Name entered under surname (family name, patronymic etc.)"],
            tips: [
                "Este campo contém o nome de uma pessoa que é assunto do recurso, em forma de ponto de acesso.",
                "Pode incluir subdivisões por forma, tema, localização ou tempo.",
                "Segue a estrutura semelhante à dos campos 7-- (responsabilidade), com complementos de assunto.",
                "Usa-se para associar pessoas ao conteúdo como tema, não como autor.",
                "É altamente recomendado indicar a fonte de autoridade ($2)."
            ],
            subFieldDef: [
                { code: "a", label: "Entry Element", repeatable: false, mandatory: true, tips: ["Elemento principal de entrada do nome. Deve sempre estar presente."] },
                { code: "b", label: "Part of Name Other than Entry Element", repeatable: false, mandatory: false, tips: ["Parte restante do nome, como nomes próprios ou apelidos, quando o elemento de entrada é um sobrenome."] },
                { code: "c", label: "Additions to Name Other than Dates", repeatable: true, mandatory: false, tips: ["Títulos ou epítetos como 'Dr.', 'Rei de Inglaterra', etc."] },
                { code: "d", label: "Roman Numerals", repeatable: false, mandatory: false, tips: ["Numerais romanos associados a nomes (ex: João Paulo II)."] },
                { code: "f", label: "Dates", repeatable: false, mandatory: false, tips: ["Datas associadas à pessoa (ex: 1870–1945)."] },
                { code: "g", label: "Expansion of Initials of Forename", repeatable: false, mandatory: false, tips: ["Forma completa dos nomes próprios quando abreviados em $b."] },
                { code: "p", label: "Affiliation/Address", repeatable: false, mandatory: false, tips: ["Afiliação institucional da pessoa na época da criação do recurso."] },
                { code: "j", label: "Form Subdivision", repeatable: true, mandatory: false, tips: ["Subdivisão por tipo de material (ex: biografias, discursos)."] },
                { code: "x", label: "Topical Subdivision", repeatable: true, mandatory: false, tips: ["Subdivisão temática (ex: 'contribuições', 'ideias políticas')."] },
                { code: "y", label: "Geographical Subdivision", repeatable: true, mandatory: false, tips: ["Subdivisão por local (ex: Alemanha, Lisboa)."] },
                { code: "z", label: "Chronological Subdivision", repeatable: true, mandatory: false, tips: ["Subdivisão por período (ex: século XIX, anos 1930)."] },
                { code: "2", label: "Source", repeatable: false, mandatory: false, tips: ["Código da fonte ou sistema de autoridade usado (ex: 'rameau', 'lc')."] },
                { code: "3", label: "Authority Record Identifier or Standard Number", repeatable: true, mandatory: false, tips: ["Identificador do registo de autoridade correspondente."] }
            ]
        },
        {
            tag: "601",
            name: "CORPORATE BODY NAME USED AS SUBJECT",
            ind1Name: "Meeting Indicator",
            ind1Tips: ["0 - Name in inverted order, 1 - Name entered under place or jurisdiction, 2 - Name entered under name in direct order"],
            ind2Name: "Form of Name Indicator",
            ind2Tips: ["0 — Name entered under place or jurisdiction, 1 — Name entered under name in direct order"],
            tips: [
                "Este campo contém o nome de uma entidade coletiva que é assunto do recurso.",
                "Pode incluir subdivisões por forma, tema, localização ou tempo.",
                "Subfields seguem a mesma estrutura do campo 710 (responsabilidade), mas com contexto de assunto.",
                "É fortemente recomendado indicar a fonte do ponto de acesso ($2)."
            ],
            subFieldDef: [
                { code: "a", label: "Entry Element", repeatable: false, mandatory: true, tips: ["Nome principal da entidade coletiva."] },
                { code: "b", label: "Subdivision (or Name if Entered Under Place)", repeatable: true, mandatory: false, tips: ["Subdivisão hierárquica ou nome quando inserido sob localidade."] },
                { code: "c", label: "Addition to Name or Qualifier", repeatable: true, mandatory: false, tips: ["Qualificadores adicionados ao nome (ex: ramo, localização, etc.)."] },
                { code: "d", label: "Number of Meeting / Part of Meeting", repeatable: false, mandatory: false, tips: ["Número da reunião ou parte da mesma."] },
                { code: "e", label: "Location of Meeting", repeatable: false, mandatory: false, tips: ["Local onde decorreu a reunião."] },
                { code: "f", label: "Date of Meeting", repeatable: false, mandatory: false, tips: ["Data da reunião."] },
                { code: "g", label: "Inverted Element", repeatable: false, mandatory: false, tips: ["Elemento invertido do nome."] },
                { code: "h", label: "Part of Name other than Entry Element and Inverted Element", repeatable: false, mandatory: false, tips: ["Parte do nome não incluída em $a ou $g."] },
                { code: "j", label: "Form Subdivision", repeatable: true, mandatory: false, tips: ["Termo que especifica o tipo ou género de material (ex: relatórios, manuais)."] },
                { code: "x", label: "Topical Subdivision", repeatable: true, mandatory: false, tips: ["Subdivisão temática (ex: história, legislação)."] },
                { code: "y", label: "Geographical Subdivision", repeatable: true, mandatory: false, tips: ["Subdivisão geográfica."] },
                { code: "z", label: "Chronological Subdivision", repeatable: true, mandatory: false, tips: ["Subdivisão cronológica (ex: século XIX)."] },
                { code: "2", label: "Source", repeatable: false, mandatory: false, tips: ["Código da fonte de autoridade (ex: rameau, lc)."] },
                { code: "3", label: "Authority Record Identifier or Standard Number", repeatable: true, mandatory: false, tips: ["Identificador do registo de autoridade correspondente."] }
            ]
        },
        {
            tag: "602",
            name: "FAMILY NAME USED AS SUBJECT",
            ind1Tips: ["# - Em branco (não definido)"],
            ind2Tips: ["# - Em branco (não definido)"],
            tips: [
                "Este campo contém o nome de uma família que é assunto do recurso.",
                "A estrutura segue o formato dos pontos de acesso usados em responsabilidades (campo 720).",
                "Podem ser adicionadas subdivisões por forma, assunto, local ou tempo.",
                "A fonte do ponto de acesso ($2) é recomendada.",
                "Dados de qualificação são gravados em $c, $d e $f."
            ],
            subFieldDef: [
                { code: "a", label: "Entry Element", repeatable: false, mandatory: true, tips: ["Nome da família em forma de ponto de acesso."] },
                { code: "c", label: "Type of Family", repeatable: false, mandatory: false, tips: ["Categoria ou tipo da família (ex: clã, dinastia, patriarcado)."] },
                { code: "d", label: "Places Associated with the Family", repeatable: true, mandatory: false, tips: ["Locais com os quais a família está/esteve associada."] },
                { code: "f", label: "Dates", repeatable: false, mandatory: false, tips: ["Datas associadas à família (ex: dinastias históricas)."] },
                { code: "j", label: "Form Subdivision", repeatable: true, mandatory: false, tips: ["Especifica o tipo ou género de material."] },
                { code: "x", label: "Topical Subdivision", repeatable: true, mandatory: false, tips: ["Especifica o tópico representado pelo ponto de acesso."] },
                { code: "y", label: "Geographical Subdivision", repeatable: true, mandatory: false, tips: ["Subdivisão por localidade associada à família."] },
                { code: "z", label: "Chronological Subdivision", repeatable: true, mandatory: false, tips: ["Subdivisão temporal relacionada à família."] },
                { code: "2", label: "Source", repeatable: false, mandatory: false, tips: ["Código da fonte do ponto de acesso (ex: rameau)."] },
                { code: "3", label: "Authority Record Identifier or Standard Number", repeatable: true, mandatory: false, tips: ["Identificador de autoridade correspondente."] }
            ]
        },
        {
            tag: "604",
            name: "NAME AND TITLE USED AS SUBJECT",
            ind1Tips: ["# - Em branco (não definido)"],
            ind2Tips: ["# - Em branco (não definido)"],
            tips: [
                "Este campo contém o nome de um autor (pessoa, entidade coletiva ou família) e o título de uma obra que é assunto do recurso.",
                "É usado para expressar o título da obra como sujeito, com o nome do responsável incluído.",
                "O título da obra é registado no subcampo $t, e o nome do autor em $a.",
                "Podem ser usadas subdivisões por forma, tema, localização ou tempo.",
                "O uso da fonte de autoridade ($2) e identificadores ($3) é recomendado."
            ],
            subFieldDef: [
                { code: "1", label: "Linking Data (Embedded Field Technique)", repeatable: true, mandatory: false, tips: ["Contém etiqueta e indicadores de campos embutidos, sem pontuação ou espaços."] },
                { code: "a", label: "Name", repeatable: false, mandatory: true, tips: ["Nome da pessoa, entidade ou família com responsabilidade pela obra."] },
                { code: "t", label: "Title", repeatable: false, mandatory: true, tips: ["Título pelo qual a obra é conhecida."] },
                { code: "j", label: "Form Subdivision", repeatable: true, mandatory: false, tips: ["Especifica o tipo ou género de material."] },
                { code: "x", label: "Topical Subdivision", repeatable: true, mandatory: false, tips: ["Subdivisão temática associada à obra."] },
                { code: "y", label: "Geographical Subdivision", repeatable: true, mandatory: false, tips: ["Subdivisão geográfica associada à obra."] },
                { code: "z", label: "Chronological Subdivision", repeatable: true, mandatory: false, tips: ["Subdivisão cronológica associada à obra."] },
                { code: "2", label: "Source", repeatable: false, mandatory: false, tips: ["Sistema de autoridade ou thesaurus usado (ex: rameau, lc)."] },
                { code: "3", label: "Authority Record Identifier or Standard Number", repeatable: true, mandatory: false, tips: ["Identificador do registo de autoridade do ponto de acesso."] }
            ]
        },
        {
            tag: "605",
            name: "TITLE USED AS SUBJECT",
            ind1Tips: ["# - Em branco (não definido)"],
            ind2Tips: ["# - Em branco (não definido)"],
            tips: [
                "Este campo contém um título que é assunto do recurso descrito.",
                "Utilizado para obras anónimas ou títulos não associados diretamente a autores.",
                "Quando o assunto for uma combinação de nome e título, deve-se utilizar o campo 604.",
                "É possível incluir subdivisões por forma, tema, localização ou tempo.",
                "Títulos de obras em qualquer meio (literatura, teatro, cinema, música, etc.) são registados aqui."
            ],
            subFieldDef: [
                { code: "a", label: "Entry Element", repeatable: false, mandatory: true, tips: ["Título curto ou título principal da obra."] },
                { code: "h", label: "Number of Section or Part", repeatable: true, mandatory: false, tips: ["Número da secção ou parte da obra."] },
                { code: "i", label: "Name of Section or Part", repeatable: true, mandatory: false, tips: ["Nome da secção ou parte da obra."] },
                { code: "k", label: "Date of Publication", repeatable: false, mandatory: false, tips: ["Data de publicação da obra referida como assunto."] },
                { code: "l", label: "Form Subheading", repeatable: false, mandatory: false, tips: ["Frase padrão que especifica melhor o título."] },
                { code: "m", label: "Language (when Part of Access Point)", repeatable: false, mandatory: false, tips: ["Língua da obra quando necessário na formulação do ponto de acesso."] },
                { code: "n", label: "Miscellaneous Information", repeatable: true, mandatory: false, tips: ["Informação diversa, como designações materiais genéricas."] },
                { code: "q", label: "Version (or Date of Version)", repeatable: false, mandatory: false, tips: ["Versão da obra ou data da versão."] },
                { code: "r", label: "Medium of Performance (for Music)", repeatable: true, mandatory: false, tips: ["Instrumentação da obra musical."] },
                { code: "s", label: "Numeric Designation (for Music)", repeatable: true, mandatory: false, tips: ["Número atribuído à obra musical (opus, série, etc.)."] },
                { code: "u", label: "Key (for Music)", repeatable: false, mandatory: false, tips: ["Tom musical da obra."] },
                { code: "w", label: "Arranged Statement (for Music)", repeatable: false, mandatory: false, tips: ["Indicação de que a obra musical é um arranjo."] },
                { code: "j", label: "Form Subdivision", repeatable: true, mandatory: false, tips: ["Subdivisão de forma para especificar tipo ou género de material."] },
                { code: "x", label: "Topical Subdivision", repeatable: true, mandatory: false, tips: ["Subdivisão temática relacionada com o título."] },
                { code: "y", label: "Geographical Subdivision", repeatable: true, mandatory: false, tips: ["Subdivisão geográfica aplicável ao título."] },
                { code: "z", label: "Chronological Subdivision", repeatable: true, mandatory: false, tips: ["Subdivisão cronológica aplicável ao título."] },
                { code: "2", label: "Source", repeatable: false, mandatory: false, tips: ["Fonte de autoridade do ponto de acesso."] },
                { code: "3", label: "Authority Record Identifier or Standard Number", repeatable: true, mandatory: false, tips: ["Identificador de autoridade relacionado com o ponto de acesso."] }
            ]
        },
        {
            tag: "606",
            name: "TOPICAL NAME USED AS SUBJECT",
            ind1Tips: ["# - Em branco (não definido)"],
            ind2Tips: ["# - Em branco (não definido)"],
            tips: [
                "Este campo contém um termo ou conceito usado como assunto do recurso.",
                "Pode representar temas, tópicos, eventos, objetos, atividades, disciplinas, etc.",
                "Permite subdivisões por forma, localização e tempo.",
                "A fonte de autoridade usada deve ser identificada no subcampo $2.",
                "É recomendável que cada subcampo $x, $y, $z seja usado para uma única subdivisão."
            ],
            subFieldDef: [
                { code: "a", label: "Topical Name as Subject", repeatable: false, mandatory: true, tips: ["Termo temático que representa o assunto principal."] },
                { code: "j", label: "Form Subdivision", repeatable: true, mandatory: false, tips: ["Subdivisão por forma (ex: dicionários, biografias, estudos de caso)."] },
                { code: "x", label: "Topical Subdivision", repeatable: true, mandatory: false, tips: ["Subdivisão por tema (ex: legislação, ética, história)."] },
                { code: "y", label: "Geographical Subdivision", repeatable: true, mandatory: false, tips: ["Subdivisão geográfica (ex: Portugal, Europa, Japão)."] },
                { code: "z", label: "Chronological Subdivision", repeatable: true, mandatory: false, tips: ["Subdivisão cronológica (ex: século XXI, 1945-1991)."] },
                { code: "2", label: "Source", repeatable: false, mandatory: false, tips: ["Código da fonte de autoridade (ex: rameau, lcsh, mesh)."] },
                { code: "3", label: "Authority Record Identifier or Standard Number", repeatable: true, mandatory: false, tips: ["Identificador de registo de autoridade correspondente."] }
            ]
        },
        {
            tag: "607",
            name: "GEOGRAPHICAL NAME USED AS SUBJECT",
            ind1Tips: ["# - Em branco (não definido)"],
            ind2Tips: ["# - Em branco (não definido)"],
            tips: [
                "Este campo contém um nome geográfico usado como ponto de acesso de assunto.",
                "Abrange locais geográficos como países, cidades, regiões, continentes, etc.",
                "É possível subdividir o acesso por forma, tema, localização adicional ou tempo.",
                "A fonte de autoridade deve ser indicada no subcampo $2 sempre que possível.",
                "Utilizar este campo apenas quando o nome geográfico não estiver subordinado a outra entidade como uma instituição ou corpo governamental (caso em que se usa 601)."
            ],
            subFieldDef: [
                { code: "a", label: "Entry Element", repeatable: false, mandatory: true, tips: ["Nome geográfico principal no formato da autoridade usada."] },
                { code: "j", label: "Form Subdivision", repeatable: true, mandatory: false, tips: ["Termos de género ou tipo de material (ex: mapas, estatísticas, etc.)."] },
                { code: "x", label: "Topical Subdivision", repeatable: true, mandatory: false, tips: ["Aspetos temáticos relacionados com o local."] },
                { code: "y", label: "Geographical Subdivision", repeatable: true, mandatory: false, tips: ["Localizações adicionais associadas."] },
                { code: "z", label: "Chronological Subdivision", repeatable: true, mandatory: false, tips: ["Período temporal associado ao nome geográfico."] },
                { code: "2", label: "Source", repeatable: false, mandatory: false, tips: ["Código da fonte de autoridade utilizada (ex: rameau, lcsh)."] },
                { code: "3", label: "Authority Record Identifier or Standard Number", repeatable: true, mandatory: false, tips: ["Identificador de autoridade associado ao ponto de acesso."] }
            ]
        },
        {
            tag: "608",
            name: "FORM, GENRE OR PHYSICAL CHARACTERISTICS ACCESS POINT",
            ind1Tips: ["# - Em branco (não definido)"],
            ind2Tips: ["# - Em branco (não definido)"],
            tips: [
                "Este campo contém termos que indicam a forma, género e/ou características físicas do recurso descrito.",
                "Pode incluir subdivisões adicionais por forma ($j), tema ($x), localização ($y) ou tempo ($z).",
                "É altamente recomendado o uso do subcampo $2 para indicar a fonte da terminologia utilizada.",
                "O subcampo $5 permite indicar a instituição à qual o campo se aplica.",
                "Este campo é usado quando se deseja descrever a natureza do conteúdo ou do suporte do recurso."
            ],
            subFieldDef: [
                { code: "a", label: "Entry Element", repeatable: false, mandatory: true, tips: ["O termo conforme estabelecido pela fonte de autoridade utilizada."] },
                { code: "j", label: "Form Subdivision", repeatable: true, mandatory: false, tips: ["Especifica o tipo ou género do material (ex: Biografias, Mapas, Dicionários)."] },
                { code: "x", label: "Topical Subdivision", repeatable: true, mandatory: false, tips: ["Aspetos temáticos adicionais ao termo principal."] },
                { code: "y", label: "Geographical Subdivision", repeatable: true, mandatory: false, tips: ["Especificação geográfica relacionada com a forma ou género."] },
                { code: "z", label: "Chronological Subdivision", repeatable: true, mandatory: false, tips: ["Período temporal relacionado com o termo."] },
                { code: "2", label: "Source", repeatable: false, mandatory: false, tips: ["Código da fonte ou sistema de autoridade utilizado (ex: gsafd, lcsh, rameau, etc.)."] },
                { code: "3", label: "Authority Record Identifier or Standard Number", repeatable: true, mandatory: false, tips: ["Identificador do registo de autoridade associado ao ponto de acesso."] },
                { code: "5", label: "Institution to which the Field Applies", repeatable: false, mandatory: false, tips: ["Identificador da instituição a que o campo se aplica.", "Código ISIL (ISO 15511) ou nome completo da organização."] }
            ]
        },
        {
            tag: "610",
            name: "UNCONTROLLED SUBJECT TERMS",
            ind1Name: "Level of the Subject Term",
            ind1Tips: ["0 - No level specified, Primary term, Secondary term"],
            ind2Tips: ["# - Em branco (não definido)"],
            tips: [
                "Este campo é usado para termos de assunto que não provêm de listas de pontos de acesso controlados.",
                "Pode conter múltiplos termos por campo, cada um em subcampo $a.",
                "Deve ser utilizado apenas quando os termos não estão disponíveis numa lista de autoridade controlada.",
                "Para termos controlados, usar campos 600 a 608 com subcampo $2 para indicar a fonte.",
                "Permite registrar conceitos livres e emergentes em linguagem natural."
            ],
            subFieldDef: [
                { code: "a", label: "Subject Term", repeatable: true, mandatory: true, tips: ["Termo de assunto não controlado atribuído ao recurso.", "Mais de um termo pode ser incluído repetindo o subcampo $a."] }
            ]
        },
        {
            tag: "615",
            name: "SUBJECT CATEGORY [PROVISIONAL]",
            ind1Tips: ["# - Em branco (não definido)"],
            ind2Tips: ["# - Em branco (não definido)"],
            tips: [
                "Este campo contém uma categoria temática de nível superior em forma codificada e/ou textual.",
                "Pode conter o código, a descrição textual ou ambos, da categoria e de suas subdivisões.",
                "O subcampo $2 é recomendado para identificar a fonte do sistema de categorias usado.",
                "Este campo é útil para sistemas que aplicam categorias hierárquicas a áreas temáticas.",
                "É permitido usar tanto códigos (subcampos $n, $m) como termos textuais (subcampos $a, $x)."
            ],
            subFieldDef: [
                { code: "a", label: "Subject Category Entry Element Text", repeatable: false, mandatory: false, tips: ["Termo textual principal da categoria conforme o sistema de categorias utilizado."] },
                { code: "x", label: "Subject Category Subdivision Text", repeatable: true, mandatory: false, tips: ["Subdivisão textual que especifica um aspeto particular da categoria principal."] },
                { code: "n", label: "Subject Category Code", repeatable: true, mandatory: false, tips: ["Código da categoria conforme definido pela fonte de autoridade."] },
                { code: "m", label: "Subject Category Subdivision Code", repeatable: true, mandatory: false, tips: ["Código de subdivisão associado à categoria."] },
                { code: "2", label: "Source", repeatable: false, mandatory: false, tips: ["Identificação codificada da fonte ou sistema de categorias usado."] },
                { code: "3", label: "Authority Record Identifier or Standard Number", repeatable: true, mandatory: false, tips: ["Identificador de autoridade ou número padrão da categoria registrada."] }
            ]
        },
        {
            tag: "616",
            name: "TRADEMARK USED AS SUBJECT [PROVISIONAL]",
            ind1Tips: ["# - Em branco (não definido)"],
            ind2Tips: ["# - Em branco (não definido)"],
            tips: [
                "Este campo contém uma marca registada usada como assunto do recurso.",
                "É um ponto de acesso de assunto estruturado, podendo incluir subdivisões temáticas, geográficas, cronológicas, etc.",
                "As marcas podem incluir nomes comerciais, logotipos, designações visuais ou verbais, como 'Pentium', 'Levi's', etc.",
                "Subcampo $2 é recomendado para indicar a fonte de autoridade (ex: rameau, lcsh)."
            ],
            subFieldDef: [
                { code: "a", label: "Entry Element", repeatable: false, mandatory: true, tips: ["Nome da marca registada em forma de ponto de acesso."] },
                { code: "f", label: "Dates", repeatable: false, mandatory: false, tips: ["Datas durante as quais a marca foi usada, quando necessário para qualificação."] },
                { code: "c", label: "Qualification", repeatable: true, mandatory: false, tips: ["Qualificação adicional adicionada à marca, exceto datas."] },
                { code: "j", label: "Form Subdivision", repeatable: true, mandatory: false, tips: ["Tipo ou género do material (usar $x se não se aplicar este)."] },
                { code: "x", label: "Topical Subdivision", repeatable: true, mandatory: false, tips: ["Tópico relacionado com a marca."] },
                { code: "y", label: "Geographical Subdivision", repeatable: true, mandatory: false, tips: ["Localização associada à marca."] },
                { code: "z", label: "Chronological Subdivision", repeatable: true, mandatory: false, tips: ["Período temporal relacionado à marca."] },
                { code: "2", label: "Source", repeatable: false, mandatory: false, tips: ["Código da fonte de autoridade (ex: rameau, lcsh, etc.)."] },
                { code: "3", label: "Authority Record Identifier or Standard Number", repeatable: false, mandatory: false, tips: ["Identificador do registo de autoridade associado."] }
            ]
        },
        {
            tag: "617",
            name: "HIERARCHICAL GEOGRAPHICAL NAME USED AS SUBJECT",
            ind1Tips: ["# - Em branco (não definido)"],
            ind2Tips: ["# - Em branco (não definido)"],
            tips: [
                "Contém um ponto de acesso estruturado para lugares que são assuntos do recurso.",
                "Os subcampos podem ser usados em hierarquia (ex: país, estado, cidade) conforme necessário.",
                "Subcampos $a, $c, $k, $m, $n e $o são repetíveis quando múltiplos níveis são usados.",
                "É recomendado o uso do subcampo $2 para indicar a fonte dos termos utilizados.",
                "Este campo é útil em recursos onde a localização física é um tema central ou relevante."
            ],
            subFieldDef: [
                { code: "a", label: "Country (Nation State)", repeatable: true, mandatory: false, tips: ["País ou Estado-nação."] },
                { code: "b", label: "State or Province, etc.", repeatable: false, mandatory: false, tips: ["Divisão administrativa de primeira ordem."] },
                { code: "c", label: "Intermediate Political Jurisdiction", repeatable: true, mandatory: false, tips: ["Divisão política de segunda ordem ou inferior."] },
                { code: "d", label: "City, etc.", repeatable: false, mandatory: false, tips: ["Nome de uma cidade, vila ou localidade populacional."] },
                { code: "e", label: "Venue", repeatable: true, mandatory: false, tips: ["Edifícios nomeados, espaços urbanos, veículos, etc."] },
                { code: "f", label: "Date", repeatable: true, mandatory: false, tips: ["Data(s) associada(s) ao evento ou local. ISO 8601."] },
                { code: "g", label: "Season", repeatable: false, mandatory: false, tips: ["Estação do ano, ex: Verão."] },
                { code: "h", label: "Occasion", repeatable: false, mandatory: false, tips: ["Ocasião especial relacionada ao local."] },
                { code: "i", label: "Final Date", repeatable: false, mandatory: false, tips: ["Data final de um evento."] },
                { code: "k", label: "Subsection of City, etc.", repeatable: true, mandatory: false, tips: ["Unidade menor dentro de uma cidade, como bairro ou rua."] },
                { code: "m", label: "Other Geographical Regions or Features", repeatable: true, mandatory: false, tips: ["Entidades geográficas não jurisdicionais, como oceanos ou montanhas."] },
                { code: "n", label: "Extraterrestrial Areas", repeatable: true, mandatory: false, tips: ["Entidades espaciais como planetas ou luas."] },
                { code: "o", label: "Geographical Areas Larger Than Country", repeatable: true, mandatory: false, tips: ["Áreas como hemisférios, continentes ou o mundo."] },
                { code: "2", label: "Source", repeatable: false, mandatory: false, tips: ["Fonte do termo geográfico, ex: gnis, pemracs."] },
                { code: "3", label: "Authority Record Identifier or Standard Number", repeatable: false, mandatory: false, tips: ["Identificador do registo de autoridade."] }
            ]
        },
        {
            tag: "620",
            name: "PLACE AND DATE OF PUBLICATION, PERFORMANCE, ETC.",
            ind1Name: "Type of Data",
            ind1Tips: ["# - Publication or production, 0 - Not specified, 1 - Performance, 2 - First Performance, 3 - Recording, 4 - Live recording, 5 - Remastering"],
            ind2Name: "Presence of Data on Source",
            ind2Tips: ["# - Not applicable, 0 - Data not present on source, 1 - Data present on source, 2 - Data present on source but false or fictitious"],
            tips: [
                "Este campo contém pontos de acesso estruturados para o local de publicação, produção, performance ou gravação.",
                "Pode conter um país, estado, cidade, local do evento, datas, estações ou ocasiões.",
                "A hierarquia geográfica pode seguir a ordem: $o $a $b $c $d $k.",
                "Use $2 para identificar a fonte de autoridade geográfica (como TGN, GNIS).",
                "As datas devem seguir a norma ISO 8601.",
                "A estrutura pode descrever publicações, atuações ao vivo, remasterizações e mais.",
                "Este campo **não** é específico de cópia — aplica-se a toda a edição do recurso."
            ],
            subFieldDef: [
                { code: "a", label: "Country (Nation State)", repeatable: false, mandatory: false, tips: ["País do local de publicação/performance."] },
                { code: "b", label: "State or Province", repeatable: false, mandatory: false, tips: ["Estado ou província (1ª divisão administrativa)."] },
                { code: "c", label: "Intermediate Political Jurisdiction", repeatable: true, mandatory: false, tips: ["Divisão política intermediária (ex: condado)."] },
                { code: "d", label: "City, etc.", repeatable: false, mandatory: false, tips: ["Cidade, vila ou localidade de publicação/performance."] },
                { code: "e", label: "Venue", repeatable: true, mandatory: false, tips: ["Edifício, veículo, praça, etc. onde ocorreu a performance."] },
                { code: "f", label: "Date", repeatable: true, mandatory: false, tips: ["Data normalizada (ISO 8601) da publicação/performance."] },
                { code: "g", label: "Season", repeatable: false, mandatory: false, tips: ["Estação do ano em que ocorreu o evento (ex: Outono)."] },
                { code: "h", label: "Occasion", repeatable: false, mandatory: false, tips: ["Ocasião específica (ex: Festa da Assunção)."] },
                { code: "i", label: "Final Date", repeatable: false, mandatory: false, tips: ["Data final do evento, se for diferente de $f."] },
                { code: "k", label: "Subsection of City", repeatable: true, mandatory: false, tips: ["Bairro ou subdivisão dentro da cidade."] },
                { code: "m", label: "Other Geographic Regions or Features", repeatable: true, mandatory: false, tips: ["Montanhas, oceanos, ilhas, etc."] },
                { code: "n", label: "Extraterrestrial Areas", repeatable: true, mandatory: false, tips: ["Lugares fora da Terra (ex: Lua, Marte)."] },
                { code: "o", label: "Larger Geographical Area", repeatable: true, mandatory: false, tips: ["Ex: Europa, Mundo, Hemisfério Sul."] },
                { code: "2", label: "Source", repeatable: false, mandatory: false, tips: ["Fonte de autoridade (ex: tgn, pemracs)."] },
                { code: "3", label: "Authority Record Identifier or Standard Number", repeatable: false, mandatory: false, tips: ["Identificador do registo de autoridade."] }
            ]
        },
        {
            tag: "621",
            name: "PLACE AND DATE OF PROVENANCE",
            ind1Name: "Type of Data",
            ind1Tips: ["# - Publication or production, 0 - Not specified, 1 - Performance, 2 - First Performance, 3 - Recording, 4 - Live recording, 5 - Remastering, 0 - Not specified"],
            ind2Name: "Presence of Data on Source",
            ind2Tips: ["# - Not applicable/ unknown, 0 - Data not present on source, 1 - Data present on source, 2 - Data present on source but false or fictitious"],
            tips: [
                "Campo específico de item que contém ponto de acesso estruturado para lugares e datas relacionados com a proveniência.",
                "Utilizado em conjunto com o campo 317 (nota de proveniência) e campos de nomes (702, 712, 722).",
                "Subcampo $5 é obrigatório para indicar a instituição a que o campo se aplica.",
                "Usar $6 para ligação entre os campos associados.",
                "As datas seguem a norma ISO 8601, com 'u' para posições desconhecidas.",
                "Hierarquias geográficas podem incluir desde continentes até edifícios específicos."
            ],
            subFieldDef: [
                { code: "a", label: "Country (Nation State)", repeatable: false, mandatory: false, tips: ["País ou entidade nacional relacionada com a proveniência."] },
                { code: "b", label: "State or Province, etc.", repeatable: false, mandatory: false, tips: ["Divisão administrativa de primeira ordem."] },
                { code: "c", label: "Intermediate Political Jurisdiction", repeatable: true, mandatory: false, tips: ["Divisões administrativas inferiores ao estado."] },
                { code: "d", label: "City, etc.", repeatable: false, mandatory: false, tips: ["Cidade, vila ou outra área populacional."] },
                { code: "e", label: "Building, Vehicle, etc.", repeatable: true, mandatory: false, tips: ["Edifício, navio, veículo, ou outro local específico."] },
                { code: "f", label: "Date 1", repeatable: false, mandatory: false, tips: ["Data de início do período de proveniência."] },
                { code: "g", label: "Season", repeatable: false, mandatory: false, tips: ["Estação do ano (ex: primavera)."] },
                { code: "h", label: "Occasion", repeatable: false, mandatory: false, tips: ["Ocasião especial ou evento (ex: Páscoa)."] },
                { code: "i", label: "Date 2", repeatable: false, mandatory: false, tips: ["Data final do período de proveniência."] },
                { code: "k", label: "Subsection of City, etc.", repeatable: true, mandatory: false, tips: ["Bairros, ruas, zonas específicas dentro da cidade."] },
                { code: "m", label: "Other Geographic Regions or Features", repeatable: true, mandatory: false, tips: ["Montanhas, oceanos, ilhas, etc."] },
                { code: "n", label: "Extraterrestrial Area", repeatable: true, mandatory: false, tips: ["Entidades espaciais como planetas ou luas."] },
                { code: "o", label: "Larger Geographical Area", repeatable: true, mandatory: false, tips: ["Regiões como continente, hemisfério ou mundo."] },
                { code: "2", label: "Source", repeatable: false, mandatory: false, tips: ["Fonte de autoridade (ex: tgn, pemracs)."] },
                { code: "3", label: "Authority Record Identifier or Standard Number", repeatable: false, mandatory: false, tips: ["Identificador do registo de autoridade."] },
                { code: "5", label: "Institution to Which the Field Applies", repeatable: false, mandatory: true, tips: ["Instituição à qual o campo se refere. Código ISIL ou MARC, ou nome completo."] },
                { code: "6", label: "Interfield Linking Data", repeatable: true, mandatory: false, tips: ["Código de ligação com campos relacionados (ex: 702, 317)."] }

            ]
        },
        {
            tag: "623",
            name: "CHARACTER",
            ind1Tips: ["# - Em branco (não definido)"],
            ind2Tips: ["# - Em branco (não definido)"],
            tips: [
                "Este campo contém um ponto de acesso estruturado para o nome e outros detalhes relativos a uma personagem fictícia.",
                "Permite associar a personagem a um ou mais intérpretes indicados em campos 7XX através do subcampo $6.",
                "Usado principalmente em materiais relacionados com performance (óperas, filmes, peças de teatro, etc.).",
                "Útil quando a personagem muda de nome ao longo da obra ou é interpretada por várias pessoas.",
                "O subcampo $3 pode conter um identificador de registo de autoridade UNIMARC.",
                "Complementa o campo 323 (nota de elenco) e pode estar relacionado com 702, 712, 722."
            ],
            subFieldDef: [
                { code: "a", label: "Entry Element", repeatable: false, mandatory: true, tips: ["Nome principal da personagem. Ex: 'Vicomte de Valmont'"] },
                { code: "b", label: "Part of Name Other than Entry Element", repeatable: false, mandatory: false, tips: ["Parte do nome da personagem que não faz parte do elemento de entrada."] },
                { code: "c", label: "Additions to Name of the Character", repeatable: true, mandatory: false, tips: ["Títulos, epítetos ou descrições adicionais. Ex: 'Sposo di Lucilla', 'Servo di Uberto'."] },
                { code: "3", label: "Authority Record Identifier or Standard Number", repeatable: false, mandatory: false, tips: ["Identificador para o registo de autoridade correspondente."] },
                { code: "6", label: "Interfield Linking Data", repeatable: true, mandatory: false, tips: ["Permite ligar esta personagem a campos 702 (intérpretes), ou a outras ocorrências de 623 (nome alterado, múltiplos intérpretes)."] }
            ]
        },
        {
            tag: "631",
            name: "OCCUPATION",
            ind1Tips: ["# - Em branco (não definido)"],
            ind2Tips: ["# - Em branco (não definido)"],
            tips: [
                "Este campo contém termos ou expressões que especificam ocupações, profissões, passatempos ou interesses de indivíduos documentados nos materiais descritos.",
                "Não é usado para listar as ocupações dos criadores dos materiais, exceto quando essas ocupações são significativamente refletidas nos recursos.",
                "A presença de $2 (fonte) é recomendada.",
                "Relaciona-se com o campo 606 (Topical Name Used as Subject)."
            ],
            subFieldDef: [
                { code: "a", label: "Occupation", repeatable: false, mandatory: true, tips: ["Profissão, ocupação ou passatempo do indivíduo descrito."] },
                { code: "b", label: "Form", repeatable: false, mandatory: false, tips: ["Classe ou tipo de material (ex: diário, diretório)."] },
                { code: "j", label: "Form Subdivision", repeatable: true, mandatory: false, tips: ["Subdivisão para indicar gênero ou tipo de material."] },
                { code: "x", label: "Topical Subdivision", repeatable: true, mandatory: false, tips: ["Subdivisão temática para especificar ainda mais a ocupação."] },
                { code: "y", label: "Geographical Subdivision", repeatable: true, mandatory: false, tips: ["Subdivisão geográfica relacionada com a ocupação."] },
                { code: "z", label: "Chronological Subdivision", repeatable: true, mandatory: false, tips: ["Subdivisão cronológica relacionada com a ocupação."] },
                { code: "2", label: "Source", repeatable: false, mandatory: false, tips: ["Fonte controlada de onde o termo de ocupação foi retirado (ex: 'itoamc')."] },
                { code: "3", label: "Authority Record Identifier or Standard Number", repeatable: true, mandatory: false, tips: ["Identificador de registo de autoridade (se aplicável)."] },
                { code: "8", label: "Materials Specified", repeatable: false, mandatory: false, tips: ["Parte específica dos materiais descritos a que o campo se aplica."] }
            ]
        },
        {
            tag: "632",
            name: "FUNCTION",
            ind1Tips: ["# - Em branco (não definido)"],
            ind2Tips: ["# - Em branco (não definido)"],
            tips: [
                "Este campo contém um termo ou expressão usada para especificar a função, atividade ou processo organizacional de pessoas, famílias ou entidades corporativas que geraram os materiais descritos no registo.",
                "Relaciona-se com o campo 606 (Topical Name Used as Subject).",
                "A presença de $2 (source) é recomendada.",
                "Subcampos como $x, $y e $z permitem subdivisões tópicas, geográficas e cronológicas.",
                "Permite uso em contextos arquivísticos e de história institucional."
            ],
            subFieldDef: [
                { code: "a", label: "Function", repeatable: false, mandatory: true, tips: ["Termo que especifica a função ou atividade relacionada com a criação do recurso."] },
                { code: "j", label: "Form Subdivision", repeatable: true, mandatory: false, tips: ["Termo adicional que especifica o tipo ou género de material."] },
                { code: "x", label: "Topical Subdivision", repeatable: true, mandatory: false, tips: ["Subdivisão temática que qualifica ainda mais a função."] },
                { code: "y", label: "Geographical Subdivision", repeatable: true, mandatory: false, tips: ["Lugar associado à função descrita."] },
                { code: "z", label: "Chronological Subdivision", repeatable: true, mandatory: false, tips: ["Período de tempo em que a função foi exercida."] },
                { code: "2", label: "Source", repeatable: false, mandatory: false, tips: ["Código da fonte ou thesaurus de onde foi extraído o termo de função."] },
                { code: "3", label: "Authority Record Identifier or Standard Number", repeatable: true, mandatory: false, tips: ["Identificador do registo de autoridade associado ao ponto de acesso."] },
                { code: "8", label: "Materials Specified", repeatable: false, mandatory: false, tips: ["Parte dos materiais descritos a que o campo se aplica."] }
            ]
        },
        {
            tag: "660",
            name: "GEOGRAPHIC AREA CODE",
            ind1Tips: ["# - Em branco (não definido)"],
            ind2Tips: ["# - Em branco (não definido)"],
            tips: [
                "Este campo contém uma indicação da região geográfica coberta pela obra, em formato codificado.",
                "Os códigos devem seguir a 'MARC Code List for Geographic Areas' desenvolvida pela Library of Congress.",
                "Este campo é repetível para cada região geográfica indicada.",
                "Não substitui o campo 607 (Geographical Name Used as Subject), mas pode ser utilizado em complemento.",
                "O código contém sete caracteres alfabéticos minúsculos e/ou hífens, representando uma estrutura hierárquica geográfica ou política.",
                "Quando forem atribuídos múltiplos códigos, deve-se repetir o campo 660 para cada um."
            ],
            subFieldDef: [
                { code: "a", label: "Code", repeatable: false, mandatory: true, tips: ["Código da área geográfica conforme a lista MARC. Exemplo: 'n-us-md' para Maryland (EUA), 'e-fr---' para França."] }
            ]
        },
        {
            tag: "661",
            name: "TIME PERIOD CODE",
            ind1Tips: ["# - Em branco (não definido)"],
            ind2Tips: ["# - Em branco (não definido)"],
            tips: [
                "Este campo contém uma indicação codificada do(s) período(s) cronológico(s) abordado(s) na obra.",
                "Pode ser repetido quando a obra trata de múltiplos períodos distintos.",
                "Usa códigos de quatro caracteres alfanuméricos derivados do MARC 21, campo 045.",
                "Não deve ser utilizado para datas pré-históricas (ex.: eras geológicas).",
                "É diferente do campo 122, que pode fornecer maior detalhe sobre o período.",
                "A tabela de códigos está disponível em: https://www.loc.gov/marc/bibliographic/bd045.html"
            ],
            subFieldDef: [
                { code: "a", label: "Time Period Code", repeatable: false, mandatory: true, tips: ["Código alfanumérico de 4 caracteres que representa o período cronológico. Ex: 'x-x-' para o século XX, 'd6d6' para cerca de 300 A.C."] }
            ]
        },
        {
            tag: "670",
            name: "PRECIS",
            ind1Tips: ["# - Em branco (não definido)"],
            ind2Tips: ["# - Em branco (não definido)"],
            tips: [
                "Este campo contém dados de indexação de assunto construídos segundo o sistema PRECIS (Preserved Context Index System).",
                "Utilizado para gerar entradas automáticas em índices impressos e catálogos com base em regras computacionais.",
                "O conteúdo completo do pacote PRECIS é identificado por um Subject Indicator Number (SIN).",
                "Os termos devem incluir códigos de manipulação que orientam a geração de entradas.",
                "Campo especialmente útil em sistemas automatizados e estruturas antigas de catalogação."
            ],
            subFieldDef: [
                { code: "b", label: "Subject Indicator Number", repeatable: false, mandatory: false, tips: ["Número de identificação do pacote de assunto PRECIS. Deve terminar com dígito de controlo módulo 11."] },
                { code: "c", label: "String", repeatable: false, mandatory: false, tips: ["Sequência de termos de assunto com códigos de manipulação para entradas automáticas."] },
                { code: "e", label: "Reference Indicator Number", repeatable: true, mandatory: false, tips: ["Número que identifica a posição de um termo no thesaurus de origem. Pode ser usado para referências cruzadas."] },
                { code: "z", label: "Language of Terms", repeatable: false, mandatory: false, tips: ["Código ISO 639-2 de três caracteres da língua dos termos usados no campo $c."] }
            ]
        },
        {
            tag: "675",
            name: "UNIVERSAL DECIMAL CLASSIFICATION UDC",
            ind1Tips: ["# - Em branco (não definido)"],
            ind2Tips: ["# - Em branco (não definido)"],
            tips: [
                "Este campo contém um número de classificação atribuído ao recurso, de acordo com o esquema Universal Decimal Classification (UDC).",
                "Inclui também a indicação da edição e da língua da edição usada.",
                "Os códigos são derivados do Master Reference File da UDC Consortium.",
                "O campo é útil para classificação temática normalizada e intercâmbio internacional de registos."
            ],
            subFieldDef: [
                { code: "a", label: "Number", repeatable: false, mandatory: true, tips: ["Número de classificação tal como retirado dos quadros da UDC. Ex: '633.13-155(410)\"18\"'"] },
                { code: "v", label: "Edition", repeatable: false, mandatory: false, tips: ["Identificação da edição utilizada da UDC (ex: '4' para 4.ª edição)."] },
                { code: "z", label: "Language of Edition", repeatable: false, mandatory: false, tips: ["Código ISO 639-2 de três letras que indica o idioma da edição da UDC utilizada (ex: 'eng')."] },
                { code: "3", label: "Classification Record Number", repeatable: false, mandatory: false, tips: ["Identificador de registo de classificação, para uso com o formato UNIMARC/Classification."] }
            ]
        },
        {
            tag: "676",
            name: "DEWEY DECIMAL CLASSIFICATION",
            ind1Tips: ["# - Em branco (não definido)"],
            ind2Tips: ["# - Em branco (não definido)"],
            tips: [
                "Este campo contém um número de classificação atribuído ao recurso segundo o esquema Dewey Decimal Classification (DDC).",
                "O número deve ser transcrito tal como aparece nas tabelas da DDC, incluindo barras (/) para marcar pontos de truncamento.",
                "O subcampo $v especifica a edição da DDC utilizada.",
                "O subcampo $z é utilizado quando a edição traduzida da DDC difere da versão original.",
                "O subcampo $3 pode ser usado com um número de registo de classificação, como no UNIMARC/Classification."
            ],
            subFieldDef: [
                { code: "a", label: "Number", repeatable: false, mandatory: true, tips: ["Número conforme atribuído pela Dewey Decimal Classification. Ex.: '823.912' ou '944/.0252'."] },
                { code: "v", label: "Edition", repeatable: false, mandatory: false, tips: ["Número da edição da DDC usada, como '19' ou '13a' (abridged)."] },
                { code: "z", label: "Language of Edition", repeatable: false, mandatory: false, tips: ["Código ISO 639-2 da língua da edição da DDC utilizada (ex: 'fre' para francês)."] },
                { code: "3", label: "Classification Record Number", repeatable: false, mandatory: false, tips: ["Identificador do registo de classificação, usado com o UNIMARC/Classification."] }
            ]
        },
        {
            tag: "680",
            name: "LIBRARY OF CONGRESS CLASSIFICATION",
            ind1Tips: ["# - Em branco (não definido)"],
            ind2Tips: ["# - Em branco (não definido)"],
            tips: [
                "Este campo contém um número de classificação atribuído ao recurso de acordo com os esquemas da Library of Congress Classification (LCC).",
                "Inclui, opcionalmente, um número de livro (book number) que identifica de forma única o recurso na coleção da agência catalogadora.",
                "O número de classe provém dos esquemas da LCC publicados.",
                "Pode ser utilizado por qualquer agência que possua os esquemas da LCC, mesmo que não pertença à Library of Congress.",
                "Recomendado para integração com sistemas que utilizam LCC para ordenação física ou semântica de materiais."
            ],
            subFieldDef: [
                { code: "a", label: "Class Number", repeatable: false, mandatory: true, tips: ["Número de classe tal como definido pelos esquemas da Library of Congress Classification. Ex: 'PZ8.3.A6A6'."] },
                { code: "b", label: "Book Number", repeatable: false, mandatory: false, tips: ["Número de livro atribuído pela agência catalogadora para distinguir exemplares dentro de uma mesma classe."] },
                { code: "3", label: "Classification Record Number", repeatable: false, mandatory: false, tips: ["Identificador do registo de classificação para o ponto de acesso. Usado com o formato UNIMARC/Classification."] }
            ]
        },
        {
            tag: "686",
            name: "OTHER CLASS NUMBERS",
            ind1Tips: ["# - Em branco (não definido)"],
            ind2Tips: ["# - Em branco (não definido)"],
            tips: [
                "Este campo contém números de classe de sistemas de classificação que não são utilizados a nível internacional mas que são esquemas publicados amplamente conhecidos."
            ],
            subFieldDef: [
                { code: "a", label: "Class Number", repeatable: false, mandatory: true, tips: ["Número de classe tal como definido pelo esquema."] },
                { code: "b", label: "Book Number", repeatable: true, mandatory: false, tips: ["Número de livro atribuído pela agência catalogadora."] },
                { code: "c", label: "Classification Subdivision", repeatable: true, mandatory: false, tips: ["Uma subdivisão do número de classe obtido através do esquema de classificação."] },
                { code: "2", label: "Source", repeatable: false, mandatory: false, tips: ["Um código para o esquema de classificação."] },
                { code: "3", label: "Classification Record Number", repeatable: false, mandatory: false, tips: ["Identificador do registo de classificação para o ponto de acesso."] }
            ]
        },
        {
            tag: "700",
            name: "PERSONAL NAME - PRIMARY RESPONSABILITY",
            ind1Tips: ["# - Em branco (não definido)"],
            ind2Name: "Form of name indicator",
            ind2Tips: ["0 - Name entered under forename or direct order, 1 - Name entered under surname (family name, patronymic, etc.)"],
            tips: [
                "Este campo contém o nome da pessoa considerada como tendo a responsabilidade principal pelo trabalho, num formulário de ponto de acesso.",
                "O nome da pessoa neste campo indica que o registo foi criado de acordo com as regras de catalogação reconhecendo o conceito da entrada principal."
            ],
            subFieldDef: [
                { code: "a", label: "Entry Element", repeatable: false, mandatory: true, tips: ["Elemento principal do nome pessoal."] },
                { code: "b", label: "Part of Name Other than Entry Element", repeatable: false, mandatory: false, tips: ["Parte do nome que não é o elemento de entrada."] },
                { code: "c", label: "Additions to Names Other than Dates", repeatable: false, mandatory: false, tips: ["Adições ao nome que não sejam datas."] },
                { code: "d", label: "Roman Numerals", repeatable: false, mandatory: false, tips: ["Numerais romanos associados ao nome."] },
                { code: "f", label: "Dates", repeatable: false, mandatory: false, tips: ["Datas associadas ao nome (nascimento, morte, etc.)."] },
                { code: "g", label: "Expansion of Initials of Forename", repeatable: false, mandatory: false, tips: ["Expansão de iniciais do prenome."] },
                { code: "k", label: "Attribution Qualifier", repeatable: true, mandatory: false, tips: ["Qualificador de atribuição."] },
                { code: "o", label: "International Standard Identifier for the Name", repeatable: true, mandatory: false, tips: ["Identificador padrão internacional para o nome."] },
                { code: "p", label: "Affiliation/Address", repeatable: false, mandatory: false, tips: ["Afiliação ou endereço associado ao nome."] },
                { code: "2", label: "Source", repeatable: false, mandatory: false, tips: ["Fonte do nome pessoal."] },
                { code: "3", label: "Authority Record Identifier or Standard Number", repeatable: false, mandatory: false, tips: ["Identificador do registo de autoridade ou número padrão."] },
                { code: "4", label: "Relator Code", repeatable: true, mandatory: false, tips: ["Código de relator associado ao nome."] },
                { code: "8", label: "Materials Specified", repeatable: true, mandatory: false, tips: ["Materiais específicos associados ao nome."] }
            ]
        },
        {
            tag: "701",
            name: "PERSONAL NAME - ALTERNATE RESPONSABILITY",
            ind1Tips: ["# - Em branco (não definido)"],
            ind2Name: "Form of name indicator",
            ind2Tips: ["0 - Name entered under forename or direct order, 1 - Name entered under surname (family name, patronymic, etc.)"],
            tips: [
                "Este campo contém o nome de uma pessoa considerada como tendo responsabilidade alternativa pelo trabalho, no acesso forma de ponto."
            ],
            subFieldDef: [
                { code: "a", label: "Entry Element", repeatable: false, mandatory: true, tips: ["Elemento principal do nome pessoal com responsabilidade alternativa"] },
                { code: "b", label: "Part of Name Other than Entry Element", repeatable: false, mandatory: false, tips: ["Parte do nome que não é o elemento de entrada"] },
                { code: "c", label: "Additions to Names Other than Dates", repeatable: false, mandatory: false, tips: ["Informações adicionais ao nome que não sejam datas"] },
                { code: "d", label: "Roman Numerals", repeatable: false, mandatory: false, tips: ["Numerais romanos associados ao nome"] },
                { code: "f", label: "Dates", repeatable: false, mandatory: false, tips: ["Datas relevantes associadas ao nome (nascimento, morte, etc.)"] },
                { code: "g", label: "Expansion of Initials of Forename", repeatable: false, mandatory: false, tips: ["Expansão de iniciais do prenome quando aplicável"] },
                { code: "k", label: "Attribution Qualifier", repeatable: true, mandatory: false, tips: ["Qualificadores de atribuição do nome"] },
                { code: "o", label: "International Standard Identifier for the Name", repeatable: true, mandatory: false, tips: ["Identificador padrão internacional para o nome (ex: ISNI)"] },
                { code: "p", label: "Affiliation/Address", repeatable: false, mandatory: false, tips: ["Afiliação institucional ou endereço associado"] },
                { code: "2", label: "Source", repeatable: false, mandatory: false, tips: ["Fonte de autoridade utilizada para o nome"] },
                { code: "3", label: "Authority Record Identifier or Standard Number", repeatable: false, mandatory: false, tips: ["Identificador do registro de autoridade correspondente"] },
                { code: "4", label: "Relator Code", repeatable: true, mandatory: false, tips: ["Código que especifica a natureza da responsabilidade"] },
                { code: "8", label: "Materials Specified", repeatable: true, mandatory: false, tips: ["Identificação de materiais específicos a que se aplica"] }
            ]
        },
        {
            tag: "702",
            name: "PERSONAL NAME - SECONDARY RESPONSABILITY",
            ind1Tips: ["# - Em branco (não definido)"],
            ind2Name: "Form of name indicator",
            ind2Tips: ["0 - Name entered under forename or direct order, 1 - Name entered under surname (family name, patronymic, etc.)"],
            tips: [
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
            tag: "703",
            name: "PERSONAL NAME - PROVENANCE OF OWNERSHIP",
            ind1Tips: ["# - Em branco (não definido)"],
            ind2Name: "Form of name indicator",
            ind2Tips: ["0 - Name entered under forename or direct order, 1 - Name entered under surname (family name, patronymic, etc.)"],
            tips: [
                "Este campo contém o nome de uma pessoa em relação a qualquer tipo de origem e/ou propriedade (anterior propriedade ou custódia, autor da assinatura, dedicatória informal, notas, etc.), que se aplicam exclusivamente para o item, em formato de ponto de acesso."
            ],
            subFieldDef: [
                { code: "a", label: "Entry Element", repeatable: false, mandatory: true, tips: ["Elemento principal do nome pessoal associado à proveniência ou posse"] },
                { code: "b", label: "Part of Name Other than Entry Element", repeatable: false, mandatory: false, tips: ["Parte do nome que não é o elemento de entrada"] },
                { code: "c", label: "Additions to Names Other than Dates", repeatable: false, mandatory: false, tips: ["Informações adicionais ao nome que não sejam datas"] },
                { code: "d", label: "Roman Numerals", repeatable: false, mandatory: false, tips: ["Numerais romanos associados ao nome"] },
                { code: "f", label: "Dates", repeatable: false, mandatory: false, tips: ["Datas relevantes associadas ao nome (período de posse, etc.)"] },
                { code: "g", label: "Expansion of Initials of Forename", repeatable: false, mandatory: false, tips: ["Expansão de iniciais do prenome quando aplicável"] },
                { code: "k", label: "Attribution Qualifier", repeatable: true, mandatory: false, tips: ["Qualificadores de atribuição do nome"] },
                { code: "o", label: "International Standard Identifier for the Name", repeatable: true, mandatory: false, tips: ["Identificador padrão internacional para o nome (ex: ISNI)"] },
                { code: "p", label: "Affiliation/Address", repeatable: false, mandatory: false, tips: ["Afiliação institucional ou endereço associado"] },
                { code: "2", label: "Source", repeatable: false, mandatory: false, tips: ["Fonte de autoridade utilizada para o nome"] },
                { code: "3", label: "Authority Record Identifier or Standard Number", repeatable: false, mandatory: false, tips: ["Identificador do registro de autoridade correspondente"] },
                { code: "4", label: "Relator Code", repeatable: true, mandatory: false, tips: ["Código que especifica a natureza da relação de proveniência/posse"] },
                { code: "5", label: "Institution to which the Field Applies", repeatable: false, mandatory: false, tips: ["Instituição à qual o campo se aplica"] },
                { code: "8", label: "Materials Specified", repeatable: true, mandatory: false, tips: ["Identificação de materiais específicos a que se aplica"] }
            ]
        },
        {
            tag: "710",
            name: "CORPORATE BODY NAME - PRIMARY RESPONSABILITY",
            ind1Name: "Specifies the Kind of Name of a Body",
            ind1Tips: ["0 - Corporate name, 1 - Meeting name"],
            ind2Name: "Form of name indicator",
            ind2Tips: ["0 - Name in inverted form, 1 - Name entered under place or jurisdiction, 2 - Name entered under name in direct order"],
            tips: [
                "Este campo contém o nome da entidade jurídica considerada como tendo a responsabilidade principal pelo trabalho, em um formulário de ponto de acesso.",
                "O nome da entidade corporativa neste campo prevê que o registo seja criado de acordo com a catalogação regras que reconhecem o conceito de entrada principal."
            ],
            subFieldDef: [
                { code: "a", label: "Entry Element", repeatable: false, mandatory: true, tips: ["Elemento principal do nome da entidade coletiva"] },
                { code: "b", label: "Subdivision", repeatable: true, mandatory: false, tips: ["Subdivisão hierárquica da entidade coletiva"] },
                { code: "c", label: "Addition to Name or Qualifier", repeatable: true, mandatory: false, tips: ["Qualificadores ou adições ao nome da entidade"] },
                { code: "d", label: "Number of Meeting and/or Number of Part of Meeting", repeatable: false, mandatory: false, tips: ["Número da reunião ou parte da reunião"] },
                { code: "e", label: "Location of Meeting", repeatable: false, mandatory: false, tips: ["Localização da reunião"] },
                { code: "f", label: "Date of Meeting", repeatable: false, mandatory: false, tips: ["Data da reunião"] },
                { code: "g", label: "Inverted Element", repeatable: false, mandatory: false, tips: ["Elemento invertido do nome"] },
                { code: "h", label: "Part of Name Other than Entry Element and Inverted Element", repeatable: false, mandatory: false, tips: ["Parte do nome que não é o elemento de entrada nem o elemento invertido"] },
                { code: "o", label: "International Standard Identifier for the Name", repeatable: true, mandatory: false, tips: ["Identificador padrão internacional para o nome (ex: ISNI)"] },
                { code: "p", label: "Affiliation/Address", repeatable: false, mandatory: false, tips: ["Afiliação institucional ou endereço associado"] },
                { code: "2", label: "Source", repeatable: false, mandatory: false, tips: ["Fonte de autoridade utilizada para o nome"] },
                { code: "3", label: "Authority Record Identifier or Standard Number", repeatable: false, mandatory: false, tips: ["Identificador do registro de autoridade correspondente"] },
                { code: "4", label: "Relator Code", repeatable: true, mandatory: false, tips: ["Código que especifica a natureza da responsabilidade"] },
                { code: "8", label: "Materials Specified", repeatable: true, mandatory: false, tips: ["Identificação de materiais específicos a que se aplica"] }
            ]
        },
        {
            tag: "711",
            name: "CORPORATE BODY NAME - ALTERNATIVE RESPONSABILITY",
            ind1Name: "Specifies the Kind of Name of a Body",
            ind1Tips: ["0 - Corporate name, 1 - Meeting name"],
            ind2Name: "Form of name indicator",
            ind2Tips: ["0 - Name in inverted form, 1 - Name entered under place or jurisdiction, 2 - Name entered under name in direct order"],
            tips: [
                "Este campo contém o nome de uma entidade corporativa considerada como tendo responsabilidade alternativa pelo trabalho em formulário de ponto de acesso."
            ],
            subFieldDef: [
                { code: "a", label: "Entry Element", repeatable: false, mandatory: true, tips: ["Elemento principal do nome da entidade coletiva com responsabilidade alternativa"] },
                { code: "b", label: "Subdivision", repeatable: true, mandatory: false, tips: ["Subdivisão hierárquica da entidade coletiva"] },
                { code: "c", label: "Addition to Name or Qualifier", repeatable: true, mandatory: false, tips: ["Qualificadores ou adições ao nome da entidade"] },
                { code: "d", label: "Number of Meeting and/or Number of Part of Meeting", repeatable: false, mandatory: false, tips: ["Número da reunião ou parte da reunião"] },
                { code: "e", label: "Location of Meeting", repeatable: false, mandatory: false, tips: ["Localização da reunião"] },
                { code: "f", label: "Date of Meeting", repeatable: false, mandatory: false, tips: ["Data da reunião"] },
                { code: "g", label: "Inverted Element", repeatable: false, mandatory: false, tips: ["Elemento invertido do nome"] },
                { code: "h", label: "Part of Name Other than Entry Element and Inverted Element", repeatable: false, mandatory: false, tips: ["Parte do nome que não é o elemento de entrada nem o elemento invertido"] },
                { code: "o", label: "International Standard Identifier for the Name", repeatable: true, mandatory: false, tips: ["Identificador padrão internacional para o nome (ex: ISNI)"] },
                { code: "p", label: "Affiliation/Address", repeatable: false, mandatory: false, tips: ["Afiliação institucional ou endereço associado"] },
                { code: "2", label: "Source", repeatable: false, mandatory: false, tips: ["Fonte de autoridade utilizada para o nome"] },
                { code: "3", label: "Authority Record Identifier or Standard Number", repeatable: false, mandatory: false, tips: ["Identificador do registro de autoridade correspondente"] },
                { code: "4", label: "Relator Code", repeatable: true, mandatory: false, tips: ["Código que especifica a natureza da responsabilidade alternativa"] },
                { code: "8", label: "Materials Specified", repeatable: true, mandatory: false, tips: ["Identificação de materiais específicos a que se aplica"] }
            ]
        },
        {
            tag: "712",
            name: "CORPORATE BODY NAME - SECONDARY RESPONSABILITY",
            ind1Name: "Specifies the Kind of Name of a Body",
            ind1Tips: ["0 - Corporate name, 1 - Meeting name"],
            ind2Name: "Form of name indicator",
            ind2Tips: ["0 - Name in inverted form, 1 - Name entered under place or jurisdiction, 2 - Name entered under name in direct order"],
            tips: [
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
            tag: "713",
            name: "CORPORATE BODY NAME - PROVENANCE OF OWNERSHIP",
            ind1Name: "Specifies the Kind of Name of a Body",
            ind1Tips: ["0 - Corporate name, 1 - Meeting name"],
            ind2Name: "Form of name indicator",
            ind2Tips: ["0 - Name in inverted form, 1 - Name entered under place or jurisdiction, 2 - Name entered under name in direct order"],
            tips: [
                "Este campo contém o nome de uma entidade corporativa referente a qualquer tipo de proveniência e/ou propriedade (propriedade ou custódia anterior, autor da assinatura, dedicatória informal, notas, etc.), que aplicam exclusivamente ao item, sob a forma de ponto de acesso."
            ],
            subFieldDef: [
                { code: "a", label: "Entry Element", repeatable: false, mandatory: true, tips: ["Elemento principal do nome da entidade coletiva associada à proveniência ou posse"] },
                { code: "b", label: "Subdivision", repeatable: true, mandatory: false, tips: ["Subdivisão hierárquica da entidade coletiva"] },
                { code: "c", label: "Addition to Name or Qualifier", repeatable: true, mandatory: false, tips: ["Qualificadores ou adições ao nome da entidade"] },
                { code: "d", label: "Number of Meeting and/or Number of Part of Meeting", repeatable: false, mandatory: false, tips: ["Número da reunião ou parte da reunião"] },
                { code: "e", label: "Location of Meeting", repeatable: false, mandatory: false, tips: ["Localização da reunião"] },
                { code: "f", label: "Date of Meeting", repeatable: false, mandatory: false, tips: ["Data da reunião"] },
                { code: "g", label: "Inverted Element", repeatable: false, mandatory: false, tips: ["Elemento invertido do nome"] },
                { code: "h", label: "Part of Name Other than Entry Element and Inverted Element", repeatable: false, mandatory: false, tips: ["Parte do nome que não é o elemento de entrada nem o elemento invertido"] },
                { code: "o", label: "International Standard Identifier for the Name", repeatable: true, mandatory: false, tips: ["Identificador padrão internacional para o nome (ex: ISNI)"] },
                { code: "p", label: "Affiliation/Address", repeatable: false, mandatory: false, tips: ["Afiliação institucional ou endereço associado"] },
                { code: "2", label: "Source", repeatable: false, mandatory: false, tips: ["Fonte de autoridade utilizada para o nome"] },
                { code: "3", label: "Authority Record Identifier or Standard Number", repeatable: false, mandatory: false, tips: ["Identificador do registro de autoridade correspondente"] },
                { code: "4", label: "Relator Code", repeatable: true, mandatory: false, tips: ["Código que especifica a natureza da relação de proveniência/posse"] },
                { code: "5", label: "Institution to which the Field Applies", repeatable: false, mandatory: false, tips: ["Instituição à qual o campo se aplica"] },
                { code: "8", label: "Materials Specified", repeatable: true, mandatory: false, tips: ["Identificação de materiais específicos a que se aplica"] }
            ]
        },
        {
            tag: "714",
            name: "TRADEMARK",
            ind1Tips: ["# - Em branco (não definido)"],
            ind2Tips: ["# - Em branco (não definido)"],
            tips: [
                "Este campo contém o nome de uma entidade corporativa referente a qualquer tipo de proveniência e/ou propriedade (propriedade ou custódia anterior, autor da assinatura, dedicatória informal, notas, etc.), que aplicam exclusivamente ao item, sob a forma de ponto de acesso."
            ],
            subFieldDef: [
                { code: "a", label: "Data Element", repeatable: false, mandatory: true, tips: ["Elemento principal da marca registrada"] },
                { code: "f", label: "Dates", repeatable: false, mandatory: false, tips: ["Datas relevantes associadas à marca registrada"] },
                { code: "c", label: "Qualification", repeatable: true, mandatory: false, tips: ["Qualificadores adicionais para a marca registrada"] },
                { code: "3", label: "Authority Record Identifier or Standard Number", repeatable: false, mandatory: false, tips: ["Identificador do registro de autoridade correspondente"] }
            ]
        },
        {
            tag: "720",
            name: "FAMILY NAME - PRIMARY RESPONSABILITY",
            ind1Tips: ["# - Em branco (não definido)"],
            ind2Tips: ["# - Em branco (não definido)"],
            tips: [
                "Este campo contém o nome de uma família considerada como tendo responsabilidade principal pelo trabalho, no acesso forma de ponto.",
                "O nome da família neste campo prevê que o registo seja criado de acordo com as regras de catalogação reconhecendo o conceito da entrada principal."
            ],
            subFieldDef: [
                { code: "a", label: "Entry Element", repeatable: false, mandatory: true, tips: ["Nome da família em forma de ponto de acesso"] },
                { code: "c", label: "Type of Family", repeatable: false, mandatory: true, tips: ["Categoria ou tipo da família (ex: clã, dinastia)"] },
                { code: "d", label: "Places Associated with the Family", repeatable: true, mandatory: false, tips: ["Locais associados à família"] },
                { code: "f", label: "Dates", repeatable: false, mandatory: false, tips: ["Datas relevantes associadas à família"] },
                { code: "o", label: "International Standard Identifier for the Name", repeatable: true, mandatory: false, tips: ["Identificador padrão internacional para o nome"] },
                { code: "2", label: "Source", repeatable: false, mandatory: false, tips: ["Fonte de autoridade utilizada"] },
                { code: "3", label: "Authority Record Identifier or Standard Number", repeatable: false, mandatory: false, tips: ["Identificador do registro de autoridade"] },
                { code: "4", label: "Relator Code", repeatable: true, mandatory: false, tips: ["Código de relator para responsabilidade primária"] },
                { code: "8", label: "Materials Specified", repeatable: true, mandatory: false, tips: ["Materiais específicos a que se aplica"] }
            ]
        },
        {
            tag: "721",
            name: "FAMILY NAME - ALTERNATIVE RESPONSABILITY",
            ind1Tips: ["# - Em branco (não definido)"],
            ind2Tips: ["# - Em branco (não definido)"],
            tips: [
                "Este campo contém o nome de uma família considerada como tendo responsabilidade alternativa pelo trabalho, no acesso forma de ponto."
            ],
            subFieldDef: [
                { code: "a", label: "Entry Element", repeatable: false, mandatory: true, tips: ["Nome da família em forma de ponto de acesso com responsabilidade alternativa"] },
                { code: "c", label: "Type of Family", repeatable: false, mandatory: true, tips: ["Categoria ou tipo da família (ex: clã, dinastia)"] },
                { code: "d", label: "Places Associated with the Family", repeatable: true, mandatory: false, tips: ["Locais associados à família"] },
                { code: "f", label: "Dates", repeatable: false, mandatory: false, tips: ["Datas relevantes associadas à família"] },
                { code: "o", label: "International Standard Identifier for the Name", repeatable: true, mandatory: false, tips: ["Identificador padrão internacional para o nome"] },
                { code: "2", label: "Source", repeatable: false, mandatory: false, tips: ["Fonte de autoridade utilizada"] },
                { code: "3", label: "Authority Record Identifier or Standard Number", repeatable: false, mandatory: false, tips: ["Identificador do registro de autoridade"] },
                { code: "4", label: "Relator Code", repeatable: true, mandatory: false, tips: ["Código de relator para responsabilidade alternativa"] },
                { code: "8", label: "Materials Specified", repeatable: true, mandatory: false, tips: ["Materiais específicos a que se aplica"] }
            ]
        },
        {
            tag: "722",
            name: "FAMILY NAME - SECONDARY RESPONSABILITY",
            ind1Tips: ["# - Em branco (não definido)"],
            ind2Tips: ["# - Em branco (não definido)"],
            tips: [
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
            tag: "723",
            name: "FAMILY NAME - PROVENANCE OR OWNERSHIP",
            ind1Tips: ["# - Em branco (não definido)"],
            ind2Tips: ["# - Em branco (não definido)"],
            tips: [
                "Este campo contém o nome de uma família referente a qualquer tipo de origem e/ou propriedade (anterior propriedade ou custódia), que se aplicam exclusivamente ao item, sob a forma de ponto de acesso."
            ],
            subFieldDef: [
                { code: "a", label: "Entry Element", repeatable: false, mandatory: true, tips: ["Nome da família associada à proveniência ou posse"] },
                { code: "c", label: "Type of Family", repeatable: false, mandatory: true, tips: ["Tipo de família (ex: dinastia, clã)"] },
                { code: "d", label: "Places Associated with the Family", repeatable: true, mandatory: false, tips: ["Locais geográficos associados à família"] },
                { code: "f", label: "Dates", repeatable: false, mandatory: false, tips: ["Período temporal associado à família"] },
                { code: "o", label: "International Standard Identifier for the Name", repeatable: true, mandatory: false, tips: ["Identificador padrão internacional (ex: ISNI)"] },
                { code: "2", label: "Source", repeatable: false, mandatory: false, tips: ["Fonte de autoridade utilizada"] },
                { code: "3", label: "Authority Record Identifier or Standard Number", repeatable: false, mandatory: false, tips: ["Número de identificação do registro de autoridade"] },
                { code: "4", label: "Relator Code", repeatable: true, mandatory: false, tips: ["Código que especifica o tipo de relação"] },
                { code: "5", label: "Institution to which the Field Applies", repeatable: false, mandatory: false, tips: ["Instituição detentora dos materiais"] },
                { code: "8", label: "Materials Specified", repeatable: true, mandatory: false, tips: ["Identificação de materiais específicos"] }
            ]
        },
        {
            tag: "730",
            name: "NAME - ENTITY RESPONSIBLE",
            ind1Name: "Form of Name Indicator",
            ind1Tips: ["0 - Type of name cannot be determined, 1 - Personal name, 2 - Not a personal name"],
            ind2Tips: ["# - Em branco (não definido)"],
            tips: [
                "Este campo contém de forma não estruturada o nome de uma entidade considerada responsável por uma trabalhar.",
                "O nome não segue regras de catalogação. Este campo deve ser utilizado apenas quando outros 7 campos forem inadequado."
            ],
            subFieldDef: [
                { code: "a", label: "Entry Element", repeatable: false, mandatory: true, tips: ["Elemento principal do nome da entidade responsável"] },
                { code: "4", label: "Relator Code", repeatable: true, mandatory: false, tips: ["Código que especifica a natureza da responsabilidade"] }
            ]
        },
        {
            tag: "740",
            name: "UNIFORM CONVENTIONAL HEADING FOR LEGAL AND RELIGIOUS TEXTS - PRIMARY RESPONSIBILITY",
            ind1Tips: ["# - Em branco (não definido)"],
            ind2Name: "Form of Name Indicator",
            ind2Tips: ["1 - Name entered under country or other geographical name, 2 - Name entered under other form, e.g. a church or a simply conventional name"],
            tips: [
                "Este campo contém os títulos convencionais uniformes para textos jurídicos e religiosos de natureza prescritiva e para tratados e outros acordos entre duas ou mais partes, emitidos ao abrigo de uma determinada jurisdição, geralmente um país ou uma igreja, sob a forma de ponto de acesso."
            ],
            subFieldDef: [
                { code: "a", label: "Entry Element", repeatable: false, mandatory: true, tips: ["Elemento principal do cabeçalho uniforme convencional"] },
                { code: "b", label: "Subdivision", repeatable: true, mandatory: true, tips: ["Subdivisão hierárquica do cabeçalho"] },
                { code: "c", label: "Addition to Name or Qualifier", repeatable: true, mandatory: false, tips: ["Qualificadores ou adições ao nome"] },
                { code: "e", label: "Name of the Other Party", repeatable: false, mandatory: false, tips: ["Nome da outra parte envolvida"] },
                { code: "f", label: "Date of Legal Issue or Version, or Date of Signing", repeatable: true, mandatory: false, tips: ["Data de emissão, versão ou assinatura"] },
                { code: "i", label: "Name of Section or Part", repeatable: true, mandatory: false, tips: ["Nome da seção ou parte"] },
                { code: "l", label: "Form Subheading", repeatable: true, mandatory: false, tips: ["Subdivisão por forma"] },
                { code: "n", label: "Miscellaneous Information", repeatable: true, mandatory: false, tips: ["Informações diversas"] },
                { code: "t", label: "Uniform Title", repeatable: false, mandatory: false, tips: ["Título uniforme associado"] },
                { code: "3", label: "Authority Record Identifier or Standard Number", repeatable: false, mandatory: false, tips: ["Identificador do registro de autoridade"] }
            ]
        },
        {
            tag: "741",
            name: "UNIFORM CONVENTIONAL HEADING FOR LEGAL AND RELIGIOUS TEXTS - ALTERNATIVE RESPONSIBILITY",
            ind1Tips: ["# - Em branco (não definido)"],
            ind2Name: "Form of Name Indicator",
            ind2Tips: ["1 - Name entered under country or other geographical name, 2 - Name entered under other form, e.g. a church or a simply conventional name"],
            tips: [
                "Este campo contém os títulos convencionais uniformes para textos jurídicos e religiosos de natureza prescritiva e para tratados entre duas ou mais partes, considerados como tendo responsabilidade alternativa pelo trabalho, em formulário de ponto de acesso."
            ],
            subFieldDef: [
                { code: "a", label: "Entry Element", repeatable: false, mandatory: true, tips: ["Elemento principal do cabeçalho uniforme convencional com responsabilidade alternativa"] },
                { code: "b", label: "Subdivision", repeatable: true, mandatory: true, tips: ["Subdivisão hierárquica do cabeçalho"] },
                { code: "c", label: "Addition to Name or Qualifier", repeatable: true, mandatory: false, tips: ["Qualificadores ou adições ao nome"] },
                { code: "e", label: "Name of the Other Party", repeatable: false, mandatory: false, tips: ["Nome da outra parte envolvida"] },
                { code: "f", label: "Date of Legal Issue or Version, or Date of Signing", repeatable: true, mandatory: false, tips: ["Data de emissão, versão ou assinatura"] },
                { code: "i", label: "Name of Section or Part", repeatable: true, mandatory: false, tips: ["Nome da seção ou parte"] },
                { code: "l", label: "Form Subheading", repeatable: true, mandatory: false, tips: ["Subdivisão por forma"] },
                { code: "n", label: "Miscellaneous Information", repeatable: true, mandatory: false, tips: ["Informações diversas"] },
                { code: "t", label: "Uniform Title", repeatable: false, mandatory: false, tips: ["Título uniforme associado"] },
                { code: "3", label: "Authority Record Identifier or Standard Number", repeatable: false, mandatory: false, tips: ["Identificador do registro de autoridade"] }
            ]
        },
        {
            tag: "742",
            name: "UNIFORM CONVENTIONAL HEADING FOR LEGAL AND RELIGIOUS TEXTS - SECONDARY RESPONSIBILITY",
            ind1Tips: ["# - Em branco (não definido)"],
            ind2Name: "Form of Name Indicator",
            ind2Tips: ["1 - Name entered under country or other geographical name, 2 - Name entered under other form, e.g. a church or a simply conventional name"],
            tips: [
                "Este campo contém os títulos convencionais uniformes para textos jurídicos e religiosos de natureza prescritiva e para tratados entre duas ou mais partes, considerados como tendo responsabilidade secundária por uma obra em formulário de ponto de acesso."
            ],
            subFieldDef: [
                { code: "a", label: "Entry Element", repeatable: false, mandatory: true, tips: ["Elemento principal do cabeçalho uniforme convencional com responsabilidade secundária"] },
                { code: "b", label: "Subdivision", repeatable: true, mandatory: true, tips: ["Subdivisão hierárquica do cabeçalho"] },
                { code: "c", label: "Addition to Name or Qualifier", repeatable: true, mandatory: false, tips: ["Qualificadores ou adições ao nome"] },
                { code: "e", label: "Name of the Other Party", repeatable: false, mandatory: false, tips: ["Nome da outra parte envolvida"] },
                { code: "f", label: "Date of Legal Issue or Version, or Date of Signing", repeatable: true, mandatory: false, tips: ["Data de emissão, versão ou assinatura"] },
                { code: "i", label: "Name of Section or Part", repeatable: true, mandatory: false, tips: ["Nome da seção ou parte"] },
                { code: "l", label: "Form Subheading", repeatable: true, mandatory: false, tips: ["Subdivisão por forma"] },
                { code: "n", label: "Miscellaneous Information", repeatable: true, mandatory: false, tips: ["Informações diversas"] },
                { code: "t", label: "Uniform Title", repeatable: false, mandatory: false, tips: ["Título uniforme associado"] },
                { code: "3", label: "Authority Record Identifier or Standard Number", repeatable: false, mandatory: false, tips: ["Identificador do registro de autoridade"] }
            ]
        },
        {
            tag: "801",
            name: "ORIGINATING SOURCE",
            ind1Tips: ["# - Em branco (não definido)"],
            ind2Name: "Function Indicator",
            ind2Tips: ["0 - Original cataloguing agency, 1 - Transcribing agency, 2 - Modifying agency, 3 - Issuing agency"],
            tips: [
                "Este campo contém uma indicação da origem do registo, incluindo um dos seguintes: a agência que criou os dados, a agência que transcreveu os dados para um formato legível por máquina, qualquer agência que tenha modificou o registo/dados originais e a agência que emitiu o registo atual."
            ],
            subFieldDef: [
                { code: "a", label: "Country", repeatable: false, mandatory: true, tips: ["País de origem da catalogação"] },
                { code: "b", label: "Agency", repeatable: false, mandatory: true, tips: ["Agência responsável pela catalogação"] },
                { code: "c", label: "Date of Transaction", repeatable: false, mandatory: true, tips: ["Data da transação/catalogção"] },
                { code: "g", label: "Cataloguing Rules (Descriptive Conventions)", repeatable: true, mandatory: true, tips: ["Normas de catalogação utilizadas"] },
                { code: "h", label: "Original Record identifier", repeatable: false, mandatory: true, tips: ["Identificador do registro original"] },
                { code: "2", label: "Source", repeatable: false, mandatory: false, tips: ["Fonte alternativa de informação"] }
            ]
        },
        {
            tag: "802",
            name: "ISSN CENTRE",
            ind1Tips: ["# - Em branco (não definido)"],
            ind2Tips: ["# - Em branco (não definido)"],
            tips: [
                "Este campo contém um código para o Centro ISSN responsável pela atribuição do ISSN e do título-chave."
            ],
            subFieldDef: [
                { code: "a", label: "ISSN Centre Code", repeatable: false, mandatory: false, tips: ["Código do centro ISSN responsável"] }
            ]
        },
        {
            tag: "830",
            name: "GENERAL CATALOGUER'S NOTE",
            ind1Tips: ["# - Em branco (não definido)"],
            ind2Tips: ["# - Em branco (não definido)"],
            tips: [
                "Este campo é utilizado para registar informações biográficas, históricas ou outras sobre o registo."
            ],
            subFieldDef: [
                { code: "a", label: "Text of Note", repeatable: false, mandatory: false, tips: ["Texto da nota do catalogador"] }
            ]
        },
        {
            tag: "850",
            name: "HOLDING INSTITUTION",
            ind1Tips: ["# - Em branco (não definido)"],
            ind2Tips: ["# - Em branco (não definido)"],
            tips: [
                "Este campo contém uma lista dos códigos das instituições que detêm os artigos.",
                "O campo é repetível quando o sistema de catalogação impõe limites ao comprimento de um campo."
            ],
            subFieldDef: [
                { code: "a", label: "Code of Institution", repeatable: true, mandatory: false, tips: ["Código da instituição detentora do exemplar"] }]
        },
        {
            tag: "852",
            name: "LOCATION AND CALL NUMBER",
            ind1Name: "Shelving Scheme",
            ind1Tips: ["# - No information available, 0 - Classification scheme (specified in subfield $2), 1 - Fixed location, 2 - Sequential number, 3 - Author, title or author/ title, 4 - Parts shelved separately, 5 - Other"],
            ind2Name: "Shelving Order",
            ind2Tips: ["# - No information available, 0 - No enumeration, 1 - Primary enumeration, 2 - Alternative enumeration"],
            tips: [
                "Este campo é utilizado para identificar a organização que detém o artigo ou onde está disponível. Este campo pode também contém informações detalhadas sobre como localizar o item numa coleção."
            ],
            subFieldDef: [
                { code: "a", label: "Institution Identifier", repeatable: false, mandatory: true, tips: ["Identificador da instituição"] },
                { code: "b", label: "Sub-Location Identifier", repeatable: true, mandatory: false, tips: ["Identificador da sublocalização"] },
                { code: "c", label: "Address", repeatable: false, mandatory: false, tips: ["Endereço físico"] },
                { code: "d", label: "Coded Location Qualifier", repeatable: false, mandatory: false, tips: ["Qualificador de localização codificado"] },
                { code: "g", label: "Call Number Prefix", repeatable: false, mandatory: false, tips: ["Prefixo da cota"] },
                { code: "j", label: "Call Number", repeatable: false, mandatory: false, tips: ["Número de chamada/cota"] },
                { code: "k", label: "Shelving Form of Title, Author, Author/Title", repeatable: false, mandatory: false, tips: ["Forma de armazenamento"] },
                { code: "l", label: "Call Number Suffix", repeatable: false, mandatory: false, tips: ["Sufixo da cota"] },
                { code: "m", label: "Item Identifier", repeatable: false, mandatory: false, tips: ["Identificador do item"] },
                { code: "n", label: "Copy Identifier", repeatable: false, mandatory: false, tips: ["Identificador da cópia"] },
                { code: "p", label: "Country", repeatable: false, mandatory: false, tips: ["País da localização"] },
                { code: "t", label: "Copy Number", repeatable: false, mandatory: false, tips: ["Número da cópia"] },
                { code: "x", label: "Non-public Note", repeatable: true, mandatory: false, tips: ["Nota não pública"] },
                { code: "y", label: "Public Note", repeatable: true, mandatory: false, tips: ["Nota pública"] },
                { code: "2", label: "Source", repeatable: false, mandatory: false, tips: ["Fonte da informação"] }
            ]
        },
        {
            tag: "856",
            name: "ELECTRONIC LOCATION AND ACCESS",
            ind1Name: "Access Method",
            ind1Tips: ["# - No information available, 0 - Email, 1 - FTP, 2 - remote login (Telnet), 3 - Dial-up, 4 - HTTP, 5 - Method specified in subfield $y"],
            ind2Name: "Completeness of the Accessible Resource",
            ind2Tips: ["# - No information available, 0 - The field provides details to access the described resource, 1 - The field provides details to access a thumbnail of the described resource , 2 - The field provides details to access the title page, table of contents, and/or other front matter of the described resource"],
            tips: [
                "Este campo contém a informação necessária para localizar o recurso eletrónico descrito pelo registo e/ou ficheiros de referência relacionados com o recurso descrito, como miniaturas e páginas de conteúdo."
            ],
            subFieldDef: [
                { code: "a", label: "Host Name", repeatable: true, mandatory: false, tips: ["Nome do servidor ou host"] },
                { code: "b", label: "Access Number", repeatable: true, mandatory: false, tips: ["Número de acesso"] },
                { code: "c", label: "Compression Information", repeatable: true, mandatory: false, tips: ["Informações sobre compressão"] },
                { code: "d", label: "Path", repeatable: true, mandatory: false, tips: ["Caminho no sistema de arquivos"] },
                { code: "e", label: "Date and Hour of Consultation and Access", repeatable: false, mandatory: false, tips: ["Data e hora de consulta/acesso"] },
                { code: "f", label: "Electronic Name", repeatable: true, mandatory: false, tips: ["Nome eletrônico do arquivo"] },
                { code: "h", label: "Processor of Request", repeatable: false, mandatory: false, tips: ["Processador da requisição"] },
                { code: "i", label: "Instruction", repeatable: true, mandatory: false, tips: ["Instruções para acesso"] },
                { code: "j", label: "Bits per Second", repeatable: false, mandatory: false, tips: ["Velocidade de transmissão"] },
                { code: "k", label: "Password", repeatable: false, mandatory: false, tips: ["Senha de acesso"] },
                { code: "l", label: "Logon/Login", repeatable: false, mandatory: false, tips: ["Informações de login"] },
                { code: "m", label: "Contact for Access Assistance", repeatable: true, mandatory: false, tips: ["Contato para assistência"] },
                { code: "n", label: "Name of Location of Host in Subfield $a", repeatable: false, mandatory: false, tips: ["Nome da localização do host"] },
                { code: "o", label: "Operating System", repeatable: false, mandatory: false, tips: ["Sistema operacional requerido"] },
                { code: "p", label: "Port", repeatable: false, mandatory: false, tips: ["Porta de comunicação"] },
                { code: "q", label: "Electronic Format Type", repeatable: true, mandatory: false, tips: ["Tipo de formato eletrônico"] },
                { code: "r", label: "Settings", repeatable: true, mandatory: false, tips: ["Configurações especiais"] },
                { code: "s", label: "File Size", repeatable: true, mandatory: false, tips: ["Tamanho do arquivo"] },
                { code: "t", label: "Terminal Emulation", repeatable: false, mandatory: false, tips: ["Emulação de terminal requerida"] },
                { code: "u", label: "Uniform Resource Identifier (URI)", repeatable: false, mandatory: true, tips: ["URI para acesso ao recurso"] },
                { code: "v", label: "Hours Access Method Available", repeatable: true, mandatory: false, tips: ["Horários disponíveis para acesso"] },
                { code: "w", label: "Record Identifier", repeatable: true, mandatory: false, tips: ["Identificador do registro"] },
                { code: "x", label: "Non-Public Note", repeatable: true, mandatory: false, tips: ["Notas internas/não públicas"] },
                { code: "y", label: "Access Method", repeatable: false, mandatory: false, tips: ["Método de acesso"] },
                { code: "z", label: "Public Note", repeatable: true, mandatory: false, tips: ["Notas públicas"] },
                { code: "2", label: "Link Text", repeatable: true, mandatory: false, tips: ["Texto do link/descrição"] }
            ]
        },
        {
            tag: "857",
            name: "ELECTRONIC ARCHIVE LOCATION AND ACCESS",
            ind1Name: "Access Method",
            ind1Tips: ["# - No information available, 1 - FTP, 4 - HTTP, 7 - Method specified in subfield $p"],
            ind2Name: "Relationship",
            ind2Tips: ["# - No information provided, 0 - Resource, 1 - Version of resource , 2 - Related resource, 3 - Component part(s) of resource, 4 - Version of component part(s) of resource"],
            tips: [
                "Este campo é utilizado para informações necessárias para localizar e aceder a um recurso eletrónico armazenado num site, ficheiro ou repositório digital.",
                "Pode ser utilizado em adição ou em substituição do campo 856 se forem necessárias informações adicionais sobre os recursos arquivados."
            ],
            subFieldDef: [
                { code: "a", label: "Name of Archiving Agency", repeatable: false, mandatory: false, tips: ["Nome da agência responsável pelo arquivamento"] },
                { code: "c", label: "Name of Web Archive or Digital Archive Repository", repeatable: false, mandatory: false, tips: ["Nome do repositório de arquivo web ou digital"] },
                { code: "d", label: "Date Range of Archived Material", repeatable: false, mandatory: false, tips: ["Intervalo de datas do material arquivado"] },
                { code: "f", label: "Archive Completeness", repeatable: false, mandatory: false, tips: ["Indicador de completude do arquivo"] },
                { code: "g", label: "Persistent Identifier", repeatable: true, mandatory: true, tips: ["Identificador persistente do recurso arquivado"] },
                { code: "h", label: "Non-Functioning Uniform Resource Identifier", repeatable: true, mandatory: true, tips: ["URI que não está mais funcional"] },
                { code: "l", label: "Standardized Information Governing Access", repeatable: true, mandatory: false, tips: ["Informações padronizadas sobre acesso"] },
                { code: "m", label: "Contact for Access Assistance", repeatable: true, mandatory: false, tips: ["Contato para assistência de acesso"] },
                { code: "n", label: "Terms Governing Access", repeatable: true, mandatory: false, tips: ["Termos que regem o acesso"] },
                { code: "o", label: "Access Status", repeatable: false, mandatory: false, tips: ["Status atual de acesso"] },
                { code: "p", label: "Access Method", repeatable: false, mandatory: false, tips: ["Método de acesso ao material"] },
                { code: "q", label: "Electronic Format Type", repeatable: true, mandatory: false, tips: ["Tipo de formato eletrônico"] },
                { code: "r", label: "Standardized Information Governing Use and Reproduction", repeatable: true, mandatory: false, tips: ["Informações sobre uso e reprodução"] },
                { code: "s", label: "File Size", repeatable: true, mandatory: false, tips: ["Tamanho do arquivo"] },
                { code: "t", label: "Terms Governing Use and Reproduction", repeatable: true, mandatory: false, tips: ["Termos de uso e reprodução"] },
                { code: "u", label: "Uniform Resource Identifier (URI)", repeatable: true, mandatory: true, tips: ["URI para acesso ao recurso arquivado"] },
                { code: "x", label: "Nonpublic Note", repeatable: true, mandatory: false, tips: ["Notas internas/não públicas"] },
                { code: "y", label: "Link Text", repeatable: true, mandatory: false, tips: ["Texto descritivo do link"] },
                { code: "z", label: "Public Note", repeatable: true, mandatory: false, tips: ["Notas públicas"] },
                { code: "2", label: "Source", repeatable: false, mandatory: false, tips: ["Fonte da informação"] },
                { code: "5", label: "Institution to which the Field Applies", repeatable: false, mandatory: false, tips: ["Instituição à qual o campo se aplica"] },
                { code: "6", label: "Interfield Linking Data", repeatable: true, mandatory: false, tips: ["Dados de ligação entre campos"] },
                { code: "8", label: "Materials Specified", repeatable: true, mandatory: false, tips: ["Materiais específicos a que se aplica"] }
            ]
        },
        {
            tag: "886",
            name: "DATA NOT CONVERTED FROM SOURCE FORMAT",
            ind1Name: "Type of Field",
            ind1Tips: ["0 - Record label, 1 - Variable control field (0-- fields without indicators or subfields), 2 - Variable data field (010-999 fields)"],
            ind2Tips: ["Em branco (não definido)"],
            tips: [
                "Este campo contém dados para os quais não existe um campo UNIMARC específico. É utilizado quando uma agência é convertendo registos de outro formato e pretende manter elementos em campos que não têm equivalente."
            ],
            subFieldDef: [
                { code: "a", label: "Tag of the Source Format Field", repeatable: true, mandatory: false, tips: ["Tag do campo no formato de origem"] },
                { code: "b", label: "Indicators and Subfields of the Source Format Field", repeatable: true, mandatory: false, tips: ["Indicadores e subcampos do formato de origem"] },
                { code: "2", label: "Source", repeatable: false, mandatory: false, tips: ["Identificação do formato de origem"] }
            ]
        },
    ]

    await Promise.all(
        dataFieldDefinitionsData.map(def =>
            prisma.dataFieldDefinition.create({
                data: {
                    tag: def.tag ?? "",
                    name: def.name ?? "",
                    ind1Name: Array.isArray(def.ind1Name) ? def.ind1Name.join(", ") : def.ind1Name ?? "",
                    ind2Name: Array.isArray(def.ind2Name) ? def.ind2Name.join(", ") : def.ind2Name ?? "",
                    ind1Tips: def.ind1Tips,
                    ind2Tips: def.ind2Tips,
                    tips: def.tips,
                    subFieldDef: {
                        create: (def.subFieldDef ?? []).map(sub => ({
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
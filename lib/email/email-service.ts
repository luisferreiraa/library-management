import { Resend } from "resend"

// Inicializa o cliente Resend com a API key
// Em produção, usar variáveis de ambiente para armazenar a chave
const resend = new Resend(process.env.RESEND_API_KEY)

export type EmailData = {
    to: string
    subject: string
    html: string
    from?: string
}

export async function sendEmail({
    to,
    subject,
    html,
    from
}: EmailData) {
    const defaultFrom = "Biblio.Gest<noreply@omeudominio.com>"

    try {
        const { data, error } = await resend.emails.send({
            from: from || defaultFrom,
            to,
            subject,
            html,
        })

        if (error) {
            console.error("Erro ao enviar email:", error)
            return { success: false, error }
        }

        return { success: true, data }
    } catch (error) {
        console.error("Erro ao enviar email:", error)
        return { success: false, error }
    }
}
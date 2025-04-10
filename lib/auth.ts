// lib/auth.ts
import type { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"

export const authOptions: NextAuthOptions = {
    session: {
        strategy: "jwt",
    },
    pages: {
        signIn: "/login",
    },
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                username: { label: "Username", type: "text" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials) {
                if (!credentials?.username || !credentials?.password) {
                    return null
                }

                try {
                    const user = await prisma.user.findUnique({
                        where: {
                            username: credentials.username,
                        },
                        include: {
                            role: true,
                        },
                    })

                    if (!user) {
                        throw new Error("Utilizador não encontrado.")
                    }

                    // Verificar se o utilizador está activo
                    if (!user.isActive) {
                        throw new Error("Conta desativada. Por favor, contacte o administrador.")
                    }

                    const passwordMatch = await bcrypt.compare(credentials.password, user.password)

                    if (!passwordMatch) {
                        return null
                    }

                    // Atualizar o último login aqui, dentro do authorize
                    try {
                        await prisma.user.update({
                            where: { id: user.id },
                            data: { lastLogin: new Date() },
                        })
                        console.log("[NextAuth] Último login atualizado para:", user.id)
                    } catch (updateError) {
                        // Apenas registrar o erro, não impedir o login
                        console.error("[NextAuth] Erro ao atualizar último login:", updateError)
                    }

                    return {
                        id: user.id,
                        name: `${user.firstName} ${user.lastName}`,
                        email: user.email,
                        username: user.username,
                        role: user.role.name,
                        roleId: user.roleId,
                        image: user.profilePicture,
                    }
                } catch (error) {
                    console.error("Erro na autenticação:", error)
                    // Propagar a mensagem de erro para o cliente
                    if (error instanceof Error) {
                        throw new Error(error.message)
                    }
                    return null
                }
            },
        }),
    ],
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id
                token.username = user.username
                token.role = user.role
                token.roleId = user.roleId
            }
            return token
        },
        async session({ session, token }) {
            if (token) {
                session.user.id = token.id as string
                session.user.username = token.username as string
                session.user.role = token.role as string
                session.user.roleId = token.roleId as string
            }
            return session
        },
    },
    debug: process.env.NODE_ENV === "development",
}


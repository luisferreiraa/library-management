import type { DefaultSession } from "next-auth"

declare module "next-auth" {
    interface User {
        id: string
        username: string
        role: string
        roleId: string
        image?: string | null
    }

    interface Session {
        user: {
            id: string
            username: string
            role: string
            roleId: string
        } & DefaultSession["user"]
    }
}

declare module "next-auth/jwt" {
    interface JWT {
        id: string
        username: string
        role: string
        roleId: string
    }
}


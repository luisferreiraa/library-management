import bcrypt from "bcryptjs"

export async function hashPassword(password: string): Promise<string> {
    const saltRounds = 10
    const hashedPassword = await bcrypt.hash(password, saltRounds)
    return hashedPassword
}


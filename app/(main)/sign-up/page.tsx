import { RegisterForm } from "@/components/auth/register-form"

export default function SignupPage() {
    return (
        <div className="flex min-h-screen items-center justify-center">
            <div className="w-full max-w-md">
                <RegisterForm />
            </div>
        </div>
    )
}
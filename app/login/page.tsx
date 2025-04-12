import { LoginForm } from "@/components/auth/login-form"
import { Suspense } from 'react';


export default function LoginPage() {
    return (
        <div className="flex min-h-screen items-center justify-center">
            <div className="w-full max-w-md">
                <Suspense fallback={<div>A Carregar...</div>}>
                    <LoginForm />
                </Suspense>
            </div>
        </div>
    );
}


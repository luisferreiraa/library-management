import { NextResponse } from "next/server"
import { getToken } from "next-auth/jwt"
import type { NextRequest } from "next/server"

export async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl

    // Adicionar log para depuração
    console.log(`Middleware executando para: ${pathname}`)

    // Verificar se o usuário está autenticado
    const token = await getToken({
        req: request,
        secret: process.env.NEXTAUTH_SECRET,
    })

    // Adicionar log para depuração
    console.log("Token:", token)

    const isAuthenticated = !!token

    // Rotas públicas que não precisam de autenticação
    const publicRoutes = ["/login"]
    const isPublicRoute = publicRoutes.includes(pathname)

    // Rotas que exigem permissão de administrador
    const adminRoutes = [
        "/authors",
        "/books",
        "/book-status",
        "/borrowed-books",
        "/categories",
        "/formats",
        "/languages",
        "/logs",
        "/penalty-rules",
        "/publishers",
        "/roles",
        "/translators",
        "/users"
    ]
    const isAdminRoute = adminRoutes.some((route) => pathname.startsWith(route))

    // Redirecionar para login se não estiver autenticado e não for rota pública
    if (!isAuthenticated && !isPublicRoute) {
        console.log("Redirecionando para login: usuário não autenticado")
        return NextResponse.redirect(new URL("/login", request.url))
    }

    // Redirecionar para a página inicial se estiver autenticado e tentar acessar uma rota pública
    if (isAuthenticated && isPublicRoute) {
        console.log("Redirecionando para página inicial: usuário já autenticado")
        return NextResponse.redirect(new URL("/", request.url))
    }

    // Verificar permissões de administrador
    if (isAuthenticated && isAdminRoute && token.role?.toLowerCase() !== "admin") {
        console.log("Redirecionando para página não autorizada: usuário não é admin")
        return NextResponse.redirect(new URL("/unauthorized", request.url))
    }

    console.log("Middleware permitindo acesso")
    return NextResponse.next()
}

export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - api (API routes)
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         */
        "/((?!api|_next/static|_next/image|favicon.ico).*)",
    ],
}


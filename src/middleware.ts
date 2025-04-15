import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
    const token = request.cookies.get('token')?.value
    const path = request.nextUrl.pathname

    const isPublicPath = path === '/login' || path === '/signup' 

    if (isPublicPath && token) {
        return NextResponse.redirect(new URL('/', request.url))
    }

    if (!isPublicPath && !token) {
        return NextResponse.redirect(new URL('/login', request.url))
    }

    return NextResponse.next()
}

export const config = {
    matcher: [ '/login', '/signup',],
}

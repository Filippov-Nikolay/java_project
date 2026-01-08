import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function proxy(request: NextRequest) {
    const token = request.cookies.get('token')?.value;
    const role = request.cookies.get('userRole')?.value; 
    const { pathname } = request.nextUrl;

    if (!token && !pathname.startsWith('/auth')) {
        return NextResponse.redirect(new URL('/auth/login', request.url));
    }

    if (token && pathname.startsWith('/auth')) {

        const target = role === 'TEACHER' ? '/schedule' : '/dashboard';
        return NextResponse.redirect(new URL(target, request.url));
    }

    if (token && role) {

        if (role === 'STUDENT') {
            if (pathname.startsWith('/admin') || pathname.startsWith('/manage-homework')) {
                return NextResponse.redirect(new URL('/dashboard', request.url));
            }
        }

        if (role === 'TEACHER') {
            const isForbidden = 
                pathname === '/dashboard' || 
                pathname.startsWith('/homework') || 
                (pathname.startsWith('/admin') && !pathname.startsWith('/admin/journal'));
            
            if (isForbidden) {
                return NextResponse.redirect(new URL('/schedule', request.url));
            }
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'], //
};
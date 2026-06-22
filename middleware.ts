import { NextResponse, type NextRequest } from 'next/server'

// ponytail: auth bypassed for dev/demo — réactiver quand le flow login est finalisé
export function middleware(request: NextRequest) {
  return NextResponse.next({ request })
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}

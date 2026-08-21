import { NextResponse,NextRequest } from 'next/server'
 
export function proxy(request: NextRequest) {
  return NextResponse.redirect(new URL('/', request.url))
}
 
export const config = {
  matcher: ['/components/chatbubbles/:path*', '/components/chatpage/:path*'],
}
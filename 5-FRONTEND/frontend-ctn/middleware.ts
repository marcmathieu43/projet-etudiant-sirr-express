import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { v4 as uuidv4 } from 'uuid'


export function middleware(request: NextRequest) {
  const tokenName = 'user_token'
  

  const response = NextResponse.next()

  if (request.cookies.has(tokenName)) {
    
    return response
  }

  const uuid = uuidv4()
  
  

  response.cookies.set({
    name: tokenName,
    value: uuid,
    path: '/',
    maxAge: 60 * 60 * 24,
    httpOnly: true,     
    secure: false,       
    sameSite: 'lax',  
  })

  //----- pour les liens messages

  response.cookies.set({
    name: 'dernierMessageUser',
    value: "",
  })

  fetch('https://api.sirr.express/register-token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ token: uuid }),
  }).catch(err => {
    
  })
  
  return response
}


export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}

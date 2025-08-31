// app/api/messages/post-message/route.ts
import { cookies } from 'next/headers'

export async function POST(request: Request) {
  const cookieStore = await cookies()
  const token = cookieStore.get('user_token')?.value

  if (!token) {
    return new Response(JSON.stringify({ error: 'Token manquant' }), { status: 401 })
  }

  try {
    const body = await request.json()
    const { conversation_id, content, nonce, tag_element, created_at, lien } = body

    

    const res = await fetch('https://api.sirr.express/post-message', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        conversation_id: conversation_id,
        content: content,
        nonce: nonce,
        tag_element: tag_element,
        created_at: created_at,
        lien: token,
    })

    })

    const data = await res.json()
    
    return new Response(JSON.stringify(data), { status: 200 })

    } catch (err) {
      
        return new Response(JSON.stringify({ error: 'Erreur serveur distant' }), { status: 500 })
    }
  
}

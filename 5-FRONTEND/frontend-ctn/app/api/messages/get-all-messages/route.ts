import { cookies } from 'next/headers'

export async function POST(request: Request) {
  const cookieStore = await cookies()
  const token = cookieStore.get('user_token')?.value

  if (!token) {
    return new Response(JSON.stringify({ error: 'Token manquant' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  try {
    const body = await request.json()
    const { conversationId } = body

    const res = await fetch('https://api.sirr.express/get-all-messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        conversation_id: conversationId, 
      }),
    })

    if (!res.ok) {
      
      
      return new Response(JSON.stringify({ error: 'erreur' }), {
        status: res.status,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    let data
    try {
      data = await res.json()
    } catch (e) {
      const text = await res.text()
      
      return new Response(JSON.stringify({ error: 'réponse' }), {
        status: 502,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    return new Response(JSON.stringify(data), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    })
  } catch (err) {
    
    return new Response(JSON.stringify({ error: 'erreur' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }
}

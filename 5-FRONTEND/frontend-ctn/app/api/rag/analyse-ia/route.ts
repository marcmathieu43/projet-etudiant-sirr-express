
import { cookies } from 'next/headers'
import { Message } from '../../../conversation/[id]/types';

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
  const body = await request.json() as { conversationId: string; messages: Message[], question: string }

  const { conversationId, messages, question } = body

  const res = await fetch('https://api.sirr.express/rag/analyse-ia', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      conversationId,
      messages: messages.map(msg => ({
        id: msg.id,
        content: msg.content,
      })),
    }) 
  })

  const data = await res.json()
  
  return new Response(JSON.stringify(data), { status: 200 })

} catch (err) {
  console.error('[API] Erreur:', err)
  return new Response(JSON.stringify({ error: 'Erreur serveur distant' }), { status: 500 })
}

  
}
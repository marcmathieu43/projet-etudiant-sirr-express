import { cookies } from 'next/headers'

export async function POST(request: Request) {
  const cookieStore = await cookies()
  const token = cookieStore.get('user_token')?.value

  if (!token) {
    return new Response(JSON.stringify({ error: 'Token manquant' }), { status: 401 })
  }

  try {
    const body = await request.json()
    const { id } = body

    const res = await fetch('https://api.sirr.express/get-conversation', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        id: id,
      }),
    })

    const data = await res.json()
    return new Response(JSON.stringify(data), { status: 200 })
  } catch (err) {
    console.error('[API] Erreur:', err)
    return new Response(JSON.stringify({ error: 'Erreur serveur distant' }), { status: 500 })
  }
}

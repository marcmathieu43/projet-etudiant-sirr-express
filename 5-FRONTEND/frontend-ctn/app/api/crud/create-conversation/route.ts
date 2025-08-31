import { cookies } from 'next/headers'

export async function POST(request: Request) {
  const cookieStore = await cookies()
  const token = cookieStore.get('user_token')?.value

  if (!token) {
    return new Response(JSON.stringify({ error: 'token manquant' }), { status: 401 })
  }

  try {
    
    const { lifetime, views } = await request.json() as { lifetime?: number; views?: number }

    const res = await fetch('https://api.sirr.express/create-conversation', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        duree_vie: lifetime,
        nb_vues_message_default: views,
      }),
    })

    console.log('duree vie route.ts : ', lifetime)

    if (!res.ok) {
      const text = await res.text()
      console.error('réponse api ', res.status, text.slice(0, 200))
      return new Response(JSON.stringify({ error: 'pblm api', status: res.status }), { status: 500 })
    }

    const data = await res.json()
    return new Response(JSON.stringify(data), { status: 200 })
  } catch (err) {
    console.error('erreur api.sirr.express', err)
    return new Response(JSON.stringify({ error: 'erreur serveur distant' }), { status: 500 })
  }
}
import { cookies } from 'next/headers';

export async function POST(req: Request) {
  const { name, value } = await req.json();

  const cookieStore = await cookies();
  cookieStore.set({
    name,
    value,
    path: '/',
    httpOnly: false,   
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7,
  });

  return new Response(JSON.stringify({ ok: true }), { status: 200 });
}

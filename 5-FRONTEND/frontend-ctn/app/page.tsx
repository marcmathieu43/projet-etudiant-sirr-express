import { cookies, headers } from 'next/headers'
import PageAccueil from '../components/PageAccueil'

export default async function HomePage() {

  

  

  const headersList = await headers()
  const userAgent = headersList.get('user-agent') || ''
  const isMobile = /mobile|android|iphone|ipad/i.test(userAgent)

  

  const cookieStore = await cookies()
  const token = cookieStore.get('user_token')?.value ?? null

  return isMobile
    ? <PageAccueil />
    : <PageAccueil />

}

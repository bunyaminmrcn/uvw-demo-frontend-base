'use server'

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

export async function logout() {
  // Remove the token from cookies
  const cookieStore = await cookies()
  cookieStore.delete('token')
  // Redirect to the login page
  redirect('/auth/login')
}

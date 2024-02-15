import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import * as stytch from 'stytch';

export const client = new stytch.B2BClient({
  project_id: process.env.STYTCH_PROJECT_ID || '',
  secret: process.env.STYTCH_SECRET || '',
});
export async function authenticate() {
  try {
    const cookieStore = cookies();
    const jwt = cookieStore.get('stytch_session_jwt')?.value || '';
    const { organization, member } = await client.sessions.authenticate({
      session_jwt: jwt,
    });

    return { organization, member, jwt };
  } catch (err) {
    redirect('/login');
  }
}

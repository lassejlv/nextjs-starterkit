import { auth } from '@/actions/auth';
import { redirect } from 'next/navigation';
import UpdateUser from '@/components/UpdateUser';
import React from 'react'

export default async function Page() {

  const session = await auth();
  if (!session.success || !session.data) return redirect(`/login?next=/app`);
  if (!session.data.emailVerified) return redirect("/app/verify-email");

  return (
      <UpdateUser
        name={session.data.name}
        avatar={session.data.avatar}
        email={session.data.email as string}
      />
  )
}

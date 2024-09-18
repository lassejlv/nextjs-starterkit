import { auth } from "@/actions/auth";
import { redirect } from "next/navigation";
import React from "react";

export default async function Page() {
  const session = await auth();
  if (!session.success || !session.data) return redirect(`/login?next=/app`);
  if (!session.data.emailVerified) return redirect("/app/verify-email");

  return (
    <div>
      <pre>{JSON.stringify(session.data, null, 2)}</pre>
    </div>
  );
}

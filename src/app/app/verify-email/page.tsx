import { auth } from "@/actions/auth";
import { db } from "@/db";
import { emailVerify } from "@/db/schemas/emailVerify";
import { redirect } from "next/navigation";
import React from "react";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY as string);

export default async function Page() {
  const session = await auth();
  // prettier-ignore
  if (!session.success || !session.data) return redirect(`/login?next=/app/verify-email`);
  if (session.data.emailVerified) return redirect("/app");

  const newEmailVerify = await db
    .insert(emailVerify)
    .values({
      userId: session.data.id,
    })
    .returning();

  const { error } = await resend.emails.send({
    from: `Next Starter <${process.env.RESEND_FROM}>`,
    to: [session.data.email as string],
    subject: "Verify Your Email",
    html: `Click here to verify: ${process.env.HOST}/app/verify-email/${newEmailVerify[0].token}`,
  });

  if (error)
    return (
      <div>
        <span className="font-bold">Error:</span> {error.message}
      </div>
    );

  return (
    <div>
      <h1 className="text-3xl font-semibold">Verify Email</h1>
      <p>
        An email has been sent to {session.data.email}. Click the link in the
        email to verify your email address.
      </p>
    </div>
  );
}

import { auth } from "@/actions/auth";
import { db } from "@/db";
import { emailVerify } from "@/db/schemas/emailVerify";
import { userTable } from "@/db/schemas/user";
import { and, eq } from "drizzle-orm";
import { NextRequest } from "next/server";

export const GET = async (
  req: NextRequest,
  { params }: { params: { id: string } },
) => {
  const session = await auth();

  console.log(session);

  if (!session.success || !session.data)
    return Response.redirect(new URL("/login", req.url).toString());

  try {
    const emailVerifyData = await db.query.emailVerify.findFirst({
      where: and(
        eq(emailVerify.token, params.id),
        eq(emailVerify.userId, session.data.id),
      ),
    });

    if (!emailVerifyData) throw new Error("Invalid token");

    // Check if the token is older than 10 minutes
    const now = new Date();
    const expire = new Date(emailVerifyData.expireAt);

    if (now > expire) throw new Error("Token expired");

    await db
      .update(userTable)
      .set({ emailVerified: true })
      .where(eq(userTable.id, session.data.id));
    await db.delete(emailVerify).where(eq(emailVerify.id, emailVerifyData.id));

    return Response.json({ success: true, message: "Email verified" });
  } catch (error: any) {
    return Response.json({ success: false, message: error.message });
  }
};

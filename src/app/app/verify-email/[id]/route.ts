import { db } from "@/db";
import { emailVerify } from "@/db/schemas/emailVerify";
import { userTable } from "@/db/schemas/user";
import { and, eq } from "drizzle-orm";
import { NextRequest } from "next/server";

export const GET = async ( req: NextRequest,{ params }: { params: { id: string } },) => {
  try {
    const emailVerifyData = await db.query.emailVerify.findFirst({
      where: and(eq(emailVerify.token, params.id)),
  
    });

    if (!emailVerifyData) throw new Error("Invalid token");

    // Update the user
    await db.update(userTable).set({ emailVerified: true }).where(eq(userTable.id, emailVerifyData.userId));
   
    await db.delete(emailVerify).where(eq(emailVerify.id, emailVerifyData.id));

    return Response.redirect(new URL("/app", req.url).toString());
  } catch (error: any) {
    return Response.json({ success: false, message: error.message });
  }
};

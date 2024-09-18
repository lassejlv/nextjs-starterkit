import { auth } from "@/actions/auth";
import { db } from "@/db";
import { userTable } from "@/db/schemas/user";
import { eq } from "drizzle-orm";
import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UploadThingError, UTApi } from "uploadthing/server";

const f = createUploadthing();
const api = new UTApi();

export const ourFileRouter: FileRouter = {
  avatarUploader: f({ image: { maxFileSize: "4MB", maxFileCount: 1 } })
    .middleware(async () => {
      const session = await auth();

      if (!session.success || !session.data)
        throw new UploadThingError(session.message);

      return { userId: session.data.id, currentAvatar: session.data.avatar };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      console.log("Upload complete for user ", metadata.userId);

      // Example user img url https://utfs.io/f/:id
      // But we will only provide the id (key)
      if (metadata.currentAvatar) {
        api.deleteFiles(`${metadata.currentAvatar.split("https://utfs.io/f/")[1]}`);
        console.log(`Deleted old avatar for user ${metadata.userId}`);
        
      }

      await db.update(userTable)
        .set({ avatar: file.url })
        .where(eq(userTable.id, metadata.userId));

      return { success: true };
    }),
};


export type OurFileRouter = typeof ourFileRouter;
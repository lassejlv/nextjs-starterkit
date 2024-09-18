"use client";

import React from "react";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import {  UploadDropzone } from "@/lib/uploadthing";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Updateuser } from "@/actions/user";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "./ui/button";

interface Props {
  name: string | null;
  avatar: string | null;
  email: string;
}

export default function UpdateUser({ name, avatar, email }: Props) {
  const router = useRouter();

  return (
    <form className="flex flex-col gap-5">
      <div className="flex flex-col gap-2">
        <Label htmlFor="name">Name</Label>
        <Input
          type="text"
          name="name"
          id="name"
          defaultValue={name ?? ""}
          onBlur={(e) => {
            const { value } = e.target;

            const promise = new Promise(async (res, rej) => {
              if (!value) rej("Name cannot be empty");
              if (value === name) rej("Name is the same");

              const updated = await Updateuser({ name: value });

              if (!updated.success) rej(updated.message);
              res(updated);
            });

            toast.promise(promise, {
              loading: "Sav",
              success: "Name updated successfully",
              error: (err) => err,
            });
          }}
        />
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="email">Email</Label>
        <Input
          type="email"
          name="email"
          id="email"
          defaultValue={email}
          disabled
        />
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="avatar">Avatar</Label>
        <img
          src={avatar ?? `https://www.gravatar.com/avatar/${email}`}
          alt="avatar"
          className="h-20 w-20 rounded-full"
        />

        <Dialog>
          <DialogTrigger asChild>
            <Button>Change Avatar</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>New Avatar</DialogTitle>
              <DialogDescription asChild>
                <UploadDropzone
                  endpoint="avatarUploader"
                  onClientUploadComplete={() => {
                    toast.success("Avatar uploaded successfully");
                    router.refresh();
                  }}
                  onUploadError={(error) => {
                    toast.error(error.message);
                  }}
                />
              </DialogDescription>
            </DialogHeader>
          </DialogContent>
        </Dialog>
      </div>
    </form>
  );
}

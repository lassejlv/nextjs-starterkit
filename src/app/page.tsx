"use client";

import { getUsersCount } from "@/actions/userCount";
import { useQuery } from "@tanstack/react-query";

export default function Page() {
  const response = useQuery({
    queryKey: ["users"],

    queryFn: async () => {
      return getUsersCount();
    },
  });

  return (
    <main className="flex h-screen select-none flex-col items-center justify-center">
      <h1 className="bg-gradient-to-r from-indigo-500 to-blue-500 bg-clip-text text-4xl font-bold text-transparent">
        Next.js Starterkit
      </h1>

      <p className="mt-4 text-center text-lg text-zinc-500">
        A nice starting point for next.js projects. This template includes:
        Typescript, Tailwind CSS & Drizzle ORM.
      </p>

      <span className="mt-4 text-center text-lg text-zinc-500">
        There are a total of {response.isLoading ? "0" : response.data?.data}{" "}
        users in the database. <br />
        <span className="text-sm italic">
          (iknow we just can render this as a server component. but wanna show
          that react query works :D)
        </span>
      </span>
    </main>
  );
}

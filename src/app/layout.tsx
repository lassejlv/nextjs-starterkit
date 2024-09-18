import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import { ReactQueryProvider } from "./provider";
import { Toaster } from "sonner";
import "@uploadthing/react/styles.css";
import "./globals.css";

const fonts = Poppins({ weight: "400", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Next.js Starterkit",
  description:
    "A starterkit for Next.js with TypeScript, Tailwind CSS, and React Query.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className="dark">
      <body className={`${fonts.className} container mx-auto py-12`}>
        <ReactQueryProvider>
          <Toaster theme="dark" richColors duration={1400}/>
          {children}
        </ReactQueryProvider>
      </body>
    </html>
  );
}

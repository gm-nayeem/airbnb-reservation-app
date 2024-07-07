import { Nunito } from "next/font/google";

import "./globals.css";
import Navbar from "@/components/navbar/Navbar";
import ClientOnly from "@/components/clint-only";
import getCurrentUser from "@/actions/getCurrentUser";

import ModalsProvider from "@/providers/modal-provider";
import ToasterProvider from "@/providers/toaster-provider";

export const metadata = {
  title: "Airbnb Reservation App",
  description: "Airbnb Reservation Application",
};

const font = Nunito({
  subsets: ["latin"],
});

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const currentUser = await getCurrentUser();

  return (
    <html lang="en">
      <body className={font.className}>
        <ClientOnly>
          <ToasterProvider />
          <ModalsProvider />
          <Navbar currentUser={currentUser} />
        </ClientOnly>
        <div className="pb-20 pt-28">{children}</div>
      </body>
    </html>
  );
}

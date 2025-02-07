import "../globals.css";
import { Geist } from "next/font/google";

const geistSans = Geist({
  display: "swap",
  subsets: ["latin"],
});

export default async function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={geistSans.className} suppressHydrationWarning>
      <body className="bg-background text-foreground">
            {children}
      </body>
    </html>
  );
}

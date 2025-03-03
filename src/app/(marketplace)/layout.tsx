import { Geist } from "next/font/google";
import { ThemeProvider } from "next-themes";
import "../globals.css";
import Navbar from "@/components/navbar";
import StripeProvider from "@/providers/stripeProvider";

const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3000";

export const metadata = {
  metadataBase: new URL(defaultUrl),
  title: "API Marketplace | Nlpbay",
  description: "The fastest way to build apps with APIs",
};

const geistSans = Geist({
  display: "swap",
  subsets: ["latin"],
});
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={geistSans.className} suppressHydrationWarning>
      <body className="bg-background text-foreground">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        > 
            <main className="min-h-screen">
              <Navbar />
              <StripeProvider>
                {children}
              </StripeProvider>
            </main>
        </ThemeProvider>
      </body>
    </html>
  );
}

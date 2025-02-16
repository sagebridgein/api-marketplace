import { Geist } from "next/font/google";
import { ThemeProvider } from "next-themes";
import "../globals.css";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { BuyerDashboardSidebar } from "@/components/buyer-dashboard/sidebar";

const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3000";

export const metadata = {
  metadataBase: new URL(defaultUrl),
  title: "Dashboard | Nlpbay",
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
          <SidebarProvider>
            <BuyerDashboardSidebar />
            <main className="flex flex-1 flex-col gap-4 p-4">
              <SidebarTrigger />
              {children}
            </main>
          </SidebarProvider>

        </ThemeProvider>
      </body>
    </html>
  );
}

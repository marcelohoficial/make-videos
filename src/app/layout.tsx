import { Toaster } from "@/components/ui/toaster";
import "./globals.css";

export const metadata = {
  title: "Make vídeos",
  description: "Make vídeos with AI",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt">
      <body>
        {children}
        <Toaster />
      </body>
    </html>
  );
}

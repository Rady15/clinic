import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import DirProvider from "@/components/DirProvider";
import AuthProvider from "@/components/AuthProvider";

export const metadata: Metadata = {
  title: "العيادة التاسعة | مركز طبي متخصص",
  description: "مركز العيادة التاسعة الطبي - خدمات الجلدية والتجميل والأسنان والليزر والتخسيس والعلاج الطبيعي",
  icons: {
    icon: "https://store.clinic9sa.com/wp-content/uploads/2025/07/cropped-clinic9-2048x602-1-180x180.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Cairo:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet" />
      </head>
      <body className="antialiased bg-white text-[#333333] font-sans">
        <AuthProvider>
          <DirProvider>
            {children}
            <Toaster />
          </DirProvider>
        </AuthProvider>
      </body>
    </html>
  );
}

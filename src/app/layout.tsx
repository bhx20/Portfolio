import type { Metadata } from "next";
import { Open_Sans } from "next/font/google";
import "@/styles/globals.css";
/* ── Centralized Responsive Breakpoints ── */
import "@/styles/breakpoints/desktop-4k.css";
import "@/styles/breakpoints/desktop-large.css";
import "@/styles/breakpoints/laptop.css";
import "@/styles/breakpoints/tablet.css";
import "@/styles/breakpoints/mobile.css";
import "@/styles/breakpoints/mobile-small.css";
import { AppProvider } from "@/components/shared/providers/AppProvider";
import { db } from "@/lib/firebase";
import { doc, getDoc, collection, getDocs } from "firebase/firestore";

const openSans = Open_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  variable: "--font-open-sans",
});

export async function generateMetadata(): Promise<Metadata> {
  const heroDoc = await getDoc(doc(db, "portfolio", "hero"));
  const hero = heroDoc.data() || {};

  return {
    title: `${hero.name} ${hero.surname} | Portfolio` || "Portfolio",
    description: hero.tag || "Digital Architect Portfolio",
    themeColor: "#000000",
  };
}

export const revalidate = 60; // SSR Revalidation

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const initialData: any = {};
  try {
    const querySnapshot = await getDocs(collection(db, "portfolio"));
    querySnapshot.forEach((doc) => {
      initialData[doc.id] = doc.data();
    });
  } catch (error) {
    console.error("Failed to fetch SSR data:", error);
  }

  return (
    <html lang="en" className={openSans.variable} style={{ colorScheme: 'dark' }} suppressHydrationWarning>
      <body className="antialiased" suppressHydrationWarning>
        <AppProvider initialData={initialData}>
          {children}
        </AppProvider>
      </body>
    </html>
  );
}

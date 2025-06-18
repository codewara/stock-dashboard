import type { Metadata } from "next";
import "@/app/globals.css";

export const metadata: Metadata = {
  title: "Stock Dashboard",
  description: "Monitor stocks and view charts with real-time data.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className="bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200 font-sans antialiasedz">
        { children }
      </body>
    </html>
  );
}

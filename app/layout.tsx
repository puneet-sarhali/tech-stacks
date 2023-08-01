import "./globals.css";
import { Inter } from "next/font/google";

const roboto = Inter({
  weight: ["400", "700"],
  subsets: ["latin"],
});

export const metadata = {
  title: "TechStacks: A Tree visualization of popular open source projects",
  description:
    "Explore, Compare, and Visualize categorized GitHub Repositories ordered by stars.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="bg-neutral-50">
      <body className={roboto.className}>{children}</body>
    </html>
  );
}

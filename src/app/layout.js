import Navbar from "/src/components/Navbar";
import "./globals.css";

export const metadata = {
  icons: {
    icon: "/logo.jpg",
    apple: "/logo.jpg",
  },
  viewport: {
    width: "device-width",
    initialScale: 1,
    minimumscale: 1,
    maximumScale: 1,
    viewportfit: "cover",
  },
};

export default function RootLayout({ children }) {

  return (
    <html lang="en">
      <body className="flex flex-col items-center text-white bg-black">
        {children}
        <Navbar/>
      </body>
    </html>
  );
}
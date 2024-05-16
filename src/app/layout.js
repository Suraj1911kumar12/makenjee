import { Inter } from "next/font/google";
import "./globals.css";
import SnackbarProvider from "./SnackbarProvider";
// import UserloginWrapper from "./context/Userlogin";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Mykanjee",
  description: "Multiple  Accessories",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      {/* <UserloginWrapper> */}
      <SnackbarProvider>
        <body className={inter.className}>{children}</body>
      </SnackbarProvider>
      {/* </UserloginWrapper> */}
    </html>
  );
}

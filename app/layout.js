import "./globals.css";
import { AuthContextProvider } from "./daily-quest/_utils/auth-context";

export const metadata = {
  title: "Solo Quest Tracker",
  description: "Inspired by Solo Leveling",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <AuthContextProvider>{children}</AuthContextProvider>
      </body>
    </html>
  );
}

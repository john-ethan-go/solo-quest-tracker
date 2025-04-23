import "./globals.css";
import { AuthContextProvider } from "./daily-quest/_utils/auth-context";

 
export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <AuthContextProvider>
          {children}
        </AuthContextProvider>
      </body>
    </html>
  );
}
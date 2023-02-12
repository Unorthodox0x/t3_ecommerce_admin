import "../styles/globals.css";
import "tailwindcss/tailwind.css"
import { trpc } from '@/utils/trpc';
import { NavBar } from "@/components/index";
import { AuthContextProvider } from "@/context/AuthContext";
//@types
import type { AppProps } from 'next/app'

function MyApp({ Component, pageProps }: AppProps) {
    return (
        <div className="h-full min-h-screen bg-purple-800">
            <AuthContextProvider>
              <NavBar />
              <Component {...pageProps} />
            </AuthContextProvider>
      </div>
    );
}

export default trpc.withTRPC(MyApp);
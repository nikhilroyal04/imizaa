import "@/styles/globals.css";
import { AuthProvider } from "@/context/AuthContext";
import dynamic from 'next/dynamic';
import Footer from "@/components/Footer";

// Import Navbar with SSR disabled to prevent hydration issues
const Navbar = dynamic(() => import('@/components/Navbar'), { ssr: false });

export default function App({ Component, pageProps }) {
  return (
    <AuthProvider>
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow pt-16">
          <Component {...pageProps} />
        </main>
        <Footer />
      </div>
    </AuthProvider>
  );
}

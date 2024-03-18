import "@/styles/globals.css";
import "@/styles/Home.module.css";
import { QueryClientProvider } from "@tanstack/react-query";
import queryClient from "@/configs/query";

export default function App({ Component, pageProps }) {
  
  return (
    <QueryClientProvider client={queryClient}>
      <div>
        <Component {...pageProps} />
      </div>
    </QueryClientProvider>
  );
}

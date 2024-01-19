import { ThemeProvider } from "@/components/theme-provider";
import Navbar from "./components/Navbar";
import Home from "./components/home";
import { createContext, useEffect, useState } from "react";
import { Toaster } from "./components/ui/toaster";
import getCookie from "./utils/getCookie";
import Footer from "./components/Footer";

let globalToken: string | any = createContext("");
// let ENDPOINT = "https://prohub-server.azurewebsites.net";
let ENDPOINT = "http://localhost:8080";

function App() {
  const [token, settoken] = useState("");
  const getToken = getCookie("token");

  useEffect(() => {
    settoken(getToken);
  }, [getToken]);

  <globalToken.Provider value={token}></globalToken.Provider>;

  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <Toaster />
      <Navbar />
      <Home />
      <Footer />
    </ThemeProvider>
  );
}

export default App;
export { globalToken, ENDPOINT };

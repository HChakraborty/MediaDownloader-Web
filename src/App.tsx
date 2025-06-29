import "./App.css";
import HomePage from "./pages/home-page/home-page";

import { BrowserRouter as Router } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import favicon from "./assets/icons/open-image-logo.png";
import { useEffect } from "react";

const queryClient = new QueryClient();

const App = () => {
  useEffect(() => {
    const link = document.createElement("link");
    link.rel = "icon";
    link.type = "image/svg+xml";
    link.href = favicon;
    document.head.appendChild(link);

    return () => {
      if (link.parentNode === document.head) {
        document.head.removeChild(link);
      }
    };
  }, []);

  return (
    <>
      <QueryClientProvider client={queryClient}>
        <Router>
          <HomePage />
        </Router>
      </QueryClientProvider>
    </>
  );
};

export default App;

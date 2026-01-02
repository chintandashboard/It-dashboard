import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { HashRouter , Routes, Route } from "react-router-dom";
import { WasteDataProvider } from "@/context/WasteDataContext";
import Index from "./pages/Index";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <WasteDataProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <HashRouter >
          <Routes>
            <Route path="/" element={<Index />} />
          </Routes>
        </HashRouter >
      </TooltipProvider>
    </WasteDataProvider>
  </QueryClientProvider>
);

export default App;

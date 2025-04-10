
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import LendingPage from "./pages/LendingPage";
import LiveStrategiesPage from "./pages/LiveStrategiesPage";
import NotFound from "./pages/NotFound";
import { useState } from "react";
import { WalletData } from "./components/WalletConnect";

const queryClient = new QueryClient();

const App = () => {
  const [walletData, setWalletData] = useState<WalletData | null>(null);

  const handleWalletConnect = (data: WalletData) => {
    setWalletData(data);
  };

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route 
              path="/lending" 
              element={
                <LendingPage 
                  walletData={walletData} 
                  onWalletConnect={handleWalletConnect}
                />
              } 
            />
            <Route 
              path="/strategies" 
              element={
                <LiveStrategiesPage 
                  walletData={walletData} 
                  onWalletConnect={handleWalletConnect}
                />
              } 
            />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;

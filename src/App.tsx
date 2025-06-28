
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import SearchPage from "./pages/Search";
import MapPage from "./pages/Map";
import BusinessLogin from "./pages/BusinessLogin";
import BusinessSignup from "./pages/BusinessSignup";
import BusinessDashboard from "./pages/BusinessDashboard";
import NotFound from "./pages/NotFound";

console.log("App component is loading");

const queryClient = new QueryClient();

const App = () => {
  console.log("App component is rendering");
  
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/search" element={<SearchPage />} />
            <Route path="/map" element={<MapPage />} />
            <Route path="/business-login" element={<BusinessLogin />} />
            <Route path="/business-signup" element={<BusinessSignup />} />
            <Route path="/business-dashboard" element={<BusinessDashboard />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;

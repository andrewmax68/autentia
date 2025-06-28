
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Search from "./pages/Search";
import Map from "./pages/Map";
import BusinessSignup from "./pages/BusinessSignup";
import BusinessLogin from "./pages/BusinessLogin";
import BusinessDashboard from "./pages/BusinessDashboard";
import ProducerPage from "./pages/ProducerPage";
import ProducerWidget from "./pages/ProducerWidget";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/search" element={<Search />} />
          <Route path="/map" element={<Map />} />
          <Route path="/business-signup" element={<BusinessSignup />} />
          <Route path="/business-login" element={<BusinessLogin />} />
          <Route path="/business-dashboard" element={<BusinessDashboard />} />
          <Route path="/produttore/:slug" element={<ProducerPage />} />
          <Route path="/widget/:slug" element={<ProducerWidget />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

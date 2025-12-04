import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import SupplierList from "./pages/SupplierList";
import SupplierDeepDive from "./pages/SupplierDeepDive";
import SiteDashboard from "./pages/SiteDashboard";
import PredictiveInsights from "./pages/PredictiveInsights";
import Scorecards from "./pages/Scorecards";
import AIAssistant from "./pages/AIAssistant";
import Settings from "./pages/Settings";
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
          <Route path="/suppliers" element={<SupplierList />} />
          <Route path="/suppliers/:supplierId" element={<SupplierDeepDive />} />
          <Route path="/sites" element={<SiteDashboard />} />
          <Route path="/predictions" element={<PredictiveInsights />} />
          <Route path="/scorecards" element={<Scorecards />} />
          <Route path="/ai-assistant" element={<AIAssistant />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Dashboard from "./pages/Dashboard";
import Companies from "./pages/Companies";
import CompanyDetail from "./pages/CompanyDetail";
import Condominiums from "./pages/Condominiums";
import CondominiumDetail from "./pages/CondominiumDetail";
import Units from "./pages/Units";
import Owners from "./pages/Owners";
import Expenses from "./pages/Expenses";
import Payments from "./pages/Payments";
import NotFound from "./pages/NotFound";

import CondominiumLayout from "@/layouts/CondominiumLayout";
import { CondominiumProvider } from "@/context/CondominiumContext";
const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />



      {/* Wrap everything in CondominiumProvider */}
      <CondominiumProvider>
        <BrowserRouter>
          <Routes>
            {/* Dashboard */}
            <Route path="/" element={<Dashboard />} />

            {/* Companies */}
            <Route path="/companies" element={<Companies />} />
            <Route path="/companies/:id" element={<CompanyDetail />} />

            {/* Condominiums list */}
            <Route path="/condominiums" element={<Condominiums />} />

            {/* Condominium scoped routes */}
            <Route path="/condominiums/:id" element={<CondominiumLayout />}>
              <Route index element={<CondominiumDetail />} />
              <Route path="units" element={<Units />} />
              <Route path="owners" element={<Owners />} />
              <Route path="expenses" element={<Expenses />} />
              <Route path="payments" element={<Payments />} />
            </Route>

            {/* Fallback */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </CondominiumProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

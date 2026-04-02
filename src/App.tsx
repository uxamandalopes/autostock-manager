import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import AppLayout from "./layouts/AppLayout";
import Ocorrencias from "./pages/Ocorrencias";
import AnaliseDanos from "./pages/AnaliseDanos";
import Funilaria from "./pages/Funilaria";
import Revisao from "./pages/Revisao";
import CadastroPiloto from "./pages/CadastroPiloto";
import CadastroVeiculo from "./pages/CadastroVeiculo";
import CadastroPecas from "./pages/CadastroPecas";
import CadastroServicos from "./pages/CadastroServicos";
import NovaOcorrencia from "./pages/NovaOcorrencia";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<AppLayout />}>
            <Route index element={<Navigate to="/ocorrencias" replace />} />
            <Route path="ocorrencias" element={<Ocorrencias />} />
            <Route path="analise-danos" element={<AnaliseDanos />} />
            <Route path="cronogramas/funilaria" element={<Funilaria />} />
            <Route path="cronogramas/revisao" element={<Revisao />} />
            <Route path="admin/cadastro-piloto" element={<CadastroPiloto />} />
            <Route path="admin/cadastro-veiculo" element={<CadastroVeiculo />} />
            <Route path="admin/cadastro-pecas" element={<CadastroPecas />} />
            <Route path="admin/cadastro-servicos" element={<CadastroServicos />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

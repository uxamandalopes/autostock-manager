import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { CalendarIcon, ArrowLeft, Plus, Minus, Trash2 } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import catalogoImg from "@/assets/catalogo-pecas.png";

interface CatalogPart {
  id: number;
  name: string;
  partNumber: string;
}

interface SelectedPart extends CatalogPart {
  quantity: number;
}

// Parts mapped to the numbered diagram (1-26)
const catalogParts: CatalogPart[] = [
  { id: 1, name: "Para-choque Dianteiro Completo", partNumber: "PCH-001" },
  { id: 2, name: "Suporte Farol de Neblina", partNumber: "SFN-002" },
  { id: 3, name: "Parafuso de Fixação", partNumber: "PFX-003" },
  { id: 4, name: "Bucha de Fixação", partNumber: "BCH-004" },
  { id: 5, name: "Grade Inferior Esquerda", partNumber: "GIE-005" },
  { id: 6, name: "Defletor Inferior", partNumber: "DFI-006" },
  { id: 7, name: "Grade Superior", partNumber: "GSP-007" },
  { id: 8, name: "Moldura Superior", partNumber: "MLS-008" },
  { id: 9, name: "Friso Para-choque", partNumber: "FPC-009" },
  { id: 10, name: "Grade Lateral Direita", partNumber: "GLD-010" },
  { id: 11, name: "Defletor Lateral", partNumber: "DFL-011" },
  { id: 12, name: "Caixa de Ar", partNumber: "CXA-012" },
  { id: 13, name: "Suporte Lateral Direito", partNumber: "SLD-013" },
  { id: 14, name: "Moldura Farol Direito", partNumber: "MFD-014" },
  { id: 15, name: "Suporte Inferior Direito", partNumber: "SID-015" },
  { id: 16, name: "Presilha de Fixação", partNumber: "PRF-016" },
  { id: 17, name: "Saia Lateral Esquerda", partNumber: "SLE-017" },
  { id: 18, name: "Protetor Inferior Central", partNumber: "PIC-018" },
  { id: 19, name: "Suporte Inferior Esquerdo", partNumber: "SIE-019" },
  { id: 20, name: "Acabamento Inferior", partNumber: "ABI-020" },
  { id: 21, name: "Saia Lateral Direita", partNumber: "SLD-021" },
  { id: 22, name: "Reforço Superior", partNumber: "RFS-022" },
  { id: 23, name: "Suporte de Reforço", partNumber: "SRF-023" },
  { id: 24, name: "Presilha Superior", partNumber: "PRS-024" },
  { id: 25, name: "Grampo de Fixação", partNumber: "GFX-025" },
  { id: 26, name: "Suporte Lateral Inferior", partNumber: "SLI-026" },
];

// Hotspot positions (% based) mapped to each numbered circle in the image
const hotspots: { id: number; x: number; y: number }[] = [
  { id: 1, x: 5, y: 50 },
  { id: 2, x: 22, y: 42 },
  { id: 3, x: 24, y: 47 },
  { id: 4, x: 27, y: 40 },
  { id: 5, x: 18, y: 35 },
  { id: 6, x: 40, y: 80 },
  { id: 7, x: 20, y: 24 },
  { id: 8, x: 22, y: 16 },
  { id: 9, x: 16, y: 30 },
  { id: 10, x: 52, y: 42 },
  { id: 11, x: 42, y: 52 },
  { id: 12, x: 72, y: 18 },
  { id: 13, x: 68, y: 28 },
  { id: 14, x: 62, y: 32 },
  { id: 15, x: 78, y: 55 },
  { id: 16, x: 80, y: 48 },
  { id: 17, x: 12, y: 88 },
  { id: 18, x: 48, y: 90 },
  { id: 19, x: 60, y: 88 },
  { id: 20, x: 72, y: 90 },
  { id: 21, x: 82, y: 85 },
  { id: 22, x: 42, y: 5 },
  { id: 23, x: 52, y: 10 },
  { id: 24, x: 55, y: 14 },
  { id: 25, x: 85, y: 40 },
  { id: 26, x: 88, y: 48 },
];

const etapas = ["TREINO OPCIONAL 1", "TREINO OPCIONAL 2", "QUALIFICAÇÃO", "CORRIDA 1", "CORRIDA 2"];
const sessoes = ["MANHÃ", "TARDE", "NOITE"];
const ocorrenciasOptions = ["COLISÃO", "SAÍDA DE PISTA", "FALHA MECÂNICA", "INCIDENTE EM BOX", "OUTRO"];

const NovaOcorrencia = () => {
  const navigate = useNavigate();
  const [date, setDate] = useState<Date>(new Date());
  const [chassi, setChassi] = useState("");
  const [piloto, setPiloto] = useState("");
  const [etapa, setEtapa] = useState("");
  const [sessao, setSessao] = useState("");
  const [ocorrencia, setOcorrencia] = useState("");
  const [nomeAnalista, setNomeAnalista] = useState("");
  const [selectedParts, setSelectedParts] = useState<SelectedPart[]>([]);

  const addPart = (id: number) => {
    const part = catalogParts.find((p) => p.id === id);
    if (!part) return;
    setSelectedParts((prev) => {
      const existing = prev.find((p) => p.id === id);
      if (existing) {
        return prev.map((p) => (p.id === id ? { ...p, quantity: p.quantity + 1 } : p));
      }
      return [...prev, { ...part, quantity: 1 }];
    });
  };

  const updateQuantity = (id: number, delta: number) => {
    setSelectedParts((prev) =>
      prev
        .map((p) => (p.id === id ? { ...p, quantity: Math.max(0, p.quantity + delta) } : p))
        .filter((p) => p.quantity > 0)
    );
  };

  const removePart = (id: number) => {
    setSelectedParts((prev) => prev.filter((p) => p.id !== id));
  };

  const handleSubmit = () => {
    if (!chassi || !piloto || !etapa || !sessao || !ocorrencia || !nomeAnalista) {
      toast.error("Preencha todos os campos obrigatórios.");
      return;
    }
    if (selectedParts.length === 0) {
      toast.error("Selecione pelo menos uma peça do catálogo.");
      return;
    }
    toast.success("Solicitação de estoque enviada com sucesso!");
    navigate("/ocorrencias");
  };

  return (
    <div className="p-8">
      <div className="flex items-center gap-3 mb-6">
        <Button variant="ghost" size="icon" onClick={() => navigate("/ocorrencias")}>
          <ArrowLeft />
        </Button>
        <h1 className="text-3xl font-bold text-foreground">Nova Ocorrência</h1>
      </div>

      {/* Form Fields */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="space-y-2">
          <Label>Data do Incidente</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn("w-full justify-start text-left font-normal", !date && "text-muted-foreground")}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {date ? format(date, "dd/MM/yyyy", { locale: ptBR }) : "Selecione a data"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={date}
                onSelect={(d) => d && setDate(d)}
                initialFocus
                className="p-3 pointer-events-auto"
              />
            </PopoverContent>
          </Popover>
        </div>

        <div className="space-y-2">
          <Label>Chassi</Label>
          <Input placeholder="Ex: 123/II" value={chassi} onChange={(e) => setChassi(e.target.value)} />
        </div>

        <div className="space-y-2">
          <Label>Piloto</Label>
          <Input placeholder="Nome do piloto" value={piloto} onChange={(e) => setPiloto(e.target.value)} />
        </div>

        <div className="space-y-2">
          <Label>Etapa</Label>
          <Select value={etapa} onValueChange={setEtapa}>
            <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
            <SelectContent>
              {etapas.map((e) => <SelectItem key={e} value={e}>{e}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Sessão</Label>
          <Select value={sessao} onValueChange={setSessao}>
            <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
            <SelectContent>
              {sessoes.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Ocorrência</Label>
          <Select value={ocorrencia} onValueChange={setOcorrencia}>
            <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
            <SelectContent>
              {ocorrenciasOptions.map((o) => <SelectItem key={o} value={o}>{o}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Nome Analista</Label>
          <Input placeholder="Nome do analista" value={nomeAnalista} onChange={(e) => setNomeAnalista(e.target.value)} />
        </div>
      </div>

      {/* Catalog Image + Selected Parts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Interactive Image Catalog */}
        <div>
          <h2 className="text-xl font-semibold mb-4 text-foreground">Catálogo de Peças</h2>
          <p className="text-sm text-muted-foreground mb-3">
            Clique nos números da imagem para adicionar peças à lista.
          </p>
          <div className="relative inline-block w-full border rounded-lg overflow-hidden bg-white">
            <img
              src={catalogoImg}
              alt="Catálogo de peças - diagrama explodido"
              className="w-full h-auto"
              draggable={false}
            />
            {/* Clickable hotspots */}
            {hotspots.map((spot) => {
              const isSelected = selectedParts.some((p) => p.id === spot.id);
              const part = catalogParts.find((p) => p.id === spot.id);
              return (
                <button
                  key={spot.id}
                  onClick={() => addPart(spot.id)}
                  title={part ? `${spot.id} - ${part.name} (${part.partNumber})` : `Peça ${spot.id}`}
                  className={cn(
                    "absolute w-7 h-7 -translate-x-1/2 -translate-y-1/2 rounded-full flex items-center justify-center text-[10px] font-bold transition-all cursor-pointer border-2 hover:scale-125 z-10",
                    isSelected
                      ? "bg-primary text-primary-foreground border-primary shadow-lg scale-110"
                      : "bg-white/90 text-foreground border-muted-foreground/40 hover:border-primary hover:bg-primary/10"
                  )}
                  style={{ left: `${spot.x}%`, top: `${spot.y}%` }}
                >
                  {spot.id}
                </button>
              );
            })}
          </div>
        </div>

        {/* Selected Parts Table */}
        <div>
          <h2 className="text-xl font-semibold mb-4 text-foreground">
            Peças Selecionadas ({selectedParts.length})
          </h2>
          {selectedParts.length === 0 ? (
            <div className="rounded-lg border border-dashed p-8 text-center text-muted-foreground">
              Clique nos números do catálogo para adicionar peças aqui.
            </div>
          ) : (
            <div className="rounded-lg border overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-[#010101] hover:bg-[#010101]">
                    <TableHead className="text-white font-semibold">Peça</TableHead>
                    <TableHead className="text-white font-semibold">Part Number</TableHead>
                    <TableHead className="text-white font-semibold text-center">Qtd</TableHead>
                    <TableHead className="text-white font-semibold text-center">Ação</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {selectedParts.map((part) => (
                    <TableRow key={part.id}>
                      <TableCell className="font-medium">{part.name}</TableCell>
                      <TableCell className="font-mono text-sm">{part.partNumber}</TableCell>
                      <TableCell>
                        <div className="flex items-center justify-center gap-2">
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-7 w-7"
                            onClick={() => updateQuantity(part.id, -1)}
                          >
                            <Minus className="h-3 w-3" />
                          </Button>
                          <span className="w-8 text-center font-semibold">{part.quantity}</span>
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-7 w-7"
                            onClick={() => updateQuantity(part.id, 1)}
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                        </div>
                      </TableCell>
                      <TableCell className="text-center">
                        <button
                          className="text-muted-foreground hover:text-destructive transition-colors"
                          onClick={() => removePart(part.id)}
                        >
                          <Trash2 size={16} />
                        </button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <div className="p-4 border-t">
                <Button className="w-full" onClick={handleSubmit}>
                  Solicitar Estoque
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NovaOcorrencia;

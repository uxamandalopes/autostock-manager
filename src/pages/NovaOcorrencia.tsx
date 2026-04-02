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

interface CatalogPart {
  id: number;
  name: string;
  partNumber: string;
  category: string;
}

interface SelectedPart extends CatalogPart {
  quantity: number;
}

const catalogParts: CatalogPart[] = [
  { id: 1, name: "Para-choque Dianteiro", partNumber: "PCH-D001", category: "Carroceria" },
  { id: 2, name: "Para-choque Traseiro", partNumber: "PCH-T002", category: "Carroceria" },
  { id: 3, name: "Capô", partNumber: "CPO-003", category: "Carroceria" },
  { id: 4, name: "Para-lama Esquerdo", partNumber: "PLM-E004", category: "Carroceria" },
  { id: 5, name: "Para-lama Direito", partNumber: "PLM-D005", category: "Carroceria" },
  { id: 6, name: "Porta Dianteira Esquerda", partNumber: "PRT-DE006", category: "Carroceria" },
  { id: 7, name: "Porta Dianteira Direita", partNumber: "PRT-DD007", category: "Carroceria" },
  { id: 8, name: "Porta Traseira Esquerda", partNumber: "PRT-TE008", category: "Carroceria" },
  { id: 9, name: "Porta Traseira Direita", partNumber: "PRT-TD009", category: "Carroceria" },
  { id: 10, name: "Retrovisor Esquerdo", partNumber: "RTV-E010", category: "Acessórios" },
  { id: 11, name: "Retrovisor Direito", partNumber: "RTV-D011", category: "Acessórios" },
  { id: 12, name: "Farol Esquerdo", partNumber: "FRL-E012", category: "Iluminação" },
  { id: 13, name: "Farol Direito", partNumber: "FRL-D013", category: "Iluminação" },
  { id: 14, name: "Lanterna Esquerda", partNumber: "LNT-E014", category: "Iluminação" },
  { id: 15, name: "Lanterna Direita", partNumber: "LNT-D015", category: "Iluminação" },
  { id: 16, name: "Vidro Parabrisa", partNumber: "VDR-P016", category: "Vidros" },
  { id: 17, name: "Vidro Traseiro", partNumber: "VDR-T017", category: "Vidros" },
  { id: 18, name: "Radiador", partNumber: "RAD-018", category: "Motor" },
  { id: 19, name: "Disco de Freio Dianteiro", partNumber: "FRE-D019", category: "Freios" },
  { id: 20, name: "Disco de Freio Traseiro", partNumber: "FRE-T020", category: "Freios" },
];

const etapas = ["TREINO OPCIONAL 1", "TREINO OPCIONAL 2", "QUALIFICAÇÃO", "CORRIDA 1", "CORRIDA 2"];
const sessoes = ["MANHÃ", "TARDE", "NOITE"];
const ocorrencias = ["COLISÃO", "SAÍDA DE PISTA", "FALHA MECÂNICA", "INCIDENTE EM BOX", "OUTRO"];

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

  const addPart = (part: CatalogPart) => {
    setSelectedParts((prev) => {
      const existing = prev.find((p) => p.id === part.id);
      if (existing) {
        return prev.map((p) => (p.id === part.id ? { ...p, quantity: p.quantity + 1 } : p));
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

  const categories = [...new Set(catalogParts.map((p) => p.category))];

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
              {ocorrencias.map((o) => <SelectItem key={o} value={o}>{o}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Nome Analista</Label>
          <Input placeholder="Nome do analista" value={nomeAnalista} onChange={(e) => setNomeAnalista(e.target.value)} />
        </div>
      </div>

      {/* Catalog + Selected Parts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Parts Catalog */}
        <div>
          <h2 className="text-xl font-semibold mb-4 text-foreground">Catálogo de Peças</h2>
          <div className="space-y-4">
            {categories.map((cat) => (
              <div key={cat}>
                <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-2">{cat}</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {catalogParts
                    .filter((p) => p.category === cat)
                    .map((part) => {
                      const isSelected = selectedParts.some((sp) => sp.id === part.id);
                      return (
                        <button
                          key={part.id}
                          onClick={() => addPart(part)}
                          className={cn(
                            "relative rounded-lg border p-3 text-left text-sm transition-all hover:shadow-md cursor-pointer",
                            isSelected
                              ? "border-primary bg-primary/10 ring-1 ring-primary"
                              : "border-border bg-card hover:border-primary/50"
                          )}
                        >
                          <span className="absolute top-1 right-2 text-xs font-mono text-muted-foreground">
                            {part.partNumber}
                          </span>
                          <span className="font-medium text-foreground block mt-3">{part.name}</span>
                          {isSelected && (
                            <span className="text-xs text-primary font-semibold mt-1 block">
                              ✓ Adicionada ({selectedParts.find((sp) => sp.id === part.id)?.quantity})
                            </span>
                          )}
                        </button>
                      );
                    })}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Selected Parts Table */}
        <div>
          <h2 className="text-xl font-semibold mb-4 text-foreground">
            Peças Selecionadas ({selectedParts.length})
          </h2>
          {selectedParts.length === 0 ? (
            <div className="rounded-lg border border-dashed p-8 text-center text-muted-foreground">
              Clique nas peças do catálogo para adicioná-las aqui.
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

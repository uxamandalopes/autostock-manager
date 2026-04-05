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
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { CalendarIcon, ArrowLeft, Plus, Minus, Trash2, Search, ChevronsUpDown } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import catalogoImg from "@/assets/catalogo-pecas.png";
import { catalogCategories, categoryOrder, type CatalogPart } from "@/data/catalogData";

interface SelectedPart extends CatalogPart {
  quantity: number;
}

const etapas = ["TREINO OPCIONAL 1", "TREINO OPCIONAL 2", "QUALIFICAÇÃO", "CORRIDA 1", "CORRIDA 2"];
const sessoes = ["MANHÃ", "TARDE", "NOITE"];
const ocorrenciasOptions = ["AVARIA", "MANUTENÇÃO"];

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
  const [activeCategory, setActiveCategory] = useState("frente");
  const [manualSearch, setManualSearch] = useState("");
  const [catalogOpen, setCatalogOpen] = useState(false);
  const [addPartOpen, setAddPartOpen] = useState(false);

  const currentCatalog = catalogCategories[activeCategory];
  const allParts = Object.values(catalogCategories).flatMap((cat) => cat.parts);

  const filteredManualParts = manualSearch.trim()
    ? allParts.filter(
        (p) =>
          p.name.toLowerCase().includes(manualSearch.toLowerCase()) ||
          p.partNumber.toLowerCase().includes(manualSearch.toLowerCase())
      )
    : [];

  const addPart = (part: CatalogPart) => {
    setSelectedParts((prev) => {
      const existing = prev.find((p) => p.id === part.id);
      if (existing) {
        return prev.map((p) => (p.id === part.id ? { ...p, quantity: p.quantity + 1 } : p));
      }
      return [...prev, { ...part, quantity: 1 }];
    });
  };

  const addPartById = (id: number) => {
    const part = currentCatalog.parts.find((p) => p.id === id);
    if (part) addPart(part);
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
          <Label>Digite o chassi</Label>
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

      {/* Catalog + Selected Parts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Interactive Image Catalog - takes 2 cols */}
        <div className="lg:col-span-2 flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-foreground">Catálogo de Peças</h2>
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-foreground">Filtrar por:</span>
              <Popover open={catalogOpen} onOpenChange={setCatalogOpen}>
                <PopoverTrigger asChild>
                  <Button variant="outline" role="combobox" className="w-[250px] justify-between">
                  {catalogCategories[activeCategory].label}
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[250px] p-0">
                <Command>
                  <CommandInput placeholder="Buscar catálogo..." />
                  <CommandList>
                    <CommandEmpty>Nenhum catálogo encontrado.</CommandEmpty>
                    <CommandGroup>
                      {categoryOrder.map((key) => (
                        <CommandItem
                          key={key}
                          value={catalogCategories[key].label}
                          onSelect={() => {
                            setActiveCategory(key);
                            setCatalogOpen(false);
                          }}
                        >
                          {catalogCategories[key].label}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
              </Popover>
            </div>
          </div>
          <div className="relative border rounded-lg overflow-hidden bg-white max-h-[500px]">
            <img
              src={catalogoImg}
              alt="Catálogo de peças - diagrama explodido"
              className="w-full h-auto object-contain max-h-[500px]"
              draggable={false}
            />
            {currentCatalog.hotspots.map((spot) => {
              const isSelected = selectedParts.some((p) => p.id === spot.id);
              const part = currentCatalog.parts.find((p) => p.id === spot.id);
              return (
                <button
                  key={spot.id}
                  onClick={() => addPartById(spot.id)}
                  title={part ? `${spot.id} - ${part.name} (${part.partNumber})` : `Peça ${spot.id}`}
                  className={cn(
                    "absolute w-9 h-9 -translate-x-1/2 -translate-y-1/2 rounded-full flex items-center justify-center text-xs font-bold transition-all cursor-pointer border-2 hover:scale-125 z-10 shadow-md",
                    isSelected
                      ? "bg-green-600 text-white border-green-700 shadow-green-400/40 scale-110"
                      : "bg-white text-red-600 border-red-500 hover:border-red-700 hover:bg-red-50"
                  )}
                  style={{ left: `${spot.x}%`, top: `${spot.y}%` }}
                >
                  {spot.id > 100 ? spot.id - Math.floor(spot.id / 100) * 100 : spot.id}
                </button>
              );
            })}
          </div>
          <p className="text-xs text-muted-foreground">
            Clique nos números da imagem para adicionar peças à lista.
          </p>
        </div>

        {/* Selected Parts Table */}
        <div>
          <h2 className="text-xl font-semibold mb-4 text-foreground">
            Peças Selecionadas ({selectedParts.length})
          </h2>

          <Dialog open={addPartOpen} onOpenChange={(open) => { setAddPartOpen(open); if (!open) setManualSearch(""); }}>
            <DialogTrigger asChild>
              <Button variant="outline" className="w-full mb-4">
                <Plus className="mr-2 h-4 w-4" /> Adicionar Peça
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Adicionar Peça Manualmente</DialogTitle>
              </DialogHeader>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar por nome ou partnumber..."
                  className="pl-9"
                  value={manualSearch}
                  onChange={(e) => setManualSearch(e.target.value)}
                />
              </div>
              <div className="max-h-64 overflow-y-auto border rounded-md">
                {(manualSearch.trim() ? filteredManualParts : allParts).map((part) => (
                  <button
                    key={part.id}
                    className="w-full text-left px-3 py-2.5 text-sm hover:bg-accent hover:text-accent-foreground transition-colors border-b last:border-b-0"
                    onClick={() => {
                      addPart(part);
                      toast.success(`${part.name} adicionada.`);
                    }}
                  >
                    <span className="font-medium">{part.name}</span>
                    <span className="text-muted-foreground ml-2 font-mono text-xs">{part.partNumber}</span>
                  </button>
                ))}
                {manualSearch.trim() && filteredManualParts.length === 0 && (
                  <p className="p-4 text-sm text-muted-foreground text-center">Nenhuma peça encontrada.</p>
                )}
              </div>
            </DialogContent>
          </Dialog>

          {selectedParts.length === 0 ? (
            <div className="rounded-lg border border-dashed p-8 text-center text-muted-foreground">
              Clique nos números do catálogo ou use o botão acima para adicionar peças.
            </div>
          ) : (
            <div className="rounded-lg border overflow-hidden">
              <div className="max-h-[450px] overflow-y-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-[hsl(0,0%,4%)] hover:bg-[hsl(0,0%,4%)]">
                      <TableHead className="text-white font-semibold">Peça</TableHead>
                      <TableHead className="text-white font-semibold">Part Number</TableHead>
                      <TableHead className="text-white font-semibold text-center">Qtd</TableHead>
                      <TableHead className="text-white font-semibold text-center">Ação</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {selectedParts.map((part) => (
                      <TableRow key={part.id}>
                        <TableCell className="font-medium text-sm">{part.name}</TableCell>
                        <TableCell className="font-mono text-xs">{part.partNumber}</TableCell>
                        <TableCell>
                          <div className="flex items-center justify-center gap-1">
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-6 w-6"
                              onClick={() => updateQuantity(part.id, -1)}
                            >
                              <Minus className="h-3 w-3" />
                            </Button>
                            <span className="w-6 text-center font-semibold text-sm">{part.quantity}</span>
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-6 w-6"
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
              </div>
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

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

  const [submitModalOpen, setSubmitModalOpen] = useState(false);

  const handleSubmit = () => {
    if (!chassi || !piloto || !etapa || !sessao || !ocorrencia || !nomeAnalista) {
      toast.error("Preencha todos os campos obrigatórios.");
      return;
    }
    if (selectedParts.length === 0) {
      toast.error("Selecione pelo menos uma peça do catálogo.");
      return;
    }
    setSubmitModalOpen(true);
  };

  return (
    <div className="p-6 lg:p-8 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" className="rounded-full" onClick={() => navigate("/ocorrencias")}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-foreground tracking-tight">Nova Ocorrência</h1>
          <p className="text-sm text-muted-foreground">Preencha os dados e selecione as peças necessárias</p>
        </div>
      </div>

      {/* Form Card */}
      <div className="rounded-xl border bg-card p-6 shadow-sm">
        <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4">Dados do Incidente</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-4">
          <div className="space-y-1.5">
            <Label className="text-xs font-medium">Data do Incidente</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn("w-full justify-start text-left font-normal h-9 text-sm", !date && "text-muted-foreground")}
                >
                  <CalendarIcon className="mr-2 h-3.5 w-3.5" />
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

          <div className="space-y-1.5">
            <Label className="text-xs font-medium">Digite o chassi</Label>
            <Input className="h-9 text-sm" placeholder="Ex: 123/II" value={chassi} onChange={(e) => setChassi(e.target.value)} />
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs font-medium">Piloto</Label>
            <Input className="h-9 text-sm" placeholder="Nome do piloto" value={piloto} onChange={(e) => setPiloto(e.target.value)} />
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs font-medium">Etapa</Label>
            <Select value={etapa} onValueChange={setEtapa}>
              <SelectTrigger className="h-9 text-sm"><SelectValue placeholder="Selecione" /></SelectTrigger>
              <SelectContent>
                {etapas.map((e) => <SelectItem key={e} value={e}>{e}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs font-medium">Sessão</Label>
            <Select value={sessao} onValueChange={setSessao}>
              <SelectTrigger className="h-9 text-sm"><SelectValue placeholder="Selecione" /></SelectTrigger>
              <SelectContent>
                {sessoes.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs font-medium">Ocorrência</Label>
            <Select value={ocorrencia} onValueChange={setOcorrencia}>
              <SelectTrigger className="h-9 text-sm"><SelectValue placeholder="Selecione" /></SelectTrigger>
              <SelectContent>
                {ocorrenciasOptions.map((o) => <SelectItem key={o} value={o}>{o}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs font-medium">Nome Analista</Label>
            <Input className="h-9 text-sm" placeholder="Nome do analista" value={nomeAnalista} onChange={(e) => setNomeAnalista(e.target.value)} />
          </div>
        </div>
      </div>

      {/* Catalog + Selected Parts */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Catalog - 3 cols */}
        <div className="lg:col-span-3 rounded-xl border bg-card shadow-sm overflow-hidden">
          <div className="flex items-center justify-between p-4 border-b bg-muted/30">
            <h2 className="text-sm font-semibold text-foreground">Catálogo de Peças</h2>
            <div className="flex items-center gap-2">
              <span className="text-xs font-medium text-muted-foreground">Filtrar por:</span>
              <Popover open={catalogOpen} onOpenChange={setCatalogOpen}>
                <PopoverTrigger asChild>
                  <Button variant="outline" role="combobox" size="sm" className="w-[200px] justify-between text-xs h-8">
                    {catalogCategories[activeCategory].label}
                    <ChevronsUpDown className="ml-2 h-3 w-3 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[200px] p-0">
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

          {/* Image only with hotspots */}
          <div className="relative bg-white flex items-center justify-center overflow-hidden">
            <img
              src={catalogoImg}
              alt="Catálogo de peças"
              className="w-full object-contain"
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
                    "absolute w-8 h-8 -translate-x-1/2 -translate-y-1/2 rounded-full flex items-center justify-center text-[11px] font-bold transition-all cursor-pointer border-2 hover:scale-125 z-10",
                    isSelected
                      ? "bg-green-600 text-white border-green-700 shadow-lg shadow-green-500/30 scale-110"
                      : "bg-white/90 text-destructive border-destructive/60 hover:border-destructive hover:bg-red-50 shadow-md"
                  )}
                  style={{ left: `${spot.x}%`, top: `${spot.y}%` }}
                >
                  {spot.id > 100 ? spot.id - Math.floor(spot.id / 100) * 100 : spot.id}
                </button>
              );
            })}
          </div>
          <p className="text-[11px] text-muted-foreground px-4 py-2 border-t bg-muted/20">
            Clique nos números para adicionar peças à lista.
          </p>
        </div>

        {/* Selected Parts - 2 cols */}
        <div className="lg:col-span-2 rounded-xl border bg-card shadow-sm overflow-hidden flex flex-col">
          <div className="p-4 border-b bg-muted/30">
            <h2 className="text-sm font-semibold text-foreground">
              Peças Selecionadas
              {selectedParts.length > 0 && (
                <span className="ml-2 inline-flex items-center justify-center rounded-full bg-primary text-primary-foreground text-[10px] font-bold w-5 h-5">
                  {selectedParts.length}
                </span>
              )}
            </h2>
          </div>

          <div className="p-3">
            <Dialog open={addPartOpen} onOpenChange={(open) => { setAddPartOpen(open); if (!open) setManualSearch(""); }}>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm" className="w-full bg-white text-destructive border-destructive/50 hover:bg-destructive/5 hover:text-destructive hover:border-destructive">
                  <Plus className="mr-2 h-3.5 w-3.5" /> Adicionar Peça
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
          </div>

          {selectedParts.length === 0 ? (
            <div className="flex-1 flex items-center justify-center p-8">
              <p className="text-sm text-muted-foreground text-center">
                Nenhuma peça selecionada.<br />
                <span className="text-xs">Clique no catálogo ou use o botão acima.</span>
              </p>
            </div>
          ) : (
            <div className="flex-1 flex flex-col">
              <div className="flex-1 overflow-y-auto max-h-[400px]">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-foreground hover:bg-foreground">
                      <TableHead className="text-primary-foreground font-semibold text-xs">Peça</TableHead>
                      <TableHead className="text-primary-foreground font-semibold text-xs">Part Number</TableHead>
                      <TableHead className="text-primary-foreground font-semibold text-xs text-center">Qtd</TableHead>
                      <TableHead className="text-primary-foreground font-semibold text-xs text-center w-12">Ação</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {selectedParts.map((part) => (
                      <TableRow key={part.id} className="group">
                        <TableCell className="font-medium text-xs py-2">{part.name}</TableCell>
                        <TableCell className="font-mono text-[11px] py-2">{part.partNumber}</TableCell>
                        <TableCell className="py-2">
                          <div className="flex items-center justify-center gap-1">
                            <Button variant="outline" size="icon" className="h-5 w-5" onClick={() => updateQuantity(part.id, -1)}>
                              <Minus className="h-2.5 w-2.5" />
                            </Button>
                            <span className="w-5 text-center font-semibold text-xs">{part.quantity}</span>
                            <Button variant="outline" size="icon" className="h-5 w-5" onClick={() => updateQuantity(part.id, 1)}>
                              <Plus className="h-2.5 w-2.5" />
                            </Button>
                          </div>
                        </TableCell>
                        <TableCell className="text-center py-2">
                          <button
                            className="text-muted-foreground hover:text-destructive transition-colors opacity-0 group-hover:opacity-100"
                            onClick={() => removePart(part.id)}
                          >
                            <Trash2 size={14} />
                          </button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
              <div className="p-4 border-t mt-auto">
                <Button className="w-full" onClick={handleSubmit}>
                  Solicitar Estoque
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Modal de confirmação */}
      <Dialog open={submitModalOpen} onOpenChange={setSubmitModalOpen}>
        <DialogContent className="sm:max-w-md text-center">
          <DialogHeader>
            <DialogTitle className="text-center text-lg">O estoque foi solicitado. O que você deseja fazer?</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col sm:flex-row gap-3 pt-4 justify-center">
            <Button
              onClick={() => {
                setSubmitModalOpen(false);
                setSelectedParts([]);
                setChassi("");
                setPiloto("");
                setEtapa("");
                setSessao("");
                setOcorrencia("");
                setNomeAnalista("");
                setDate(new Date());
                toast.success("Pronto para uma nova ocorrência.");
              }}
            >
              Nova ocorrência
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                setSubmitModalOpen(false);
                toast.info("Gerando relatório...");
              }}
            >
              Gerar relatório
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default NovaOcorrencia;

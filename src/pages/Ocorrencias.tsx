import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
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
import { Label } from "@/components/ui/label";
import { Pencil, Trash2, ArrowUpDown, Plus, CalendarIcon, ArrowLeft, Camera, Package } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { cn } from "@/lib/utils";

interface Ocorrencia {
  id: number;
  chassi: string;
  dataSolicitacao: string;
  etapa: string;
  sessao: string;
  ocorrencia: string;
}

const initialData: Ocorrencia[] = [
  { id: 1, chassi: "123/II", dataSolicitacao: "02/04/2026", etapa: "TREINO OPCIONAL 2", sessao: "", ocorrencia: "" },
  { id: 2, chassi: "456/III", dataSolicitacao: "01/04/2026", etapa: "TREINO OPCIONAL 1", sessao: "", ocorrencia: "" },
  { id: 3, chassi: "789/IV", dataSolicitacao: "03/04/2026", etapa: "QUALIFICAÇÃO", sessao: "", ocorrencia: "" },
];

const chassiOptions = ["123/II", "456/III", "789/IV", "012/V"];
const pilotoOptions = ["Carlos Sainz", "Max Verstappen", "Lewis Hamilton"];
const etapaOptions = ["TREINO OPCIONAL 1", "TREINO OPCIONAL 2", "QUALIFICAÇÃO", "CORRIDA"];
const sessaoOptions = ["Sessão 1", "Sessão 2", "Sessão 3"];
const ocorrenciaOptions = ["Avaria", "Manutenção"];

const Ocorrencias = () => {
  const navigate = useNavigate();
  const [data, setData] = useState<Ocorrencia[]>(initialData);
  const [selected, setSelected] = useState<Set<number>>(new Set());
  const [sortAsc, setSortAsc] = useState(true);

  // Modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [modalStep, setModalStep] = useState<1 | 2>(1);
  const [formDate, setFormDate] = useState<Date>(new Date());
  const [formChassi, setFormChassi] = useState("");
  const [formPiloto, setFormPiloto] = useState("");
  const [formEtapa, setFormEtapa] = useState("");
  const [formSessao, setFormSessao] = useState("");
  const [formOcorrencia, setFormOcorrencia] = useState("");

  const allSelected = data.length > 0 && selected.size === data.length;

  const toggleAll = () => {
    if (allSelected) setSelected(new Set());
    else setSelected(new Set(data.map((d) => d.id)));
  };

  const toggleOne = (id: number) => {
    const next = new Set(selected);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setSelected(next);
  };

  const deleteSelected = () => {
    setData((prev) => prev.filter((d) => !selected.has(d.id)));
    setSelected(new Set());
  };

  const deleteOne = (id: number) => {
    setData((prev) => prev.filter((d) => d.id !== id));
    selected.delete(id);
    setSelected(new Set(selected));
  };

  const parseDate = (str: string) => {
    const [d, m, y] = str.split("/").map(Number);
    return new Date(y, m - 1, d).getTime();
  };

  const sortByDate = () => {
    setData((prev) => {
      const sorted = [...prev].sort((a, b) => {
        const diff = parseDate(a.dataSolicitacao) - parseDate(b.dataSolicitacao);
        return sortAsc ? diff : -diff;
      });
      return sorted;
    });
    setSortAsc(!sortAsc);
  };

  const openModal = () => {
    setModalStep(1);
    setFormDate(new Date());
    setFormChassi("");
    setFormPiloto("");
    setFormEtapa("");
    setFormSessao("");
    setFormOcorrencia("");
    setModalOpen(true);
  };

  const handleContinue = () => {
    setModalStep(2);
  };

  const handleSolicitarPecas = () => {
    setModalOpen(false);
    navigate("/ocorrencias/nova", {
      state: { date: formDate, chassi: formChassi, piloto: formPiloto, etapa: formEtapa, sessao: formSessao, ocorrencia: formOcorrencia },
    });
  };

  const handleAnexarFotos = () => {
    setModalOpen(false);
    navigate("/ocorrencias/lista-danos", {
      state: { date: formDate, chassi: formChassi, piloto: formPiloto, etapa: formEtapa, sessao: formSessao, ocorrencia: formOcorrencia, activeTab: "imagens" },
    });
  };

  const isFormValid = formChassi && formPiloto && formEtapa && formSessao && formOcorrencia;

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-foreground">Ocorrências</h1>
        <div className="flex gap-3">
          {selected.size > 0 && (
            <Button variant="destructive" onClick={deleteSelected}>
              <Trash2 className="mr-1" /> Excluir ({selected.size})
            </Button>
          )}
          <Button onClick={openModal}>
            <Plus className="mr-1" /> Nova ocorrência
          </Button>
        </div>
      </div>

      <div className="rounded-lg border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-[#010101] hover:bg-[#010101]">
              <TableHead className="w-12 text-white">
                <Checkbox
                  checked={allSelected}
                  onCheckedChange={toggleAll}
                  className="border-white data-[state=checked]:bg-white data-[state=checked]:text-[#010101]"
                />
              </TableHead>
              <TableHead className="text-white font-semibold">Chassi</TableHead>
              <TableHead className="text-white font-semibold">
                <button onClick={sortByDate} className="flex items-center gap-1 hover:opacity-80 transition-opacity">
                  Data de solicitação
                  <ArrowUpDown size={14} />
                </button>
              </TableHead>
              <TableHead className="text-white font-semibold">Etapa</TableHead>
              <TableHead className="text-white font-semibold">Sessão</TableHead>
              <TableHead className="text-white font-semibold">Ocorrência</TableHead>
              <TableHead className="text-white font-semibold">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((row) => (
              <TableRow key={row.id} data-state={selected.has(row.id) ? "selected" : undefined}>
                <TableCell>
                  <Checkbox checked={selected.has(row.id)} onCheckedChange={() => toggleOne(row.id)} />
                </TableCell>
                <TableCell className="font-medium">{row.chassi}</TableCell>
                <TableCell>{row.dataSolicitacao}</TableCell>
                <TableCell>{row.etapa}</TableCell>
                <TableCell>{row.sessao || "—"}</TableCell>
                <TableCell>{row.ocorrencia || "—"}</TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <button className="text-muted-foreground hover:text-foreground transition-colors">
                      <Pencil size={16} />
                    </button>
                    <button className="text-muted-foreground hover:text-destructive transition-colors" onClick={() => deleteOne(row.id)}>
                      <Trash2 size={16} />
                    </button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
            {data.length === 0 && (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                  Nenhuma ocorrência encontrada.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Modal de Nova Ocorrência */}
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">Dados do incidente</DialogTitle>
            <DialogDescription className="sr-only">Preencha os dados do incidente</DialogDescription>
          </DialogHeader>

          {modalStep === 1 && (
            <div className="space-y-4 pt-2">
              {/* Data do incidente */}
              <div className="space-y-2">
                <Label>Data do incidente</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className={cn("w-full justify-start text-left font-normal", !formDate && "text-muted-foreground")}>
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {formDate ? format(formDate, "dd/MM/yyyy", { locale: ptBR }) : "Selecione a data"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar mode="single" selected={formDate} onSelect={(d) => d && setFormDate(d)} locale={ptBR} className="p-3 pointer-events-auto" />
                  </PopoverContent>
                </Popover>
              </div>

              {/* Chassi */}
              <div className="space-y-2">
                <Label>Chassi</Label>
                <Select value={formChassi} onValueChange={setFormChassi}>
                  <SelectTrigger><SelectValue placeholder="Selecione o chassi" /></SelectTrigger>
                  <SelectContent>
                    {chassiOptions.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>

              {/* Piloto */}
              <div className="space-y-2">
                <Label>Piloto</Label>
                <Select value={formPiloto} onValueChange={setFormPiloto}>
                  <SelectTrigger><SelectValue placeholder="Selecione o piloto" /></SelectTrigger>
                  <SelectContent>
                    {pilotoOptions.map((p) => <SelectItem key={p} value={p}>{p}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>

              {/* Etapa */}
              <div className="space-y-2">
                <Label>Etapa</Label>
                <Select value={formEtapa} onValueChange={setFormEtapa}>
                  <SelectTrigger><SelectValue placeholder="Selecione a etapa" /></SelectTrigger>
                  <SelectContent>
                    {etapaOptions.map((e) => <SelectItem key={e} value={e}>{e}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>

              {/* Sessão */}
              <div className="space-y-2">
                <Label>Sessão</Label>
                <Select value={formSessao} onValueChange={setFormSessao}>
                  <SelectTrigger><SelectValue placeholder="Selecione a sessão" /></SelectTrigger>
                  <SelectContent>
                    {sessaoOptions.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>

              {/* Ocorrência */}
              <div className="space-y-2">
                <Label>Ocorrência</Label>
                <Select value={formOcorrencia} onValueChange={setFormOcorrencia}>
                  <SelectTrigger><SelectValue placeholder="Selecione a ocorrência" /></SelectTrigger>
                  <SelectContent>
                    {ocorrenciaOptions.map((o) => <SelectItem key={o} value={o}>{o}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>

              {/* Botões */}
              <div className="flex justify-end gap-3 pt-4">
                <Button variant="outline" onClick={() => setModalOpen(false)}>Cancelar</Button>
                <Button onClick={handleContinue} disabled={!isFormValid}>Continuar</Button>
              </div>
            </div>
          )}

          {modalStep === 2 && (
            <div className="space-y-6 pt-2">
              <p className="text-muted-foreground text-center text-lg">O que você deseja fazer?</p>

              <div className="flex flex-col gap-3">
                <Button onClick={handleSolicitarPecas} className="w-full gap-2 text-base py-6">
                  <Package className="h-5 w-5" />
                  Solicitar peças no catálogo
                </Button>
                <Button variant="outline" onClick={handleAnexarFotos} className="w-full gap-2 text-base py-6">
                  <Camera className="h-5 w-5" />
                  Anexar fotos do veículo
                </Button>
                <Button variant="outline" onClick={() => setModalStep(1)} className="w-full gap-2 text-base py-6">
                  <ArrowLeft className="h-5 w-5" />
                  Voltar
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Ocorrencias;

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
import { Pencil, Trash2, ArrowUpDown, Plus } from "lucide-react";

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

const Ocorrencias = () => {
  const navigate = useNavigate();
  const [data, setData] = useState<Ocorrencia[]>(initialData);
  const [selected, setSelected] = useState<Set<number>>(new Set());
  const [sortAsc, setSortAsc] = useState(true);

  const allSelected = data.length > 0 && selected.size === data.length;

  const toggleAll = () => {
    if (allSelected) {
      setSelected(new Set());
    } else {
      setSelected(new Set(data.map((d) => d.id)));
    }
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
          <Button onClick={() => navigate("/ocorrencias/nova")}>
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
                <button
                  onClick={sortByDate}
                  className="flex items-center gap-1 hover:opacity-80 transition-opacity"
                >
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
                  <Checkbox
                    checked={selected.has(row.id)}
                    onCheckedChange={() => toggleOne(row.id)}
                  />
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
                    <button
                      className="text-muted-foreground hover:text-destructive transition-colors"
                      onClick={() => deleteOne(row.id)}
                    >
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
    </div>
  );
};

export default Ocorrencias;

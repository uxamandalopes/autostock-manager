import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Plus, Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";

interface Peca {
  id: string;
  nome: string;
  partNumber: string;
  quantidade: number;
  estoque: string;
  ocorrencia: string;
  eixoLado: string;
}

const ListaDanos = () => {
  const navigate = useNavigate();
  const [pecas, setPecas] = useState<Peca[]>([
    {
      id: "1",
      nome: "Para-choque dianteiro",
      partNumber: "9Y0807221A",
      quantidade: 1,
      estoque: "Disponível",
      ocorrencia: "Avaria",
      eixoLado: "Dianteiro/Central",
    },
  ]);

  const [novaPecaOpen, setNovaPecaOpen] = useState(false);
  const [editPeca, setEditPeca] = useState<Peca | null>(null);
  const [formPeca, setFormPeca] = useState({
    nome: "",
    partNumber: "",
    quantidade: 1,
    estoque: "",
    ocorrencia: "",
    eixoLado: "",
  });

  const handleAddPeca = () => {
    if (!formPeca.nome) {
      toast.error("Preencha o nome da peça.");
      return;
    }
    const nova: Peca = {
      id: Date.now().toString(),
      ...formPeca,
    };
    setPecas((prev) => [...prev, nova]);
    setFormPeca({ nome: "", partNumber: "", quantidade: 1, estoque: "", ocorrencia: "", eixoLado: "" });
    setNovaPecaOpen(false);
    toast.success("Peça adicionada.");
  };

  const handleEditSave = () => {
    if (!editPeca) return;
    setPecas((prev) => prev.map((p) => (p.id === editPeca.id ? { ...editPeca, ...formPeca } : p)));
    setEditPeca(null);
    setFormPeca({ nome: "", partNumber: "", quantidade: 1, estoque: "", ocorrencia: "", eixoLado: "" });
    toast.success("Peça atualizada.");
  };

  const handleDelete = (id: string) => {
    setPecas((prev) => prev.filter((p) => p.id !== id));
    toast.success("Peça removida.");
  };

  const openEdit = (peca: Peca) => {
    setEditPeca(peca);
    setFormPeca({
      nome: peca.nome,
      partNumber: peca.partNumber,
      quantidade: peca.quantidade,
      estoque: peca.estoque,
      ocorrencia: peca.ocorrencia,
      eixoLado: peca.eixoLado,
    });
  };

  const PecaFormFields = () => (
    <div className="grid gap-3 py-2">
      <div><Label>Peça solicitada</Label><Input value={formPeca.nome} onChange={(e) => setFormPeca({ ...formPeca, nome: e.target.value })} /></div>
      <div><Label>Part Number</Label><Input value={formPeca.partNumber} onChange={(e) => setFormPeca({ ...formPeca, partNumber: e.target.value })} /></div>
      <div><Label>Quantidade</Label><Input type="number" min={1} value={formPeca.quantidade} onChange={(e) => setFormPeca({ ...formPeca, quantidade: Number(e.target.value) })} /></div>
      <div><Label>Estoque</Label><Input value={formPeca.estoque} onChange={(e) => setFormPeca({ ...formPeca, estoque: e.target.value })} /></div>
      <div><Label>Ocorrência</Label><Input value={formPeca.ocorrencia} onChange={(e) => setFormPeca({ ...formPeca, ocorrencia: e.target.value })} /></div>
      <div><Label>Eixo/Lado</Label><Input value={formPeca.eixoLado} onChange={(e) => setFormPeca({ ...formPeca, eixoLado: e.target.value })} /></div>
    </div>
  );

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-2xl font-bold tracking-tight">Lista de Danos</h1>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="pecas" className="w-full">
        <TabsList className="bg-muted/60 rounded-lg">
          <TabsTrigger value="pecas" className="px-6">Peças</TabsTrigger>
          <TabsTrigger value="servicos" className="px-6">Serviços</TabsTrigger>
          <TabsTrigger value="imagens" className="px-6">Imagens</TabsTrigger>
        </TabsList>

        {/* Tab Peças */}
        <TabsContent value="pecas" className="space-y-4 mt-4">
          <div className="flex justify-end">
            <Button
              onClick={() => {
                setFormPeca({ nome: "", partNumber: "", quantidade: 1, estoque: "", ocorrencia: "", eixoLado: "" });
                setNovaPecaOpen(true);
              }}
              className="gap-2"
            >
              <Plus className="h-4 w-4" /> Nova peça
            </Button>
          </div>

          <div className="rounded-lg border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-[hsl(var(--foreground))] hover:bg-[hsl(var(--foreground))]">
                  <TableHead className="text-white font-semibold">Peça solicitada</TableHead>
                  <TableHead className="text-white font-semibold">Part Number</TableHead>
                  <TableHead className="text-white font-semibold">Quantidade</TableHead>
                  <TableHead className="text-white font-semibold">Estoque</TableHead>
                  <TableHead className="text-white font-semibold">Ocorrência</TableHead>
                  <TableHead className="text-white font-semibold">Eixo/Lado</TableHead>
                  <TableHead className="text-white font-semibold text-center">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pecas.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                      Nenhuma peça adicionada.
                    </TableCell>
                  </TableRow>
                ) : (
                  pecas.map((peca) => (
                    <TableRow key={peca.id}>
                      <TableCell className="font-medium">{peca.nome}</TableCell>
                      <TableCell>{peca.partNumber}</TableCell>
                      <TableCell>{peca.quantidade}</TableCell>
                      <TableCell>{peca.estoque}</TableCell>
                      <TableCell>{peca.ocorrencia}</TableCell>
                      <TableCell>{peca.eixoLado}</TableCell>
                      <TableCell>
                        <div className="flex justify-center gap-2">
                          <Button variant="ghost" size="icon" onClick={() => openEdit(peca)}>
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" onClick={() => handleDelete(peca.id)}>
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          <div className="flex gap-3 justify-end pt-2">
            <Button variant="outline" onClick={() => { toast.success("Ocorrência finalizada."); navigate("/ocorrencias"); }}>
              Finalizar ocorrência
            </Button>
            <Button onClick={() => toast.info("Gerando ordem de serviço...")}>
              Gerar ordem de serviço
            </Button>
          </div>
        </TabsContent>

        {/* Tab Serviços */}
        <TabsContent value="servicos" className="mt-4">
          <div className="flex items-center justify-center py-16 text-muted-foreground">
            Em breve.
          </div>
        </TabsContent>

        {/* Tab Imagens */}
        <TabsContent value="imagens" className="mt-4">
          <div className="flex items-center justify-center py-16 text-muted-foreground">
            Em breve.
          </div>
        </TabsContent>
      </Tabs>

      {/* Modal Nova Peça */}
      <Dialog open={novaPecaOpen} onOpenChange={setNovaPecaOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader><DialogTitle>Nova peça</DialogTitle></DialogHeader>
          <PecaFormFields />
          <div className="flex justify-end gap-2 pt-2">
            <Button variant="outline" onClick={() => setNovaPecaOpen(false)}>Cancelar</Button>
            <Button onClick={handleAddPeca}>Adicionar</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Modal Editar Peça */}
      <Dialog open={!!editPeca} onOpenChange={(open) => { if (!open) setEditPeca(null); }}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader><DialogTitle>Editar peça</DialogTitle></DialogHeader>
          <PecaFormFields />
          <div className="flex justify-end gap-2 pt-2">
            <Button variant="outline" onClick={() => setEditPeca(null)}>Cancelar</Button>
            <Button onClick={handleEditSave}>Salvar</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ListaDanos;

import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
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
import { ArrowLeft, Plus, Pencil, Trash2, Upload, X } from "lucide-react";
import { toast } from "sonner";

interface Imagem {
  id: string;
  nome: string;
  url: string;
  descricao: string;
}

interface Peca {
  id: string;
  nome: string;
  partNumber: string;
  quantidade: number;
  estoque: string;
  ocorrencia: string;
  eixoLado: string;
}

interface Servico {
  id: string;
  servicoFunilaria: string;
  ocorrencia: string;
  situacao: string;
}

const ListaDanos = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const pecasFromCatalog = (location.state as { pecas?: Peca[] })?.pecas || [];

  // Peças state
  const [pecas, setPecas] = useState<Peca[]>(pecasFromCatalog);
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

  // Serviços state
  const [servicos, setServicos] = useState<Servico[]>([]);
  const [novoServicoOpen, setNovoServicoOpen] = useState(false);
  const [editServico, setEditServico] = useState<Servico | null>(null);
  const [formServico, setFormServico] = useState({
    servicoFunilaria: "",
    ocorrencia: "",
    situacao: "",
  });

  // Imagens state
  const [imagens, setImagens] = useState<Imagem[]>([]);
  const [novaImagemOpen, setNovaImagemOpen] = useState(false);
  const [formImagem, setFormImagem] = useState({ descricao: "", file: null as File | null });

  const handleAddImagem = () => {
    if (!formImagem.file) { toast.error("Selecione uma imagem."); return; }
    const url = URL.createObjectURL(formImagem.file);
    setImagens((prev) => [...prev, { id: Date.now().toString(), nome: formImagem.file!.name, url, descricao: formImagem.descricao }]);
    setFormImagem({ descricao: "", file: null });
    setNovaImagemOpen(false);
    toast.success("Imagem adicionada.");
  };

  const handleDeleteImagem = (id: string) => {
    setImagens((prev) => prev.filter((i) => i.id !== id));
    toast.success("Imagem removida.");
  };

  // Peça handlers
  const handleAddPeca = () => {
    if (!formPeca.nome) { toast.error("Preencha o nome da peça."); return; }
    setPecas((prev) => [...prev, { id: Date.now().toString(), ...formPeca }]);
    setFormPeca({ nome: "", partNumber: "", quantidade: 1, estoque: "", ocorrencia: "", eixoLado: "" });
    setNovaPecaOpen(false);
    toast.success("Peça adicionada.");
  };

  const handleEditSavePeca = () => {
    if (!editPeca) return;
    setPecas((prev) => prev.map((p) => (p.id === editPeca.id ? { ...editPeca, ...formPeca } : p)));
    setEditPeca(null);
    setFormPeca({ nome: "", partNumber: "", quantidade: 1, estoque: "", ocorrencia: "", eixoLado: "" });
    toast.success("Peça atualizada.");
  };

  const handleDeletePeca = (id: string) => {
    setPecas((prev) => prev.filter((p) => p.id !== id));
    toast.success("Peça removida.");
  };

  const openEditPeca = (peca: Peca) => {
    setEditPeca(peca);
    setFormPeca({ nome: peca.nome, partNumber: peca.partNumber, quantidade: peca.quantidade, estoque: peca.estoque, ocorrencia: peca.ocorrencia, eixoLado: peca.eixoLado });
  };

  // Serviço handlers
  const handleAddServico = () => {
    if (!formServico.servicoFunilaria) { toast.error("Preencha o serviço."); return; }
    setServicos((prev) => [...prev, { id: Date.now().toString(), ...formServico }]);
    setFormServico({ servicoFunilaria: "", ocorrencia: "", situacao: "" });
    setNovoServicoOpen(false);
    toast.success("Serviço adicionado.");
  };

  const handleEditSaveServico = () => {
    if (!editServico) return;
    setServicos((prev) => prev.map((s) => (s.id === editServico.id ? { ...editServico, ...formServico } : s)));
    setEditServico(null);
    setFormServico({ servicoFunilaria: "", ocorrencia: "", situacao: "" });
    toast.success("Serviço atualizado.");
  };

  const handleDeleteServico = (id: string) => {
    setServicos((prev) => prev.filter((s) => s.id !== id));
    toast.success("Serviço removido.");
  };

  const openEditServico = (servico: Servico) => {
    setEditServico(servico);
    setFormServico({ servicoFunilaria: servico.servicoFunilaria, ocorrencia: servico.ocorrencia, situacao: servico.situacao });
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

  const ServicoFormFields = () => (
    <div className="grid gap-3 py-2">
      <div><Label>Serviço Funilaria</Label><Input value={formServico.servicoFunilaria} onChange={(e) => setFormServico({ ...formServico, servicoFunilaria: e.target.value })} /></div>
      <div><Label>Ocorrência</Label><Input value={formServico.ocorrencia} onChange={(e) => setFormServico({ ...formServico, ocorrencia: e.target.value })} /></div>
      <div><Label>Situação</Label><Input value={formServico.situacao} onChange={(e) => setFormServico({ ...formServico, situacao: e.target.value })} /></div>
    </div>
  );

  const ActionButtons = () => (
    <div className="flex gap-3 justify-end pt-2">
      <Button variant="outline" onClick={() => { toast.success("Análise finalizada."); navigate("/ocorrencias"); }}>
        Finalizar análise
      </Button>
      <Button onClick={() => toast.info("Gerando ordem de serviço...")}>
        Gerar ordem de serviço
      </Button>
    </div>
  );

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-2xl font-bold tracking-tight">Lista de Danos</h1>
      </div>

      <Tabs defaultValue="pecas" className="w-full">
        <TabsList className="w-full justify-center bg-muted/60 rounded-lg">
          <TabsTrigger value="pecas" className="px-8 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">Peças</TabsTrigger>
          <TabsTrigger value="servicos" className="px-8 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">Serviços</TabsTrigger>
          <TabsTrigger value="imagens" className="px-8 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">Imagens</TabsTrigger>
        </TabsList>

        {/* Tab Peças */}
        <TabsContent value="pecas" className="space-y-4 mt-4">
          <div className="flex justify-end">
            <Button onClick={() => { setFormPeca({ nome: "", partNumber: "", quantidade: 1, estoque: "", ocorrencia: "", eixoLado: "" }); setNovaPecaOpen(true); }} className="gap-2">
              <Plus className="h-4 w-4" /> Nova peça
            </Button>
          </div>
          <div className="rounded-lg border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-[hsl(var(--foreground))] hover:bg-[hsl(var(--foreground))]">
                  <TableHead className="text-primary-foreground font-semibold">Peça solicitada</TableHead>
                  <TableHead className="text-primary-foreground font-semibold">Part Number</TableHead>
                  <TableHead className="text-primary-foreground font-semibold">Quantidade</TableHead>
                  <TableHead className="text-primary-foreground font-semibold">Estoque</TableHead>
                  <TableHead className="text-primary-foreground font-semibold">Ocorrência</TableHead>
                  <TableHead className="text-primary-foreground font-semibold">Eixo/Lado</TableHead>
                  <TableHead className="text-primary-foreground font-semibold text-center">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pecas.length === 0 ? (
                  <TableRow><TableCell colSpan={7} className="text-center py-8 text-muted-foreground">Nenhuma peça adicionada.</TableCell></TableRow>
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
                          <Button variant="ghost" size="icon" onClick={() => openEditPeca(peca)}><Pencil className="h-4 w-4" /></Button>
                          <Button variant="ghost" size="icon" onClick={() => handleDeletePeca(peca.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
          <ActionButtons />
        </TabsContent>

        {/* Tab Serviços */}
        <TabsContent value="servicos" className="space-y-4 mt-4">
          <div className="flex justify-end">
            <Button onClick={() => { setFormServico({ servicoFunilaria: "", ocorrencia: "", situacao: "" }); setNovoServicoOpen(true); }} className="gap-2">
              <Plus className="h-4 w-4" /> Novo serviço
            </Button>
          </div>
          <div className="rounded-lg border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-[hsl(var(--foreground))] hover:bg-[hsl(var(--foreground))]">
                  <TableHead className="text-primary-foreground font-semibold">Serviço Funilaria</TableHead>
                  <TableHead className="text-primary-foreground font-semibold">Ocorrência</TableHead>
                  <TableHead className="text-primary-foreground font-semibold">Situação</TableHead>
                  <TableHead className="text-primary-foreground font-semibold text-center">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {servicos.length === 0 ? (
                  <TableRow><TableCell colSpan={4} className="text-center py-8 text-muted-foreground">Nenhum serviço adicionado.</TableCell></TableRow>
                ) : (
                  servicos.map((servico) => (
                    <TableRow key={servico.id}>
                      <TableCell className="font-medium">{servico.servicoFunilaria}</TableCell>
                      <TableCell>{servico.ocorrencia}</TableCell>
                      <TableCell>{servico.situacao}</TableCell>
                      <TableCell>
                        <div className="flex justify-center gap-2">
                          <Button variant="ghost" size="icon" onClick={() => openEditServico(servico)}><Pencil className="h-4 w-4" /></Button>
                          <Button variant="ghost" size="icon" onClick={() => handleDeleteServico(servico.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
          <ActionButtons />
        </TabsContent>

        {/* Tab Imagens */}
        <TabsContent value="imagens" className="space-y-4 mt-4">
          <div className="flex justify-end">
            <Button onClick={() => { setFormImagem({ descricao: "", file: null }); setNovaImagemOpen(true); }} className="gap-2">
              <Plus className="h-4 w-4" /> Nova imagem
            </Button>
          </div>

          {imagens.length === 0 ? (
            <div className="flex items-center justify-center py-16 text-muted-foreground border rounded-lg">
              Nenhuma imagem adicionada.
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {imagens.map((img) => (
                <div key={img.id} className="relative group rounded-lg border overflow-hidden bg-card">
                  <img src={img.url} alt={img.descricao || img.nome} className="w-full h-48 object-cover" />
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute top-2 right-2 bg-background/80 opacity-0 group-hover:opacity-100 transition-opacity h-8 w-8"
                    onClick={() => handleDeleteImagem(img.id)}
                  >
                    <X className="h-4 w-4 text-destructive" />
                  </Button>
                  <div className="p-2">
                    <p className="text-sm font-medium truncate">{img.nome}</p>
                    {img.descricao && <p className="text-xs text-muted-foreground truncate">{img.descricao}</p>}
                  </div>
                </div>
              ))}
            </div>
          )}

          <ActionButtons />
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
            <Button onClick={handleEditSavePeca}>Salvar</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Modal Novo Serviço */}
      <Dialog open={novoServicoOpen} onOpenChange={setNovoServicoOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader><DialogTitle>Novo serviço</DialogTitle></DialogHeader>
          <ServicoFormFields />
          <div className="flex justify-end gap-2 pt-2">
            <Button variant="outline" onClick={() => setNovoServicoOpen(false)}>Cancelar</Button>
            <Button onClick={handleAddServico}>Adicionar</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Modal Editar Serviço */}
      <Dialog open={!!editServico} onOpenChange={(open) => { if (!open) setEditServico(null); }}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader><DialogTitle>Editar serviço</DialogTitle></DialogHeader>
          <ServicoFormFields />
          <div className="flex justify-end gap-2 pt-2">
            <Button variant="outline" onClick={() => setEditServico(null)}>Cancelar</Button>
            <Button onClick={handleEditSaveServico}>Salvar</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Modal Nova Imagem */}
      <Dialog open={novaImagemOpen} onOpenChange={setNovaImagemOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader><DialogTitle>Nova imagem</DialogTitle></DialogHeader>
          <div className="grid gap-3 py-2">
            <div>
              <Label>Imagem</Label>
              <Input
                type="file"
                accept="image/*"
                onChange={(e) => setFormImagem({ ...formImagem, file: e.target.files?.[0] || null })}
              />
            </div>
            <div>
              <Label>Descrição (opcional)</Label>
              <Input
                value={formImagem.descricao}
                onChange={(e) => setFormImagem({ ...formImagem, descricao: e.target.value })}
                placeholder="Descreva a imagem..."
              />
            </div>
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <Button variant="outline" onClick={() => setNovaImagemOpen(false)}>Cancelar</Button>
            <Button onClick={handleAddImagem}>Adicionar</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ListaDanos;

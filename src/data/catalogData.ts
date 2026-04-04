export interface CatalogPart {
  id: number;
  name: string;
  partNumber: string;
}

export interface Hotspot {
  id: number;
  x: number;
  y: number;
}

export interface CatalogCategory {
  label: string;
  image: string;
  parts: CatalogPart[];
  hotspots: Hotspot[];
}

// We'll use dynamic imports for images
export const catalogCategories: Record<string, Omit<CatalogCategory, 'image'> & { image: string }> = {
  frente: {
    label: "Frente",
    image: "catalogo-pecas",
    parts: [
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
    ],
    hotspots: [
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
    ],
  },
  traseira: {
    label: "Traseira",
    image: "catalogo-pecas", // same image placeholder for now
    parts: [
      { id: 101, name: "Para-choque Traseiro Completo", partNumber: "PCT-101" },
      { id: 102, name: "Lanterna Traseira Esquerda", partNumber: "LTE-102" },
      { id: 103, name: "Lanterna Traseira Direita", partNumber: "LTD-103" },
      { id: 104, name: "Refletor Traseiro", partNumber: "RFT-104" },
      { id: 105, name: "Suporte Para-choque Traseiro", partNumber: "SPT-105" },
      { id: 106, name: "Moldura Placa Traseira", partNumber: "MPT-106" },
      { id: 107, name: "Friso Traseiro", partNumber: "FRT-107" },
      { id: 108, name: "Protetor Inferior Traseiro", partNumber: "PIT-108" },
    ],
    hotspots: [
      { id: 101, x: 10, y: 40 },
      { id: 102, x: 25, y: 30 },
      { id: 103, x: 75, y: 30 },
      { id: 104, x: 50, y: 50 },
      { id: 105, x: 50, y: 70 },
      { id: 106, x: 50, y: 35 },
      { id: 107, x: 30, y: 55 },
      { id: 108, x: 50, y: 85 },
    ],
  },
  lateral_esquerda: {
    label: "Lateral Esquerda",
    image: "catalogo-pecas",
    parts: [
      { id: 201, name: "Porta Dianteira Esquerda", partNumber: "PDE-201" },
      { id: 202, name: "Porta Traseira Esquerda", partNumber: "PTE-202" },
      { id: 203, name: "Retrovisor Esquerdo", partNumber: "RVE-203" },
      { id: 204, name: "Maçaneta Dianteira Esquerda", partNumber: "MDE-204" },
      { id: 205, name: "Vidro Dianteiro Esquerdo", partNumber: "VDE-205" },
      { id: 206, name: "Moldura Porta Esquerda", partNumber: "MPE-206" },
    ],
    hotspots: [
      { id: 201, x: 25, y: 40 },
      { id: 202, x: 60, y: 40 },
      { id: 203, x: 10, y: 25 },
      { id: 204, x: 30, y: 50 },
      { id: 205, x: 25, y: 25 },
      { id: 206, x: 40, y: 55 },
    ],
  },
  lateral_direita: {
    label: "Lateral Direita",
    image: "catalogo-pecas",
    parts: [
      { id: 301, name: "Porta Dianteira Direita", partNumber: "PDD-301" },
      { id: 302, name: "Porta Traseira Direita", partNumber: "PTD-302" },
      { id: 303, name: "Retrovisor Direito", partNumber: "RVD-303" },
      { id: 304, name: "Maçaneta Dianteira Direita", partNumber: "MDD-304" },
      { id: 305, name: "Vidro Dianteiro Direito", partNumber: "VDD-305" },
      { id: 306, name: "Moldura Porta Direita", partNumber: "MPD-306" },
    ],
    hotspots: [
      { id: 301, x: 60, y: 40 },
      { id: 302, x: 25, y: 40 },
      { id: 303, x: 85, y: 25 },
      { id: 304, x: 55, y: 50 },
      { id: 305, x: 60, y: 25 },
      { id: 306, x: 45, y: 55 },
    ],
  },
  teto: {
    label: "Teto",
    image: "catalogo-pecas",
    parts: [
      { id: 401, name: "Painel do Teto", partNumber: "PNT-401" },
      { id: 402, name: "Rack de Teto", partNumber: "RCK-402" },
      { id: 403, name: "Antena", partNumber: "ANT-403" },
      { id: 404, name: "Calha de Chuva Esquerda", partNumber: "CCE-404" },
      { id: 405, name: "Calha de Chuva Direita", partNumber: "CCD-405" },
    ],
    hotspots: [
      { id: 401, x: 50, y: 50 },
      { id: 402, x: 50, y: 25 },
      { id: 403, x: 70, y: 15 },
      { id: 404, x: 15, y: 50 },
      { id: 405, x: 85, y: 50 },
    ],
  },
  motor: {
    label: "Motor",
    image: "catalogo-pecas",
    parts: [
      { id: 501, name: "Capô", partNumber: "CPO-501" },
      { id: 502, name: "Grade do Radiador", partNumber: "GRD-502" },
      { id: 503, name: "Farol Dianteiro Esquerdo", partNumber: "FDE-503" },
      { id: 504, name: "Farol Dianteiro Direito", partNumber: "FDD-504" },
      { id: 505, name: "Suporte Motor Esquerdo", partNumber: "SME-505" },
      { id: 506, name: "Suporte Motor Direito", partNumber: "SMD-506" },
      { id: 507, name: "Coletor de Admissão", partNumber: "CDA-507" },
    ],
    hotspots: [
      { id: 501, x: 50, y: 20 },
      { id: 502, x: 50, y: 40 },
      { id: 503, x: 20, y: 35 },
      { id: 504, x: 80, y: 35 },
      { id: 505, x: 25, y: 60 },
      { id: 506, x: 75, y: 60 },
      { id: 507, x: 50, y: 70 },
    ],
  },
};

export const categoryOrder = ["frente", "traseira", "lateral_esquerda", "lateral_direita", "teto", "motor"];

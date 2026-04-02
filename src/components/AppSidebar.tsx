import { useLocation, useNavigate } from "react-router-dom";
import {
  AlertTriangle,
  Search,
  Calendar,
  Settings,
  LogOut,
  Wrench,
  RefreshCw,
  User,
  Car,
  Package,
  ClipboardList,
  ChevronDown,
} from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface NavItem {
  title: string;
  url: string;
  icon: React.ElementType;
  children?: { title: string; url: string; icon: React.ElementType }[];
}

const navItems: NavItem[] = [
  { title: "Ocorrências", url: "/ocorrencias", icon: AlertTriangle },
  { title: "Análise de Danos", url: "/analise-danos", icon: Search },
  {
    title: "Cronogramas",
    url: "/cronogramas",
    icon: Calendar,
    children: [
      { title: "Funilaria", url: "/cronogramas/funilaria", icon: Wrench },
      { title: "Revisão", url: "/cronogramas/revisao", icon: RefreshCw },
    ],
  },
  {
    title: "Administrador",
    url: "/admin",
    icon: Settings,
    children: [
      { title: "Cadastro Piloto", url: "/admin/cadastro-piloto", icon: User },
      { title: "Cadastro Veículo", url: "/admin/cadastro-veiculo", icon: Car },
      { title: "Cadastro Peças", url: "/admin/cadastro-pecas", icon: Package },
      { title: "Cadastro Serviços", url: "/admin/cadastro-servicos", icon: ClipboardList },
    ],
  },
];

export function AppSidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const [openGroups, setOpenGroups] = useState<string[]>([]);

  const toggleGroup = (url: string) => {
    setOpenGroups((prev) =>
      prev.includes(url) ? prev.filter((u) => u !== url) : [...prev, url]
    );
  };

  const isActive = (url: string) => location.pathname === url;
  const isGroupActive = (item: NavItem) =>
    item.children?.some((c) => location.pathname === c.url) ?? false;
  const isGroupOpen = (item: NavItem) =>
    openGroups.includes(item.url) || isGroupActive(item);

  return (
    <aside className="flex h-screen w-64 flex-col text-sidebar-foreground shrink-0"
      style={{ background: "linear-gradient(180deg, #000000 0%, #D30021 100%)" }}>
      {/* Logo / Title */}
      <div className="flex items-center gap-3 px-5 py-6 border-b border-sidebar-border">
        <Car className="h-8 w-8 text-nav-active-foreground" />
        <span className="text-lg font-bold text-nav-active-foreground tracking-wide">
          AutoEstoque
        </span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
        {navItems.map((item) => {
          const hasChildren = !!item.children;
          const active = !hasChildren && isActive(item.url);
          const groupActive = hasChildren && isGroupActive(item);
          const open = hasChildren && isGroupOpen(item);

          return (
            <div key={item.url}>
              <button
                onClick={() => {
                  if (hasChildren) {
                    toggleGroup(item.url);
                  } else {
                    navigate(item.url);
                  }
                }}
                className={cn(
                  "flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-colors",
                  active || groupActive
                    ? "bg-nav-active text-nav-active-foreground"
                    : "text-sidebar-foreground hover:bg-sidebar-border/30"
                )}
              >
                <item.icon className="h-4 w-4 shrink-0" />
                <span className="flex-1 text-left">{item.title}</span>
                {hasChildren && (
                  <ChevronDown
                    className={cn(
                      "h-4 w-4 transition-transform",
                      open && "rotate-180"
                    )}
                  />
                )}
              </button>

              {/* Subcategories */}
              {hasChildren && open && (
                <div className="ml-4 mt-1 space-y-0.5 border-l border-sidebar-border/40 pl-3">
                  {item.children!.map((child) => {
                    const subActive = isActive(child.url);
                    return (
                      <button
                        key={child.url}
                        onClick={() => navigate(child.url)}
                        className={cn(
                          "flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors",
                          subActive
                            ? "bg-nav-sub-active text-nav-sub-active-foreground font-medium"
                            : "text-sidebar-foreground hover:bg-sidebar-border/30"
                        )}
                      >
                        <child.icon className="h-3.5 w-3.5 shrink-0" />
                        <span>{child.title}</span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </nav>

      {/* Logout */}
      <div className="border-t border-sidebar-border px-3 py-4">
        <button
          onClick={() => navigate("/login")}
          className="flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium text-sidebar-foreground hover:bg-sidebar-border/30 transition-colors"
        >
          <LogOut className="h-4 w-4" />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
}

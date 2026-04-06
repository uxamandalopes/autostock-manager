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
  Menu,
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

interface AppSidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

export function AppSidebar({ collapsed, onToggle }: AppSidebarProps) {
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
    <aside
      className={cn(
        "flex h-screen flex-col text-sidebar-foreground shrink-0 transition-all duration-300 sticky top-0",
        collapsed ? "w-16" : "w-64"
      )}
      style={{ background: "linear-gradient(180deg, #000000 0%, #D30021 100%)" }}
    >
      {/* Hamburger Toggle */}
      <div className={cn("flex items-center px-3 py-5 border-b border-sidebar-border", collapsed ? "justify-center" : "justify-end")}>
        <button
          onClick={onToggle}
          className="p-2 rounded-md text-nav-active-foreground hover:bg-sidebar-border/30 transition-colors"
        >
          <Menu className="h-6 w-6" />
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-hidden py-4 px-2 space-y-1">
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
                    if (collapsed) return;
                    toggleGroup(item.url);
                  } else {
                    navigate(item.url);
                  }
                }}
                title={collapsed ? item.title : undefined}
                className={cn(
                  "flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-colors",
                  collapsed && "justify-center px-0",
                  active || groupActive
                    ? "bg-nav-active text-nav-active-foreground"
                    : "text-sidebar-foreground hover:bg-sidebar-border/30"
                )}
              >
                <item.icon className="h-4 w-4 shrink-0" />
                {!collapsed && <span className="flex-1 text-left">{item.title}</span>}
                {!collapsed && hasChildren && (
                  <ChevronDown
                    className={cn(
                      "h-4 w-4 transition-transform",
                      open && "rotate-180"
                    )}
                  />
                )}
              </button>

              {/* Subcategories */}
              {!collapsed && hasChildren && open && (
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
      <div className="border-t border-sidebar-border px-2 py-4">
        <button
          onClick={() => navigate("/login")}
          title={collapsed ? "Logout" : undefined}
          className={cn(
            "flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium text-sidebar-foreground hover:bg-sidebar-border/30 transition-colors",
            collapsed && "justify-center px-0"
          )}
        >
          <LogOut className="h-4 w-4" />
          {!collapsed && <span>Logout</span>}
        </button>
      </div>
    </aside>
  );
}

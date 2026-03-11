import { NavLink } from "react-router-dom";
import {
  Building2,
  Home,
  DoorOpen,
  UserCircle,
  Receipt,
  CreditCard,
  LayoutDashboard,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useCondominium } from "@/context/CondominiumContext";
import { CondominiumSwitcher } from "@/components/CondominiumSwitcher";

/**
 * TEMP — replace later with AuthContext / JWT
 */
const currentUser = {
  role: "USER",
};

type NavItem = {
  name: string;
  href: string;
  icon: React.ElementType;
  requiresSuperAdmin?: boolean;
  exact?: boolean; // 👈 IMPORTANT
};

export function Sidebar() {
  const { condominiumId } = useCondominium();

  const navigation: NavItem[] = [
    {
      name: "Dashboard",
      href: "/",
      icon: LayoutDashboard,
      exact: true, // 👈 ONLY active on "/"
    },

    {
      name: "Companies",
      href: "/companies",
      icon: Building2,
      requiresSuperAdmin: true,
    },

    {
      name: "Condominiums",
      href: "/condominiums",
      icon: Home,
      exact: true, // 👈 NOT active on /condominiums/:id
    },

    ...(condominiumId
      ? [
          {
            name: "Overview",
            href: `/condominiums/${condominiumId}`,
            icon: LayoutDashboard,
            exact: true, // 👈 critical
          },
          {
            name: "Units",
            href: `/condominiums/${condominiumId}/units`,
            icon: DoorOpen,
            exact: true,
          },
          {
            name: "Owners",
            href: `/condominiums/${condominiumId}/owners`,
            icon: UserCircle,
            exact: true,
          },
          {
            name: "Expenses",
            href: `/condominiums/${condominiumId}/expenses`,
            icon: Receipt,
            exact: true,
          },
          {
            name: "Payments",
            href: `/condominiums/${condominiumId}/payments`,
            icon: CreditCard,
            exact: true,
          },
        ]
      : []),
  ];

  return (
    <aside className="w-64 bg-card border-r border-border flex flex-col">
      <div className="p-6 border-b border-border space-y-4">
        <h1 className="text-xl font-bold text-foreground flex items-center gap-2">
          <Building2 className="h-6 w-6 text-primary" />
          CondoAdmin
        </h1>

        <CondominiumSwitcher />
      </div>

      <nav className="flex-1 p-4 space-y-1">
        {navigation
          .filter(
            (item) =>
              !item.requiresSuperAdmin || currentUser.role === "SUPER_ADMIN"
          )
          .map((item) => (
            <NavLink
              key={item.name}
              to={item.href}
              end={item.exact}
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors",
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )
              }
            >
              <item.icon className="h-5 w-5" />
              {item.name}
            </NavLink>
          ))}
      </nav>

      <div className="p-4 border-t border-border">
        <p className="text-xs text-muted-foreground">MVP v1.0</p>
      </div>
    </aside>
  );
}

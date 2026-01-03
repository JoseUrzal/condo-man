import { NavLink } from 'react-router-dom';
import { 
  Building2, 
  Users, 
  Home, 
  DoorOpen, 
  UserCircle, 
  Receipt, 
  CreditCard,
  LayoutDashboard
} from 'lucide-react';
import { cn } from '@/lib/utils';

const navigation = [
  { name: 'Dashboard', href: '/', icon: LayoutDashboard },
  { name: 'Companies', href: '/companies', icon: Building2 },
  { name: 'Condominiums', href: '/condominiums', icon: Home },
  { name: 'Units', href: '/units', icon: DoorOpen },
  { name: 'Owners', href: '/owners', icon: UserCircle },
  { name: 'Expenses', href: '/expenses', icon: Receipt },
  { name: 'Payments', href: '/payments', icon: CreditCard },
];

export function Sidebar() {
  return (
    <aside className="w-64 bg-card border-r border-border flex flex-col">
      <div className="p-6 border-b border-border">
        <h1 className="text-xl font-bold text-foreground flex items-center gap-2">
          <Building2 className="h-6 w-6 text-primary" />
          CondoAdmin
        </h1>
      </div>
      <nav className="flex-1 p-4 space-y-1">
        {navigation.map((item) => (
          <NavLink
            key={item.name}
            to={item.href}
            end={item.href === '/'}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
                isActive
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground'
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

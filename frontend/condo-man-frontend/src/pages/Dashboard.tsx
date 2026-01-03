import { Building2, Home, Users, DoorOpen, Receipt, CreditCard } from 'lucide-react';
import { DashboardLayout } from '@/layouts/DashboardLayout';
import { StatCard } from '@/components/StatCard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

export default function Dashboard() {
  const navigate = useNavigate();

  const stats = [
    { title: 'Companies', value: 12, icon: Building2 },
    { title: 'Condominiums', value: 48, icon: Home },
    { title: 'Units', value: 524, icon: DoorOpen },
    { title: 'Owners', value: 892, icon: Users },
  ];

  const quickActions = [
    { label: 'Add Company', href: '/companies', icon: Building2 },
    { label: 'Add Condominium', href: '/condominiums', icon: Home },
    { label: 'Register Expense', href: '/expenses', icon: Receipt },
    { label: 'Record Payment', href: '/payments', icon: CreditCard },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground mt-1">
            Overview of your condominium management system
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat) => (
            <StatCard key={stat.title} {...stat} />
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-3">
                {quickActions.map((action) => (
                  <Button
                    key={action.label}
                    variant="outline"
                    className="h-auto py-4 flex flex-col gap-2"
                    onClick={() => navigate(action.href)}
                  >
                    <action.icon className="h-5 w-5" />
                    {action.label}
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center gap-4 p-3 rounded-lg bg-muted/50">
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <Receipt className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">New expense registered</p>
                    <p className="text-xs text-muted-foreground">Condominium Aurora - €450.00</p>
                  </div>
                  <span className="text-xs text-muted-foreground">2h ago</span>
                </div>
                <div className="flex items-center gap-4 p-3 rounded-lg bg-muted/50">
                  <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
                    <CreditCard className="h-5 w-5 text-green-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">Payment received</p>
                    <p className="text-xs text-muted-foreground">Unit 3A - €125.00</p>
                  </div>
                  <span className="text-xs text-muted-foreground">4h ago</span>
                </div>
                <div className="flex items-center gap-4 p-3 rounded-lg bg-muted/50">
                  <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                    <Users className="h-5 w-5 text-blue-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">New owner added</p>
                    <p className="text-xs text-muted-foreground">João Silva - Unit 5B</p>
                  </div>
                  <span className="text-xs text-muted-foreground">1d ago</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}

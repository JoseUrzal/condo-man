import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { DashboardLayout } from '@/layouts/DashboardLayout';
import { PageHeader } from '@/components/PageHeader';
import { DataTable, Column } from '@/components/DataTable';
import { StatusBadge } from '@/components/StatusBadge';
import { FormModal } from '@/components/FormModal';
import { ConfirmDialog } from '@/components/ConfirmDialog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { companiesService, usersService, condominiumsService } from '@/services';
import { Company, User, Condominium, CreateUserDto, CreateCondominiumDto, UserRole } from '@/types';
import { Building2, Users, Home, Mail, Phone, MapPin } from 'lucide-react';

export default function CompanyDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [company, setCompany] = useState<Company | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [condominiums, setCondominiums] = useState<Condominium[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // User modal state
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [userFormData, setUserFormData] = useState<CreateUserDto>({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    role: UserRole.MANAGER,
    isActive: true,
    companyId: id || '',
  });

  // Condominium modal state
  const [isCondoModalOpen, setIsCondoModalOpen] = useState(false);
  const [selectedCondo, setSelectedCondo] = useState<Condominium | null>(null);
  const [condoFormData, setCondoFormData] = useState<CreateCondominiumDto>({
    name: '',
    address: '',
    city: '',
    postalCode: '',
    totalUnits: 0,
    companyId: id || '',
  });

  // Delete state
  const [deleteType, setDeleteType] = useState<'user' | 'condo' | null>(null);
  const [itemToDelete, setItemToDelete] = useState<User | Condominium | null>(null);

  useEffect(() => {
    if (id) loadData();
  }, [id]);

  const loadData = async () => {
    try {
      const [companyData, usersData, condosData] = await Promise.all([
        companiesService.getById(id!),
        usersService.getByCompany(id!),
        condominiumsService.getByCompany(id!),
      ]);
      setCompany(companyData);
      setUsers(usersData);
      setCondominiums(condosData);
    } catch (error) {
      toast({ title: 'Error loading data', variant: 'destructive' });
    } finally {
      setIsLoading(false);
    }
  };

  // User handlers
  const handleUserSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (selectedUser) {
        await usersService.update(selectedUser.id, userFormData);
        toast({ title: 'User updated successfully' });
      } else {
        await usersService.create({ ...userFormData, companyId: id! });
        toast({ title: 'User created successfully' });
      }
      setIsUserModalOpen(false);
      resetUserForm();
      loadData();
    } catch (error) {
      toast({ title: 'Error saving user', variant: 'destructive' });
    }
  };

  const openEditUserModal = (user: User) => {
    setSelectedUser(user);
    setUserFormData({
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      password: '',
      role: user.role,
      isActive: user.isActive,
      companyId: id!,
    });
    setIsUserModalOpen(true);
  };

  const resetUserForm = () => {
    setSelectedUser(null);
    setUserFormData({
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      role: UserRole.MANAGER,
      isActive: true,
      companyId: id || '',
    });
  };

  // Condominium handlers
  const handleCondoSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (selectedCondo) {
        await condominiumsService.update(selectedCondo.id, condoFormData);
        toast({ title: 'Condominium updated successfully' });
      } else {
        await condominiumsService.create({ ...condoFormData, companyId: id! });
        toast({ title: 'Condominium created successfully' });
      }
      setIsCondoModalOpen(false);
      resetCondoForm();
      loadData();
    } catch (error) {
      toast({ title: 'Error saving condominium', variant: 'destructive' });
    }
  };

  const openEditCondoModal = (condo: Condominium) => {
    setSelectedCondo(condo);
    setCondoFormData({
      name: condo.name,
      address: condo.address,
      city: condo.city,
      postalCode: condo.postalCode,
      totalUnits: condo.totalUnits,
      companyId: id!,
    });
    setIsCondoModalOpen(true);
  };

  const resetCondoForm = () => {
    setSelectedCondo(null);
    setCondoFormData({
      name: '',
      address: '',
      city: '',
      postalCode: '',
      totalUnits: 0,
      companyId: id || '',
    });
  };

  // Delete handlers
  const handleDelete = async () => {
    try {
      if (deleteType === 'user' && itemToDelete) {
        await usersService.delete(itemToDelete.id);
        toast({ title: 'User deleted successfully' });
      } else if (deleteType === 'condo' && itemToDelete) {
        await condominiumsService.delete(itemToDelete.id);
        toast({ title: 'Condominium deleted successfully' });
      }
      setDeleteType(null);
      setItemToDelete(null);
      loadData();
    } catch (error) {
      toast({ title: 'Error deleting item', variant: 'destructive' });
    }
  };

  const userColumns: Column<User>[] = [
    {
      key: 'name',
      header: 'Name',
      render: (user) => `${user.firstName} ${user.lastName}`,
    },
    { key: 'email', header: 'Email' },
    {
      key: 'role',
      header: 'Role',
      render: (user) => (
        <Badge variant="outline">{user.role}</Badge>
      ),
    },
    {
      key: 'isActive',
      header: 'Status',
      render: (user) => <StatusBadge status={user.isActive} />,
    },
  ];

  const condoColumns: Column<Condominium>[] = [
    { key: 'name', header: 'Name' },
    { key: 'address', header: 'Address' },
    { key: 'city', header: 'City' },
    { key: 'totalUnits', header: 'Units' },
  ];

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </DashboardLayout>
    );
  }

  if (!company) {
    return (
      <DashboardLayout>
        <div className="text-center py-12">
          <p className="text-muted-foreground">Company not found</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <PageHeader title={company.name} subtitle="Company Details" showBack />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                <Building2 className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">VAT Number</p>
                <p className="font-semibold">{company.vatNumber}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                <Mail className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Email</p>
                <p className="font-semibold">{company.email}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                <Phone className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Phone</p>
                <p className="font-semibold">{company.phone}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="users" className="space-y-6">
        <TabsList>
          <TabsTrigger value="users" className="gap-2">
            <Users className="h-4 w-4" />
            Users ({users.length})
          </TabsTrigger>
          <TabsTrigger value="condominiums" className="gap-2">
            <Home className="h-4 w-4" />
            Condominiums ({condominiums.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="users">
          <div className="flex justify-end mb-4">
            <Button onClick={() => { resetUserForm(); setIsUserModalOpen(true); }}>
              Add User
            </Button>
          </div>
          <DataTable
            data={users}
            columns={userColumns}
            onEdit={openEditUserModal}
            onDelete={(user) => { setDeleteType('user'); setItemToDelete(user); }}
          />
        </TabsContent>

        <TabsContent value="condominiums">
          <div className="flex justify-end mb-4">
            <Button onClick={() => { resetCondoForm(); setIsCondoModalOpen(true); }}>
              Add Condominium
            </Button>
          </div>
          <DataTable
            data={condominiums}
            columns={condoColumns}
            onView={(condo) => navigate(`/condominiums/${condo.id}`)}
            onEdit={openEditCondoModal}
            onDelete={(condo) => { setDeleteType('condo'); setItemToDelete(condo); }}
          />
        </TabsContent>
      </Tabs>

      {/* User Modal */}
      <FormModal
        open={isUserModalOpen}
        onOpenChange={setIsUserModalOpen}
        title={selectedUser ? 'Edit User' : 'Add User'}
      >
        <form onSubmit={handleUserSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">First Name</Label>
              <Input
                id="firstName"
                value={userFormData.firstName}
                onChange={(e) => setUserFormData({ ...userFormData, firstName: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Last Name</Label>
              <Input
                id="lastName"
                value={userFormData.lastName}
                onChange={(e) => setUserFormData({ ...userFormData, lastName: e.target.value })}
                required
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="userEmail">Email</Label>
            <Input
              id="userEmail"
              type="email"
              value={userFormData.email}
              onChange={(e) => setUserFormData({ ...userFormData, email: e.target.value })}
              required
            />
          </div>
          {!selectedUser && (
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={userFormData.password}
                onChange={(e) => setUserFormData({ ...userFormData, password: e.target.value })}
                required
              />
            </div>
          )}
          <div className="space-y-2">
            <Label htmlFor="role">Role</Label>
            <Select
              value={userFormData.role}
              onValueChange={(value) => setUserFormData({ ...userFormData, role: value as UserRole })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={UserRole.ADMIN}>Admin</SelectItem>
                <SelectItem value={UserRole.MANAGER}>Manager</SelectItem>
                <SelectItem value={UserRole.ACCOUNTANT}>Accountant</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center gap-2">
            <Switch
              id="userIsActive"
              checked={userFormData.isActive}
              onCheckedChange={(checked) => setUserFormData({ ...userFormData, isActive: checked })}
            />
            <Label htmlFor="userIsActive">Active</Label>
          </div>
          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={() => setIsUserModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit">{selectedUser ? 'Update' : 'Create'}</Button>
          </div>
        </form>
      </FormModal>

      {/* Condominium Modal */}
      <FormModal
        open={isCondoModalOpen}
        onOpenChange={setIsCondoModalOpen}
        title={selectedCondo ? 'Edit Condominium' : 'Add Condominium'}
      >
        <form onSubmit={handleCondoSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="condoName">Name</Label>
            <Input
              id="condoName"
              value={condoFormData.name}
              onChange={(e) => setCondoFormData({ ...condoFormData, name: e.target.value })}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="condoAddress">Address</Label>
            <Input
              id="condoAddress"
              value={condoFormData.address}
              onChange={(e) => setCondoFormData({ ...condoFormData, address: e.target.value })}
              required
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="city">City</Label>
              <Input
                id="city"
                value={condoFormData.city}
                onChange={(e) => setCondoFormData({ ...condoFormData, city: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="postalCode">Postal Code</Label>
              <Input
                id="postalCode"
                value={condoFormData.postalCode}
                onChange={(e) => setCondoFormData({ ...condoFormData, postalCode: e.target.value })}
                required
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="totalUnits">Total Units</Label>
            <Input
              id="totalUnits"
              type="number"
              value={condoFormData.totalUnits}
              onChange={(e) => setCondoFormData({ ...condoFormData, totalUnits: parseInt(e.target.value) || 0 })}
              required
            />
          </div>
          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={() => setIsCondoModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit">{selectedCondo ? 'Update' : 'Create'}</Button>
          </div>
        </form>
      </FormModal>

      {/* Delete Confirmation */}
      <ConfirmDialog
        open={deleteType !== null}
        onOpenChange={() => { setDeleteType(null); setItemToDelete(null); }}
        title={`Delete ${deleteType === 'user' ? 'User' : 'Condominium'}`}
        description={`Are you sure you want to delete this ${deleteType}? This action cannot be undone.`}
        onConfirm={handleDelete}
        confirmLabel="Delete"
        variant="destructive"
      />
    </DashboardLayout>
  );
}

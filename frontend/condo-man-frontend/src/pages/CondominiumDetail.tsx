import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { DashboardLayout } from '@/layouts/DashboardLayout';
import { PageHeader } from '@/components/PageHeader';
import { DataTable, Column } from '@/components/DataTable';
import { FormModal } from '@/components/FormModal';
import { ConfirmDialog } from '@/components/ConfirmDialog';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { condominiumsService, unitsService, ownersService, expensesService } from '@/services';
import { Condominium, Unit, Owner, Expense, CreateUnitDto, CreateOwnerDto, CreateExpenseDto, ExpenseType } from '@/types';
import { Home, DoorOpen, UserCircle, Receipt, MapPin, Building2 } from 'lucide-react';

export default function CondominiumDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [condominium, setCondominium] = useState<Condominium | null>(null);
  const [units, setUnits] = useState<Unit[]>([]);
  const [owners, setOwners] = useState<Owner[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Unit modal
  const [isUnitModalOpen, setIsUnitModalOpen] = useState(false);
  const [selectedUnit, setSelectedUnit] = useState<Unit | null>(null);
  const [unitFormData, setUnitFormData] = useState<CreateUnitDto>({
    doorNumber: '',
    floor: '',
    typology: '',
    permillage: 0,
    condominiumId: id || '',
  });

  // Owner modal
  const [isOwnerModalOpen, setIsOwnerModalOpen] = useState(false);
  const [selectedOwner, setSelectedOwner] = useState<Owner | null>(null);
  const [ownerFormData, setOwnerFormData] = useState<CreateOwnerDto>({
    name: '',
    email: '',
    phone: '',
    taxNumber: '',
  });

  // Expense modal
  const [isExpenseModalOpen, setIsExpenseModalOpen] = useState(false);
  const [selectedExpense, setSelectedExpense] = useState<Expense | null>(null);
  const [expenseFormData, setExpenseFormData] = useState<CreateExpenseDto>({
    title: '',
    description: '',
    amount: 0,
    date: new Date().toISOString().split('T')[0],
    type: ExpenseType.MAINTENANCE,
    condominiumId: id || '',
  });

  // Delete state
  const [deleteType, setDeleteType] = useState<'unit' | 'owner' | 'expense' | null>(null);
  const [itemToDelete, setItemToDelete] = useState<Unit | Owner | Expense | null>(null);

  useEffect(() => {
    if (id) loadData();
  }, [id]);

  const loadData = async () => {
    try {
      const [condoData, unitsData, ownersData, expensesData] = await Promise.all([
        condominiumsService.getById(id!),
        unitsService.getByCondominium(id!),
        ownersService.getAll(),
        expensesService.getByCondominium(id!),
      ]);
      setCondominium(condoData);
      setUnits(unitsData);
      setOwners(ownersData);
      setExpenses(expensesData);
    } catch (error) {
      toast({ title: 'Error loading data', variant: 'destructive' });
    } finally {
      setIsLoading(false);
    }
  };

  // Unit handlers
  const handleUnitSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (selectedUnit) {
        await unitsService.update(selectedUnit.id, unitFormData);
        toast({ title: 'Unit updated successfully' });
      } else {
        await unitsService.create({ ...unitFormData, condominiumId: id! });
        toast({ title: 'Unit created successfully' });
      }
      setIsUnitModalOpen(false);
      resetUnitForm();
      loadData();
    } catch (error) {
      toast({ title: 'Error saving unit', variant: 'destructive' });
    }
  };

  const resetUnitForm = () => {
    setSelectedUnit(null);
    setUnitFormData({
      doorNumber: '',
      floor: '',
      typology: '',
      permillage: 0,
      condominiumId: id || '',
    });
  };

  // Owner handlers
  const handleOwnerSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (selectedOwner) {
        await ownersService.update(selectedOwner.id, ownerFormData);
        toast({ title: 'Owner updated successfully' });
      } else {
        await ownersService.create(ownerFormData);
        toast({ title: 'Owner created successfully' });
      }
      setIsOwnerModalOpen(false);
      resetOwnerForm();
      loadData();
    } catch (error) {
      toast({ title: 'Error saving owner', variant: 'destructive' });
    }
  };

  const resetOwnerForm = () => {
    setSelectedOwner(null);
    setOwnerFormData({ name: '', email: '', phone: '', taxNumber: '' });
  };

  // Expense handlers
  const handleExpenseSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (selectedExpense) {
        await expensesService.update(selectedExpense.id, expenseFormData);
        toast({ title: 'Expense updated successfully' });
      } else {
        await expensesService.create({ ...expenseFormData, condominiumId: id! });
        toast({ title: 'Expense created successfully' });
      }
      setIsExpenseModalOpen(false);
      resetExpenseForm();
      loadData();
    } catch (error) {
      toast({ title: 'Error saving expense', variant: 'destructive' });
    }
  };

  const resetExpenseForm = () => {
    setSelectedExpense(null);
    setExpenseFormData({
      title: '',
      description: '',
      amount: 0,
      date: new Date().toISOString().split('T')[0],
      type: ExpenseType.MAINTENANCE,
      condominiumId: id || '',
    });
  };

  // Delete handler
  const handleDelete = async () => {
    try {
      if (deleteType === 'unit' && itemToDelete) {
        await unitsService.delete(itemToDelete.id);
      } else if (deleteType === 'owner' && itemToDelete) {
        await ownersService.delete(itemToDelete.id);
      } else if (deleteType === 'expense' && itemToDelete) {
        await expensesService.delete(itemToDelete.id);
      }
      toast({ title: 'Deleted successfully' });
      setDeleteType(null);
      setItemToDelete(null);
      loadData();
    } catch (error) {
      toast({ title: 'Error deleting', variant: 'destructive' });
    }
  };

  const unitColumns: Column<Unit>[] = [
    { key: 'doorNumber', header: 'Door' },
    { key: 'floor', header: 'Floor' },
    { key: 'typology', header: 'Typology' },
    { key: 'permillage', header: 'Permillage (‰)' },
  ];

  const ownerColumns: Column<Owner>[] = [
    { key: 'name', header: 'Name' },
    { key: 'email', header: 'Email' },
    { key: 'phone', header: 'Phone' },
    { key: 'taxNumber', header: 'Tax Number' },
  ];

  const expenseColumns: Column<Expense>[] = [
    { key: 'title', header: 'Title' },
    { key: 'type', header: 'Type', render: (e) => <Badge variant="outline">{e.type}</Badge> },
    { key: 'amount', header: 'Amount', render: (e) => `€${e.amount.toFixed(2)}` },
    { key: 'date', header: 'Date', render: (e) => new Date(e.date).toLocaleDateString() },
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

  if (!condominium) {
    return (
      <DashboardLayout>
        <div className="text-center py-12 text-muted-foreground">Condominium not found</div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <PageHeader title={condominium.name} subtitle="Condominium Details" showBack />

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <MapPin className="h-5 w-5 text-primary" />
            <div>
              <p className="text-xs text-muted-foreground">Address</p>
              <p className="text-sm font-medium">{condominium.address}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <Building2 className="h-5 w-5 text-primary" />
            <div>
              <p className="text-xs text-muted-foreground">City</p>
              <p className="text-sm font-medium">{condominium.city}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <Home className="h-5 w-5 text-primary" />
            <div>
              <p className="text-xs text-muted-foreground">Postal Code</p>
              <p className="text-sm font-medium">{condominium.postalCode}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <DoorOpen className="h-5 w-5 text-primary" />
            <div>
              <p className="text-xs text-muted-foreground">Total Units</p>
              <p className="text-sm font-medium">{condominium.totalUnits}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="units" className="space-y-6">
        <TabsList>
          <TabsTrigger value="units" className="gap-2">
            <DoorOpen className="h-4 w-4" />
            Units ({units.length})
          </TabsTrigger>
          <TabsTrigger value="owners" className="gap-2">
            <UserCircle className="h-4 w-4" />
            Owners ({owners.length})
          </TabsTrigger>
          <TabsTrigger value="expenses" className="gap-2">
            <Receipt className="h-4 w-4" />
            Expenses ({expenses.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="units">
          <div className="flex justify-end mb-4">
            <Button onClick={() => { resetUnitForm(); setIsUnitModalOpen(true); }}>Add Unit</Button>
          </div>
          <DataTable
            data={units}
            columns={unitColumns}
            onView={(unit) => navigate(`/units/${unit.id}`)}
            onEdit={(unit) => {
              setSelectedUnit(unit);
              setUnitFormData({
                doorNumber: unit.doorNumber,
                floor: unit.floor,
                typology: unit.typology,
                permillage: unit.permillage,
                condominiumId: id!,
              });
              setIsUnitModalOpen(true);
            }}
            onDelete={(unit) => { setDeleteType('unit'); setItemToDelete(unit); }}
          />
        </TabsContent>

        <TabsContent value="owners">
          <div className="flex justify-end mb-4">
            <Button onClick={() => { resetOwnerForm(); setIsOwnerModalOpen(true); }}>Add Owner</Button>
          </div>
          <DataTable
            data={owners}
            columns={ownerColumns}
            onEdit={(owner) => {
              setSelectedOwner(owner);
              setOwnerFormData({
                name: owner.name,
                email: owner.email || '',
                phone: owner.phone || '',
                taxNumber: owner.taxNumber || '',
              });
              setIsOwnerModalOpen(true);
            }}
            onDelete={(owner) => { setDeleteType('owner'); setItemToDelete(owner); }}
          />
        </TabsContent>

        <TabsContent value="expenses">
          <div className="flex justify-end mb-4">
            <Button onClick={() => { resetExpenseForm(); setIsExpenseModalOpen(true); }}>Add Expense</Button>
          </div>
          <DataTable
            data={expenses}
            columns={expenseColumns}
            onEdit={(expense) => {
              setSelectedExpense(expense);
              setExpenseFormData({
                title: expense.title,
                description: expense.description,
                amount: expense.amount,
                date: expense.date.split('T')[0],
                type: expense.type,
                condominiumId: id!,
              });
              setIsExpenseModalOpen(true);
            }}
            onDelete={(expense) => { setDeleteType('expense'); setItemToDelete(expense); }}
          />
        </TabsContent>
      </Tabs>

      {/* Unit Modal */}
      <FormModal open={isUnitModalOpen} onOpenChange={setIsUnitModalOpen} title={selectedUnit ? 'Edit Unit' : 'Add Unit'}>
        <form onSubmit={handleUnitSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Door Number</Label>
              <Input value={unitFormData.doorNumber} onChange={(e) => setUnitFormData({ ...unitFormData, doorNumber: e.target.value })} required />
            </div>
            <div className="space-y-2">
              <Label>Floor</Label>
              <Input value={unitFormData.floor} onChange={(e) => setUnitFormData({ ...unitFormData, floor: e.target.value })} required />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Typology</Label>
              <Input value={unitFormData.typology} onChange={(e) => setUnitFormData({ ...unitFormData, typology: e.target.value })} required placeholder="e.g. T2, T3" />
            </div>
            <div className="space-y-2">
              <Label>Permillage (‰)</Label>
              <Input type="number" step="0.01" value={unitFormData.permillage} onChange={(e) => setUnitFormData({ ...unitFormData, permillage: parseFloat(e.target.value) || 0 })} required />
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={() => setIsUnitModalOpen(false)}>Cancel</Button>
            <Button type="submit">{selectedUnit ? 'Update' : 'Create'}</Button>
          </div>
        </form>
      </FormModal>

      {/* Owner Modal */}
      <FormModal open={isOwnerModalOpen} onOpenChange={setIsOwnerModalOpen} title={selectedOwner ? 'Edit Owner' : 'Add Owner'}>
        <form onSubmit={handleOwnerSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label>Name</Label>
            <Input value={ownerFormData.name} onChange={(e) => setOwnerFormData({ ...ownerFormData, name: e.target.value })} required />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Email</Label>
              <Input type="email" value={ownerFormData.email} onChange={(e) => setOwnerFormData({ ...ownerFormData, email: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label>Phone</Label>
              <Input value={ownerFormData.phone} onChange={(e) => setOwnerFormData({ ...ownerFormData, phone: e.target.value })} />
            </div>
          </div>
          <div className="space-y-2">
            <Label>Tax Number</Label>
            <Input value={ownerFormData.taxNumber} onChange={(e) => setOwnerFormData({ ...ownerFormData, taxNumber: e.target.value })} />
          </div>
          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={() => setIsOwnerModalOpen(false)}>Cancel</Button>
            <Button type="submit">{selectedOwner ? 'Update' : 'Create'}</Button>
          </div>
        </form>
      </FormModal>

      {/* Expense Modal */}
      <FormModal open={isExpenseModalOpen} onOpenChange={setIsExpenseModalOpen} title={selectedExpense ? 'Edit Expense' : 'Add Expense'}>
        <form onSubmit={handleExpenseSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label>Title</Label>
            <Input value={expenseFormData.title} onChange={(e) => setExpenseFormData({ ...expenseFormData, title: e.target.value })} required />
          </div>
          <div className="space-y-2">
            <Label>Description</Label>
            <Input value={expenseFormData.description} onChange={(e) => setExpenseFormData({ ...expenseFormData, description: e.target.value })} required />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Amount (€)</Label>
              <Input type="number" step="0.01" value={expenseFormData.amount} onChange={(e) => setExpenseFormData({ ...expenseFormData, amount: parseFloat(e.target.value) || 0 })} required />
            </div>
            <div className="space-y-2">
              <Label>Date</Label>
              <Input type="date" value={expenseFormData.date} onChange={(e) => setExpenseFormData({ ...expenseFormData, date: e.target.value })} required />
            </div>
          </div>
          <div className="space-y-2">
            <Label>Type</Label>
            <Select value={expenseFormData.type} onValueChange={(v) => setExpenseFormData({ ...expenseFormData, type: v as ExpenseType })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value={ExpenseType.MAINTENANCE}>Maintenance</SelectItem>
                <SelectItem value={ExpenseType.UTILITIES}>Utilities</SelectItem>
                <SelectItem value={ExpenseType.INSURANCE}>Insurance</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={() => setIsExpenseModalOpen(false)}>Cancel</Button>
            <Button type="submit">{selectedExpense ? 'Update' : 'Create'}</Button>
          </div>
        </form>
      </FormModal>

      <ConfirmDialog
        open={deleteType !== null}
        onOpenChange={() => { setDeleteType(null); setItemToDelete(null); }}
        title={`Delete ${deleteType}`}
        description="This action cannot be undone."
        onConfirm={handleDelete}
        confirmLabel="Delete"
        variant="destructive"
      />
    </DashboardLayout>
  );
}

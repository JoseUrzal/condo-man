import { useState, useEffect } from 'react';
import { DashboardLayout } from '@/layouts/DashboardLayout';
import { PageHeader } from '@/components/PageHeader';
import { DataTable, Column } from '@/components/DataTable';
import { StatusBadge } from '@/components/StatusBadge';
import { FormModal } from '@/components/FormModal';
import { ConfirmDialog } from '@/components/ConfirmDialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { expensesService, condominiumsService } from '@/services';
import { Expense, Condominium, CreateExpenseDto, ExpenseType } from '@/types';

export default function Expenses() {
  const { toast } = useToast();
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [condominiums, setCondominiums] = useState<Condominium[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedExpense, setSelectedExpense] = useState<Expense | null>(null);
  const [formData, setFormData] = useState<CreateExpenseDto>({
    title: '',
    description: '',
    amount: 0,
    date: new Date().toISOString().split('T')[0],
    type: ExpenseType.MAINTENANCE,
    condominiumId: '',
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [expensesData, condosData] = await Promise.all([
        expensesService.getAll(),
        condominiumsService.getAll(),
      ]);
      setExpenses(expensesData);
      setCondominiums(condosData);
    } catch (error) {
      toast({ title: 'Error loading data', variant: 'destructive' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (selectedExpense) {
        await expensesService.update(selectedExpense.id, formData);
        toast({ title: 'Expense updated successfully' });
      } else {
        await expensesService.create(formData);
        toast({ title: 'Expense created successfully' });
      }
      setIsModalOpen(false);
      resetForm();
      loadData();
    } catch (error) {
      toast({ title: 'Error saving expense', variant: 'destructive' });
    }
  };

  const handleDelete = async () => {
    if (!selectedExpense) return;
    try {
      await expensesService.delete(selectedExpense.id);
      toast({ title: 'Expense deleted successfully' });
      setIsDeleteOpen(false);
      setSelectedExpense(null);
      loadData();
    } catch (error) {
      toast({ title: 'Error deleting expense', variant: 'destructive' });
    }
  };

  const openEditModal = (expense: Expense) => {
    setSelectedExpense(expense);
    setFormData({
      title: expense.title,
      description: expense.description,
      amount: expense.amount,
      date: expense.date.split('T')[0],
      type: expense.type,
      condominiumId: expense.condominiumId,
    });
    setIsModalOpen(true);
  };

  const resetForm = () => {
    setSelectedExpense(null);
    setFormData({
      title: '',
      description: '',
      amount: 0,
      date: new Date().toISOString().split('T')[0],
      type: ExpenseType.MAINTENANCE,
      condominiumId: '',
    });
  };

  const columns: Column<Expense>[] = [
    { key: 'title', header: 'Title' },
    { key: 'type', header: 'Type', render: (e) => <Badge variant="outline">{e.type}</Badge> },
    { key: 'amount', header: 'Amount', render: (e) => `€${e.amount.toFixed(2)}` },
    { key: 'date', header: 'Date', render: (e) => new Date(e.date).toLocaleDateString() },
  ];

  return (
    <DashboardLayout>
      <PageHeader
        title="Expenses"
        subtitle="Track all expenses"
        onAdd={() => { resetForm(); setIsModalOpen(true); }}
        addLabel="Add Expense"
      />

      <DataTable
        data={expenses}
        columns={columns}
        isLoading={isLoading}
        onEdit={openEditModal}
        onDelete={(expense) => { setSelectedExpense(expense); setIsDeleteOpen(true); }}
      />

      <FormModal open={isModalOpen} onOpenChange={setIsModalOpen} title={selectedExpense ? 'Edit Expense' : 'Add Expense'}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label>Condominium</Label>
            <Select value={formData.condominiumId} onValueChange={(v) => setFormData({ ...formData, condominiumId: v })}>
              <SelectTrigger><SelectValue placeholder="Select condominium" /></SelectTrigger>
              <SelectContent>
                {condominiums.map((c) => (
                  <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Title</Label>
            <Input value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} required />
          </div>
          <div className="space-y-2">
            <Label>Description</Label>
            <Input value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} required />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Amount (€)</Label>
              <Input type="number" step="0.01" value={formData.amount} onChange={(e) => setFormData({ ...formData, amount: parseFloat(e.target.value) || 0 })} required />
            </div>
            <div className="space-y-2">
              <Label>Date</Label>
              <Input type="date" value={formData.date} onChange={(e) => setFormData({ ...formData, date: e.target.value })} required />
            </div>
          </div>
          <div className="space-y-2">
            <Label>Type</Label>
            <Select value={formData.type} onValueChange={(v) => setFormData({ ...formData, type: v as ExpenseType })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value={ExpenseType.MAINTENANCE}>Maintenance</SelectItem>
                <SelectItem value={ExpenseType.UTILITIES}>Utilities</SelectItem>
                <SelectItem value={ExpenseType.INSURANCE}>Insurance</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button type="submit">{selectedExpense ? 'Update' : 'Create'}</Button>
          </div>
        </form>
      </FormModal>

      <ConfirmDialog
        open={isDeleteOpen}
        onOpenChange={setIsDeleteOpen}
        title="Delete Expense"
        description={`Are you sure you want to delete "${selectedExpense?.title}"?`}
        onConfirm={handleDelete}
        confirmLabel="Delete"
        variant="destructive"
      />
    </DashboardLayout>
  );
}

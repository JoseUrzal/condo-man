import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { DashboardLayout } from '@/layouts/DashboardLayout';
import { PageHeader } from '@/components/PageHeader';
import { DataTable, Column } from '@/components/DataTable';
import { StatusBadge } from '@/components/StatusBadge';
import { FormModal } from '@/components/FormModal';
import { ConfirmDialog } from '@/components/ConfirmDialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { companiesService } from '@/services';
import { Company, CreateCompanyDto } from '@/types';

export default function Companies() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [companies, setCompanies] = useState<Company[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);
  const [formData, setFormData] = useState<CreateCompanyDto>({
    name: '',
    vatNumber: '',
    email: '',
    phone: '',
    address: '',
    isActive: true,
  });

  useEffect(() => {
    loadCompanies();
  }, []);

  const loadCompanies = async () => {
    try {
      const data = await companiesService.getAll();
      setCompanies(data);
    } catch (error) {
      toast({ title: 'Error loading companies', variant: 'destructive' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (selectedCompany) {
        await companiesService.update(selectedCompany.id, formData);
        toast({ title: 'Company updated successfully' });
      } else {
        await companiesService.create(formData);
        toast({ title: 'Company created successfully' });
      }
      setIsModalOpen(false);
      resetForm();
      loadCompanies();
    } catch (error) {
      toast({ title: 'Error saving company', variant: 'destructive' });
    }
  };

  const handleDelete = async () => {
    if (!selectedCompany) return;
    try {
      await companiesService.delete(selectedCompany.id);
      toast({ title: 'Company deleted successfully' });
      setIsDeleteOpen(false);
      setSelectedCompany(null);
      loadCompanies();
    } catch (error) {
      toast({ title: 'Error deleting company', variant: 'destructive' });
    }
  };

  const openEditModal = (company: Company) => {
    setSelectedCompany(company);
    setFormData({
      name: company.name,
      vatNumber: company.vatNumber,
      email: company.email,
      phone: company.phone,
      address: company.address,
      isActive: company.isActive,
    });
    setIsModalOpen(true);
  };

  const openDeleteDialog = (company: Company) => {
    setSelectedCompany(company);
    setIsDeleteOpen(true);
  };

  const resetForm = () => {
    setSelectedCompany(null);
    setFormData({
      name: '',
      vatNumber: '',
      email: '',
      phone: '',
      address: '',
      isActive: true,
    });
  };

  const columns: Column<Company>[] = [
    { key: 'name', header: 'Name' },
    { key: 'vatNumber', header: 'VAT Number' },
    { key: 'email', header: 'Email' },
    { key: 'phone', header: 'Phone' },
    {
      key: 'isActive',
      header: 'Status',
      render: (company) => <StatusBadge status={company.isActive} />,
    },
  ];

  return (
    <DashboardLayout>
      <PageHeader
        title="Companies"
        subtitle="Manage your management companies"
        onAdd={() => {
          resetForm();
          setIsModalOpen(true);
        }}
        addLabel="Add Company"
      />

      <DataTable
        data={companies}
        columns={columns}
        isLoading={isLoading}
        onView={(company) => navigate(`/companies/${company.id}`)}
        onEdit={openEditModal}
        onDelete={openDeleteDialog}
      />

      <FormModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        title={selectedCompany ? 'Edit Company' : 'Add Company'}
        description="Fill in the company details below."
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="vatNumber">VAT Number</Label>
            <Input
              id="vatNumber"
              value={formData.vatNumber}
              onChange={(e) => setFormData({ ...formData, vatNumber: e.target.value })}
              required
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                required
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="address">Address</Label>
            <Input
              id="address"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              required
            />
          </div>
          <div className="flex items-center gap-2">
            <Switch
              id="isActive"
              checked={formData.isActive}
              onCheckedChange={(checked) => setFormData({ ...formData, isActive: checked })}
            />
            <Label htmlFor="isActive">Active</Label>
          </div>
          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit">
              {selectedCompany ? 'Update' : 'Create'}
            </Button>
          </div>
        </form>
      </FormModal>

      <ConfirmDialog
        open={isDeleteOpen}
        onOpenChange={setIsDeleteOpen}
        title="Delete Company"
        description={`Are you sure you want to delete "${selectedCompany?.name}"? This action cannot be undone.`}
        onConfirm={handleDelete}
        confirmLabel="Delete"
        variant="destructive"
      />
    </DashboardLayout>
  );
}

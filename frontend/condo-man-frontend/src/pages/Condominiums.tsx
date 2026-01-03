import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { DashboardLayout } from '@/layouts/DashboardLayout';
import { PageHeader } from '@/components/PageHeader';
import { DataTable, Column } from '@/components/DataTable';
import { FormModal } from '@/components/FormModal';
import { ConfirmDialog } from '@/components/ConfirmDialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { condominiumsService, companiesService } from '@/services';
import { Condominium, Company, CreateCondominiumDto } from '@/types';

export default function Condominiums() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [condominiums, setCondominiums] = useState<Condominium[]>([]);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedCondo, setSelectedCondo] = useState<Condominium | null>(null);
  const [formData, setFormData] = useState<CreateCondominiumDto>({
    name: '',
    address: '',
    city: '',
    postalCode: '',
    totalUnits: 0,
    companyId: '',
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [condosData, companiesData] = await Promise.all([
        condominiumsService.getAll(),
        companiesService.getAll(),
      ]);
      setCondominiums(condosData);
      setCompanies(companiesData);
    } catch (error) {
      toast({ title: 'Error loading data', variant: 'destructive' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (selectedCondo) {
        await condominiumsService.update(selectedCondo.id, formData);
        toast({ title: 'Condominium updated successfully' });
      } else {
        await condominiumsService.create(formData);
        toast({ title: 'Condominium created successfully' });
      }
      setIsModalOpen(false);
      resetForm();
      loadData();
    } catch (error) {
      toast({ title: 'Error saving condominium', variant: 'destructive' });
    }
  };

  const handleDelete = async () => {
    if (!selectedCondo) return;
    try {
      await condominiumsService.delete(selectedCondo.id);
      toast({ title: 'Condominium deleted successfully' });
      setIsDeleteOpen(false);
      setSelectedCondo(null);
      loadData();
    } catch (error) {
      toast({ title: 'Error deleting condominium', variant: 'destructive' });
    }
  };

  const openEditModal = (condo: Condominium) => {
    setSelectedCondo(condo);
    setFormData({
      name: condo.name,
      address: condo.address,
      city: condo.city,
      postalCode: condo.postalCode,
      totalUnits: condo.totalUnits,
      companyId: condo.companyId,
    });
    setIsModalOpen(true);
  };

  const resetForm = () => {
    setSelectedCondo(null);
    setFormData({
      name: '',
      address: '',
      city: '',
      postalCode: '',
      totalUnits: 0,
      companyId: '',
    });
  };

  const columns: Column<Condominium>[] = [
    { key: 'name', header: 'Name' },
    { key: 'address', header: 'Address' },
    { key: 'city', header: 'City' },
    { key: 'postalCode', header: 'Postal Code' },
    { key: 'totalUnits', header: 'Units' },
  ];

  return (
    <DashboardLayout>
      <PageHeader
        title="Condominiums"
        subtitle="Manage all condominiums"
        onAdd={() => {
          resetForm();
          setIsModalOpen(true);
        }}
        addLabel="Add Condominium"
      />

      <DataTable
        data={condominiums}
        columns={columns}
        isLoading={isLoading}
        onView={(condo) => navigate(`/condominiums/${condo.id}`)}
        onEdit={openEditModal}
        onDelete={(condo) => {
          setSelectedCondo(condo);
          setIsDeleteOpen(true);
        }}
      />

      <FormModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        title={selectedCondo ? 'Edit Condominium' : 'Add Condominium'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="company">Company</Label>
            <Select
              value={formData.companyId}
              onValueChange={(value) => setFormData({ ...formData, companyId: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select company" />
              </SelectTrigger>
              <SelectContent>
                {companies.map((company) => (
                  <SelectItem key={company.id} value={company.id}>
                    {company.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
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
            <Label htmlFor="address">Address</Label>
            <Input
              id="address"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              required
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="city">City</Label>
              <Input
                id="city"
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="postalCode">Postal Code</Label>
              <Input
                id="postalCode"
                value={formData.postalCode}
                onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })}
                required
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="totalUnits">Total Units</Label>
            <Input
              id="totalUnits"
              type="number"
              value={formData.totalUnits}
              onChange={(e) => setFormData({ ...formData, totalUnits: parseInt(e.target.value) || 0 })}
              required
            />
          </div>
          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit">{selectedCondo ? 'Update' : 'Create'}</Button>
          </div>
        </form>
      </FormModal>

      <ConfirmDialog
        open={isDeleteOpen}
        onOpenChange={setIsDeleteOpen}
        title="Delete Condominium"
        description={`Are you sure you want to delete "${selectedCondo?.name}"?`}
        onConfirm={handleDelete}
        confirmLabel="Delete"
        variant="destructive"
      />
    </DashboardLayout>
  );
}

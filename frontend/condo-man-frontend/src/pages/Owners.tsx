import { useState, useEffect } from "react";
import { DashboardLayout } from "@/layouts/DashboardLayout";
import { PageHeader } from "@/components/PageHeader";
import { DataTable, Column } from "@/components/DataTable";
import { FormModal } from "@/components/FormModal";
import { ConfirmDialog } from "@/components/ConfirmDialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { ownersService } from "@/services";
import { Owner, CreateOwnerDto } from "@/types";
import { useCondominium } from "@/context/CondominiumContext";

export default function Owners() {
  const { toast } = useToast();
  const [owners, setOwners] = useState<Owner[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedOwner, setSelectedOwner] = useState<Owner | null>(null);
  const [formData, setFormData] = useState<CreateOwnerDto>({
    name: "",
    email: "",
    phone: "",
    taxNumber: "",
  });

  const { condominiumId } = useCondominium();

  useEffect(() => {
    if (!condominiumId) return;

    ownersService.getAll({ condominiumId }).then(setOwners);
  }, [condominiumId]);

  if (!condominiumId) {
    return <div>No condominium selected</div>;
  }

  useEffect(() => {
    loadOwners();
  }, []);

  const loadOwners = async () => {
    try {
      const data = await ownersService.getAll();
      setOwners(data);
    } catch (error) {
      toast({ title: "Error loading owners", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (selectedOwner) {
        await ownersService.update(selectedOwner.id, formData);
        toast({ title: "Owner updated successfully" });
      } else {
        await ownersService.create(formData);
        toast({ title: "Owner created successfully" });
      }
      setIsModalOpen(false);
      resetForm();
      loadOwners();
    } catch (error) {
      toast({ title: "Error saving owner", variant: "destructive" });
    }
  };

  const handleDelete = async () => {
    if (!selectedOwner) return;
    try {
      await ownersService.delete(selectedOwner.id);
      toast({ title: "Owner deleted successfully" });
      setIsDeleteOpen(false);
      setSelectedOwner(null);
      loadOwners();
    } catch (error) {
      toast({ title: "Error deleting owner", variant: "destructive" });
    }
  };

  const openEditModal = (owner: Owner) => {
    setSelectedOwner(owner);
    setFormData({
      name: owner.name,
      email: owner.email || "",
      phone: owner.phone || "",
      taxNumber: owner.taxNumber || "",
    });
    setIsModalOpen(true);
  };

  const resetForm = () => {
    setSelectedOwner(null);
    setFormData({ name: "", email: "", phone: "", taxNumber: "" });
  };

  const columns: Column<Owner>[] = [
    { key: "name", header: "Name" },
    { key: "email", header: "Email", render: (o) => o.email || "-" },
    { key: "phone", header: "Phone", render: (o) => o.phone || "-" },
    {
      key: "taxNumber",
      header: "Tax Number",
      render: (o) => o.taxNumber || "-",
    },
  ];

  return (
    <DashboardLayout>
      <PageHeader
        title="Owners"
        subtitle="Manage property owners"
        onAdd={() => {
          resetForm();
          setIsModalOpen(true);
        }}
        addLabel="Add Owner"
      />

      <DataTable
        data={owners}
        columns={columns}
        isLoading={isLoading}
        onEdit={openEditModal}
        onDelete={(owner) => {
          setSelectedOwner(owner);
          setIsDeleteOpen(true);
        }}
      />

      <FormModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        title={selectedOwner ? "Edit Owner" : "Add Owner"}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label>Name</Label>
            <Input
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              required
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Email</Label>
              <Input
                type="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <Label>Phone</Label>
              <Input
                value={formData.phone}
                onChange={(e) =>
                  setFormData({ ...formData, phone: e.target.value })
                }
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label>Tax Number</Label>
            <Input
              value={formData.taxNumber}
              onChange={(e) =>
                setFormData({ ...formData, taxNumber: e.target.value })
              }
            />
          </div>
          <div className="flex justify-end gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsModalOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit">{selectedOwner ? "Update" : "Create"}</Button>
          </div>
        </form>
      </FormModal>

      <ConfirmDialog
        open={isDeleteOpen}
        onOpenChange={setIsDeleteOpen}
        title="Delete Owner"
        description={`Are you sure you want to delete "${selectedOwner?.name}"?`}
        onConfirm={handleDelete}
        confirmLabel="Delete"
        variant="destructive"
      />
    </DashboardLayout>
  );
}

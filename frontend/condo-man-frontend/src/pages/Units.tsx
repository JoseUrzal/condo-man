import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { DashboardLayout } from "@/layouts/DashboardLayout";
import { PageHeader } from "@/components/PageHeader";
import { DataTable, Column } from "@/components/DataTable";
import { FormModal } from "@/components/FormModal";
import { ConfirmDialog } from "@/components/ConfirmDialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { unitsService, condominiumsService } from "@/services";
import { Unit, Condominium, CreateUnitDto } from "@/types";
import { useCondominium } from "@/context/CondominiumContext";

export default function Units() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [units, setUnits] = useState<Unit[]>([]);
  const [condominiums, setCondominiums] = useState<Condominium[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedUnit, setSelectedUnit] = useState<Unit | null>(null);
  const [formData, setFormData] = useState<CreateUnitDto>({
    doorNumber: "",
    floor: "",
    typology: "",
    permillage: 0,
    condominiumId: "",
  });

const { condominiumId } = useCondominium();


  useEffect(() => {
    if (!condominiumId) return;

    unitsService.getAll({ condominiumId }).then(setUnits);
  }, [condominiumId]);

  if (!condominiumId) {
    return <div>No condominium selected</div>;
  }

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [unitsData, condosData] = await Promise.all([
        unitsService.getAll({ condominiumId }),
        condominiumsService.getAll(),
      ]);
      setUnits(unitsData);
      setCondominiums(condosData);
    } catch (error) {
      toast({ title: "Error loading data", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (selectedUnit) {
        await unitsService.update(selectedUnit.id, formData);
        toast({ title: "Unit updated successfully" });
      } else {
        await unitsService.create(formData);
        toast({ title: "Unit created successfully" });
      }
      setIsModalOpen(false);
      resetForm();
      loadData();
    } catch (error) {
      toast({ title: "Error saving unit", variant: "destructive" });
    }
  };

  const handleDelete = async () => {
    if (!selectedUnit) return;
    try {
      await unitsService.delete(selectedUnit.id);
      toast({ title: "Unit deleted successfully" });
      setIsDeleteOpen(false);
      setSelectedUnit(null);
      loadData();
    } catch (error) {
      toast({ title: "Error deleting unit", variant: "destructive" });
    }
  };

  const openEditModal = (unit: Unit) => {
    setSelectedUnit(unit);
    setFormData({
      doorNumber: unit.doorNumber,
      floor: unit.floor,
      typology: unit.typology,
      permillage: unit.permillage,
      condominiumId: unit.condominiumId,
    });
    setIsModalOpen(true);
  };

  const resetForm = () => {
    setSelectedUnit(null);
    setFormData({
      doorNumber: "",
      floor: "",
      typology: "",
      permillage: 0,
      condominiumId: "",
    });
  };

  const columns: Column<Unit>[] = [
    { key: "doorNumber", header: "Door" },
    { key: "floor", header: "Floor" },
    { key: "typology", header: "Typology" },
    { key: "permillage", header: "Permillage (‰)" },
  ];

  return (
    <DashboardLayout>
      <PageHeader
        title="Units"
        subtitle="Manage all units"
        onAdd={() => {
          resetForm();
          setIsModalOpen(true);
        }}
        addLabel="Add Unit"
      />

      <DataTable
        data={units}
        columns={columns}
        isLoading={isLoading}
        onView={(unit) => navigate(`/units/${unit.id}`)}
        onEdit={openEditModal}
        onDelete={(unit) => {
          setSelectedUnit(unit);
          setIsDeleteOpen(true);
        }}
      />

      <FormModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        title={selectedUnit ? "Edit Unit" : "Add Unit"}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label>Condominium</Label>
            <Select
              value={formData.condominiumId}
              onValueChange={(v) =>
                setFormData({ ...formData, condominiumId: v })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select condominium" />
              </SelectTrigger>
              <SelectContent>
                {condominiums.map((c) => (
                  <SelectItem key={c.id} value={c.id}>
                    {c.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Door Number</Label>
              <Input
                value={formData.doorNumber}
                onChange={(e) =>
                  setFormData({ ...formData, doorNumber: e.target.value })
                }
                required
              />
            </div>
            <div className="space-y-2">
              <Label>Floor</Label>
              <Input
                value={formData.floor}
                onChange={(e) =>
                  setFormData({ ...formData, floor: e.target.value })
                }
                required
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Typology</Label>
              <Input
                value={formData.typology}
                onChange={(e) =>
                  setFormData({ ...formData, typology: e.target.value })
                }
                required
              />
            </div>
            <div className="space-y-2">
              <Label>Permillage (‰)</Label>
              <Input
                type="number"
                step="0.01"
                value={formData.permillage}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    permillage: parseFloat(e.target.value) || 0,
                  })
                }
                required
              />
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsModalOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit">{selectedUnit ? "Update" : "Create"}</Button>
          </div>
        </form>
      </FormModal>

      <ConfirmDialog
        open={isDeleteOpen}
        onOpenChange={setIsDeleteOpen}
        title="Delete Unit"
        description={`Are you sure you want to delete unit "${selectedUnit?.doorNumber}"?`}
        onConfirm={handleDelete}
        confirmLabel="Delete"
        variant="destructive"
      />
    </DashboardLayout>
  );
}

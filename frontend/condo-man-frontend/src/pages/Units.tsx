import { useEffect, useState, useCallback } from "react";
import { DataTable, Column } from "@/components/DataTable";
import { FormModal } from "@/components/FormModal";
import { ConfirmDialog } from "@/components/ConfirmDialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { unitsService } from "@/services";
import { Unit, CreateUnitDto } from "@/types";
import { useCondominium } from "@/context/CondominiumContext";
import { PageHeader } from "@/components/PageHeader";

export default function Units() {
  const { condominiumId } = useCondominium();
  const { toast } = useToast();

  const [units, setUnits] = useState<Unit[]>([]);
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

  const loadUnits = useCallback(
    async (activeCondominiumId: string) => {
      try {
        setIsLoading(true);
        const data = await unitsService.getAll({ condominiumId: activeCondominiumId });
        setUnits(data);
      } catch {
        toast({ title: "Error loading units", variant: "destructive" });
      } finally {
        setIsLoading(false);
      }
    },
    [toast],
  );

  useEffect(() => {
    if (!condominiumId) return;

    setFormData((prev) => ({
      ...prev,
      condominiumId,
    }));

    void loadUnits(condominiumId);
  }, [condominiumId, loadUnits]);

  const resetForm = () => {
    setSelectedUnit(null);
    setFormData({
      doorNumber: "",
      floor: "",
      typology: "",
      permillage: 0,
      condominiumId: condominiumId!,
    });
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
      if (condominiumId) {
        await loadUnits(condominiumId);
      }
    } catch {
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
      if (condominiumId) {
        await loadUnits(condominiumId);
      }
    } catch {
      toast({ title: "Error deleting unit", variant: "destructive" });
    }
  };

  const columns: Column<Unit>[] = [
    { key: "doorNumber", header: "Door" },
    { key: "floor", header: "Floor" },
    { key: "typology", header: "Typology" },
    { key: "permillage", header: "Permillage (‰)" },
  ];

  if (!condominiumId) {
    return <div>No condominium selected</div>;
  }

  return (
    <>
      <div className="flex justify-end"></div>
      <PageHeader
        title="Units"
        subtitle="Manage condominium units"
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
        onEdit={(unit) => {
          setSelectedUnit(unit);
          setFormData({
            doorNumber: unit.doorNumber,
            floor: unit.floor,
            typology: unit.typology,
            permillage: unit.permillage,
            condominiumId: condominiumId!,
          });
          setIsModalOpen(true);
        }}
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
    </>
  );
}

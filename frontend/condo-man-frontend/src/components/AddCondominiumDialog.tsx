import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { condominiumsService } from "@/services/condominiums";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "@/components/ui/use-toast";

const COMPANY_ID = "e51d687d-abae-4ad3-bfd1-450ff19b0639"; // TEMP — later from auth / context

export function AddCondominiumDialog() {
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);

  const [form, setForm] = useState({
    name: "",
    address: "",
    city: "",
    postalCode: "",
    totalUnits: 1,
  });

  const handleChange = (field: string, value: string | number) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    try {
      await condominiumsService.create({
        ...form,
        totalUnits: Number(form.totalUnits),
        companyId: COMPANY_ID,
      });

      toast({
        title: "Condominium created",
        description: "The condominium was created successfully.",
      });

      queryClient.invalidateQueries({ queryKey: ["condominiums"] });
      setOpen(false);

      // Reset form
      setForm({
        name: "",
        address: "",
        city: "",
        postalCode: "",
        totalUnits: 1,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create condominium.",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Add condominium</Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>New condominium</DialogTitle>
        </DialogHeader>

        <div className="grid gap-4">
          <div className="grid gap-2">
            <Label>Name</Label>
            <Input
              value={form.name}
              onChange={(e) => handleChange("name", e.target.value)}
              placeholder="Sunset Condos"
            />
          </div>

          <div className="grid gap-2">
            <Label>Address</Label>
            <Input
              value={form.address}
              onChange={(e) => handleChange("address", e.target.value)}
              placeholder="Rua das Flores 123"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label>City</Label>
              <Input
                value={form.city}
                onChange={(e) => handleChange("city", e.target.value)}
                placeholder="Porto"
              />
            </div>

            <div className="grid gap-2">
              <Label>Postal code</Label>
              <Input
                value={form.postalCode}
                onChange={(e) => handleChange("postalCode", e.target.value)}
                placeholder="4000-123"
              />
            </div>
          </div>

          <div className="grid gap-2">
            <Label>Total units</Label>
            <Input
              type="number"
              min={1}
              value={form.totalUnits}
              onChange={(e) => handleChange("totalUnits", e.target.value)}
            />
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSubmit}>Create</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

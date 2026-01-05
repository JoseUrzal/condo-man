import { useState, useEffect } from "react";
import { DashboardLayout } from "@/layouts/DashboardLayout";
import { PageHeader } from "@/components/PageHeader";
import { DataTable, Column } from "@/components/DataTable";
import { StatusBadge } from "@/components/StatusBadge";
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
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { paymentsService, unitsService, expensesService } from "@/services";
import {
  Payment,
  Unit,
  Expense,
  CreatePaymentDto,
  PaymentMethod,
  PaymentStatus,
} from "@/types";
import { useCondominium } from "@/context/CondominiumContext";

export default function Payments() {
  const { toast } = useToast();
  const [payments, setPayments] = useState<Payment[]>([]);
  const [units, setUnits] = useState<Unit[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);
  const [formData, setFormData] = useState<CreatePaymentDto>({
    amount: 0,
    date: new Date().toISOString().split("T")[0],
    method: PaymentMethod.TRANSFER,
    status: PaymentStatus.PENDING,
    unitId: "",
    expenseId: "",
  });
  
const { condominiumId } = useCondominium();

  useEffect(() => {
    if (!condominiumId) return;

    paymentsService.getAll({ condominiumId }).then(setPayments);
  }, [condominiumId]);

  if (!condominiumId) {
    return <div>No condominium selected</div>;
  }

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [paymentsData, unitsData, expensesData] = await Promise.all([
        paymentsService.getAll(),
        unitsService.getAll(),
        expensesService.getAll(),
      ]);
      setPayments(paymentsData);
      setUnits(unitsData);
      setExpenses(expensesData);
    } catch (error) {
      toast({ title: "Error loading data", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (selectedPayment) {
        await paymentsService.update(selectedPayment.id, formData);
        toast({ title: "Payment updated successfully" });
      } else {
        await paymentsService.create(formData);
        toast({ title: "Payment created successfully" });
      }
      setIsModalOpen(false);
      resetForm();
      loadData();
    } catch (error) {
      toast({ title: "Error saving payment", variant: "destructive" });
    }
  };

  const handleDelete = async () => {
    if (!selectedPayment) return;
    try {
      await paymentsService.delete(selectedPayment.id);
      toast({ title: "Payment deleted successfully" });
      setIsDeleteOpen(false);
      setSelectedPayment(null);
      loadData();
    } catch (error) {
      toast({ title: "Error deleting payment", variant: "destructive" });
    }
  };

  const openEditModal = (payment: Payment) => {
    setSelectedPayment(payment);
    setFormData({
      amount: payment.amount,
      date: payment.date.split("T")[0],
      method: payment.method,
      status: payment.status,
      unitId: payment.unitId,
      expenseId: payment.expenseId || "",
    });
    setIsModalOpen(true);
  };

  const resetForm = () => {
    setSelectedPayment(null);
    setFormData({
      amount: 0,
      date: new Date().toISOString().split("T")[0],
      method: PaymentMethod.TRANSFER,
      status: PaymentStatus.PENDING,
      unitId: "",
      expenseId: "",
    });
  };

  const columns: Column<Payment>[] = [
    {
      key: "amount",
      header: "Amount",
      render: (p) => `€${p.amount.toFixed(2)}`,
    },
    {
      key: "date",
      header: "Date",
      render: (p) => new Date(p.date).toLocaleDateString(),
    },
    {
      key: "method",
      header: "Method",
      render: (p) => <Badge variant="outline">{p.method}</Badge>,
    },
    {
      key: "status",
      header: "Status",
      render: (p) => (
        <StatusBadge
          status={p.status}
          activeLabel="Paid"
          inactiveLabel="Pending"
        />
      ),
    },
  ];

  return (
    <DashboardLayout>
      <PageHeader
        title="Payments"
        subtitle="Track all payments"
        onAdd={() => {
          resetForm();
          setIsModalOpen(true);
        }}
        addLabel="Record Payment"
      />

      <DataTable
        data={payments}
        columns={columns}
        isLoading={isLoading}
        onEdit={openEditModal}
        onDelete={(payment) => {
          setSelectedPayment(payment);
          setIsDeleteOpen(true);
        }}
      />

      <FormModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        title={selectedPayment ? "Edit Payment" : "Record Payment"}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label>Unit</Label>
            <Select
              value={formData.unitId}
              onValueChange={(v) => setFormData({ ...formData, unitId: v })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select unit" />
              </SelectTrigger>
              <SelectContent>
                {units.map((u) => (
                  <SelectItem key={u.id} value={u.id}>
                    Door {u.doorNumber} - Floor {u.floor}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Expense (optional)</Label>
            <Select
              value={formData.expenseId || ""}
              onValueChange={(v) =>
                setFormData({ ...formData, expenseId: v || undefined })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select expense" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">None</SelectItem>
                {expenses.map((e) => (
                  <SelectItem key={e.id} value={e.id}>
                    {e.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Amount (€)</Label>
              <Input
                type="number"
                step="0.01"
                value={formData.amount}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    amount: parseFloat(e.target.value) || 0,
                  })
                }
                required
              />
            </div>
            <div className="space-y-2">
              <Label>Date</Label>
              <Input
                type="date"
                value={formData.date}
                onChange={(e) =>
                  setFormData({ ...formData, date: e.target.value })
                }
                required
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Method</Label>
              <Select
                value={formData.method}
                onValueChange={(v) =>
                  setFormData({ ...formData, method: v as PaymentMethod })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={PaymentMethod.MBWAY}>MB WAY</SelectItem>
                  <SelectItem value={PaymentMethod.TRANSFER}>
                    Transfer
                  </SelectItem>
                  <SelectItem value={PaymentMethod.CASH}>Cash</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Status</Label>
              <Select
                value={formData.status}
                onValueChange={(v) =>
                  setFormData({ ...formData, status: v as PaymentStatus })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={PaymentStatus.PENDING}>Pending</SelectItem>
                  <SelectItem value={PaymentStatus.PAID}>Paid</SelectItem>
                </SelectContent>
              </Select>
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
            <Button type="submit">
              {selectedPayment ? "Update" : "Create"}
            </Button>
          </div>
        </form>
      </FormModal>

      <ConfirmDialog
        open={isDeleteOpen}
        onOpenChange={setIsDeleteOpen}
        title="Delete Payment"
        description="Are you sure you want to delete this payment?"
        onConfirm={handleDelete}
        confirmLabel="Delete"
        variant="destructive"
      />
    </DashboardLayout>
  );
}

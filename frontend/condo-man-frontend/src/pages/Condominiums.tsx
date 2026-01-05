import { DashboardLayout } from "@/layouts/DashboardLayout";
import { PageHeader } from "@/components/PageHeader";
import { DataTable, Column } from "@/components/DataTable";
import { AddCondominiumDialog } from "@/components/AddCondominiumDialog";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { condominiumsService } from "@/services";
import { Condominium } from "@/types";

export default function Condominiums() {
  const navigate = useNavigate();
  const [condominiums, setCondominiums] = useState<Condominium[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const data = await condominiumsService.getAll();
      setCondominiums(data);
    } finally {
      setIsLoading(false);
    }
  };

  const columns: Column<Condominium>[] = [
    { key: "name", header: "Name" },
    { key: "address", header: "Address" },
    { key: "city", header: "City" },
    { key: "postalCode", header: "Postal Code" },
    { key: "totalUnits", header: "Units" },
  ];

  return (
    <DashboardLayout>
      <PageHeader title="Condominiums" subtitle="Manage all condominiums">
        {/* 👇 THIS is the trick */}
        <AddCondominiumDialog />
      </PageHeader>

      <DataTable
        data={condominiums}
        columns={columns}
        isLoading={isLoading}
        onView={(condo) => navigate(`/condominiums/${condo.id}`)}
      />
    </DashboardLayout>
  );
}

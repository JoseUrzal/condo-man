import { Outlet, useParams } from "react-router-dom";
import { useEffect } from "react";
import { useCondominium } from "@/context/CondominiumContext";
import { DashboardLayout } from "@/layouts/DashboardLayout";

export function CondominiumLayout() {
  const { id } = useParams<{ id: string }>();
  const { setCondominiumId } = useCondominium();

  useEffect(() => {
    if (id) {
      setCondominiumId(id);
    }
  }, [id, setCondominiumId]);

  return (
    <DashboardLayout>
      <Outlet />
    </DashboardLayout>
  );
}

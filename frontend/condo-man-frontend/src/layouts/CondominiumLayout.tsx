import { Outlet, useParams } from "react-router-dom";
import { useEffect } from "react";
import { useCondominium } from "@/context/CondominiumContext";

export default function CondominiumLayout() {
  const { id } = useParams<{ id: string }>();
  const { condominium, setCondominium } = useCondominium();

  useEffect(() => {
    if (!id) return;

    // Avoid resetting if already selected
    if (condominium?.id === id) return;

    // ⚠️ TEMP — later replace with API fetch
    setCondominium({
      id,
      name: `Condominium ${id}`,
    });
  }, [id]);

  return <Outlet />;
}

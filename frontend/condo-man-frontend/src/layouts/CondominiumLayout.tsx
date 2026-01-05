import { useCondominium } from "@/context/CondominiumContext";

export function CondominiumLayout() {
  const { condominiumId } = useCondominium();

  return (
    <div>
      <h1>Condo {condominiumId}</h1>
      {/* Your layout content */}
    </div>
  );
}

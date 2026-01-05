import { createContext, useContext, useEffect, useState } from "react";

type Condominium = {
  id: string;
  name: string;
};

type CondominiumContextType = {
  condominiumId: string | null;
  condominium: Condominium | null;
  condominiums: Condominium[];
  setCondominium: (condo: Condominium) => void;
  clearCondominium: () => void;
  setCondominiums: (condos: Condominium[]) => void;
};

const CondominiumContext = createContext<CondominiumContextType | undefined>(
  undefined
);

const STORAGE_KEY = "selectedCondominium";

export function CondominiumProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [condominiumId, setCondominiumId] = useState<string | null>(null);
  const [condominium, setCondominiumState] = useState<Condominium | null>(null);
  const [condominiums, setCondominiums] = useState<Condominium[]>([]);

  // 🔹 Restore from localStorage
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed: Condominium = JSON.parse(stored);
      setCondominiumState(parsed);
      setCondominiumId(parsed.id);
    }
  }, []);

  const setCondominium = (condo: Condominium) => {
    setCondominiumState(condo);
    setCondominiumId(condo.id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(condo));
  };

  const clearCondominium = () => {
    setCondominiumState(null);
    setCondominiumId(null);
    localStorage.removeItem(STORAGE_KEY);
  };

  return (
    <CondominiumContext.Provider
      value={{
        condominiumId,
        condominium,
        condominiums,
        setCondominium,
        clearCondominium,
        setCondominiums,
      }}
    >
      {children}
    </CondominiumContext.Provider>
  );
}

export function useCondominium() {
  const context = useContext(CondominiumContext);
  if (!context) {
    throw new Error("useCondominium must be used within a CondominiumProvider");
  }
  return context;
}

import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
  useCallback,
} from "react";
import { Condominium } from "@/types";
import { condominiumsService } from "@/services";

type CondominiumContextType = {
  condominiumId: string | null;
  setCondominiumId: (id: string) => void;
  condominium: Condominium | null;
  setCondominium: (condo: Condominium) => void;
  condominiums: Condominium[];
  refreshCondominiums: () => Promise<void>;
  clearCondominium: () => void;
};

const CondominiumContext = createContext<CondominiumContextType | undefined>(
  undefined
);

const STORAGE_KEY = "activeCondominiumId";

export function CondominiumProvider({ children }: { children: ReactNode }) {
  const [condominiumId, setCondominiumIdState] = useState<string | null>(() => {
    return localStorage.getItem(STORAGE_KEY);
  });

  const [condominium, setCondominium] = useState<Condominium | null>(null);
  const [condominiums, setCondominiums] = useState<Condominium[]>([]);

  // Save condominiumId to localStorage
  const setCondominiumId = (id: string) => {
    setCondominiumIdState(id);
    localStorage.setItem(STORAGE_KEY, id);
  };

  const clearCondominium = () => {
    setCondominiumIdState(null);
    setCondominium(null);
    localStorage.removeItem(STORAGE_KEY);
  };

  const refreshCondominiums = useCallback(async () => {
    try {
      const data = await condominiumsService.getAll();
      setCondominiums(data);

      // If we have a saved condominiumId, set the current condominium object
      if (condominiumId) {
        const selected = data.find((c) => c.id === condominiumId) || null;
        setCondominium(selected);
      }
    } catch (error) {
      console.error("Error fetching condominiums", error);
    }
  }, [condominiumId]);

  // Load all condominiums on mount and when condominiumId changes
  useEffect(() => {
    void refreshCondominiums();
  }, [refreshCondominiums]);

  return (
    <CondominiumContext.Provider
      value={{
        condominiumId,
        setCondominiumId,
        condominium,
        setCondominium,
        condominiums,
        refreshCondominiums,
        clearCondominium,
      }}
    >
      {children}
    </CondominiumContext.Provider>
  );
}

export function useCondominium() {
  const ctx = useContext(CondominiumContext);
  if (!ctx) {
    throw new Error("useCondominium must be used within CondominiumProvider");
  }
  return ctx;
}

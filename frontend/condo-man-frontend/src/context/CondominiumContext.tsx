import { createContext, useContext, useState, ReactNode } from "react";

type CondominiumContextType = {
  condominiumId: string | null;
  setCondominiumId: (id: string | null) => void;
};

const CondominiumContext = createContext<CondominiumContextType | undefined>(
  undefined
);

export const useCondominium = () => {
  const context = useContext(CondominiumContext);
  if (!context) {
    throw new Error("useCondominium must be used within a CondominiumProvider");
  }
  return context;
};

type ProviderProps = { children: ReactNode };

export const CondominiumProvider = ({ children }: ProviderProps) => {
  const [condominiumId, setCondominiumId] = useState<string | null>(null);

  return (
    <CondominiumContext.Provider value={{ condominiumId, setCondominiumId }}>
      {children}
    </CondominiumContext.Provider>
  );
};

// ✅ Export the context itself if another component needs it
export { CondominiumContext };

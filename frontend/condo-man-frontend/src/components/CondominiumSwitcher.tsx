import { Plus, ChevronDown } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useCondominium } from "@/context/CondominiumContext";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function CondominiumSwitcher() {
  const { condominium, condominiums, setCondominium } = useCondominium();
  const navigate = useNavigate();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          className="w-full flex justify-between items-center"
        >
          <span className="truncate">
            {condominium ? condominium.name : "Select condominium"}
          </span>
          <ChevronDown className="h-4 w-4 ml-2" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent className="w-56">
        {condominiums.map((condo) => (
          <DropdownMenuItem
            key={condo.id}
            onClick={() => {
              setCondominium(condo);
              navigate(`/condominiums/${condo.id}`);
            }}
          >
            {condo.name}
          </DropdownMenuItem>
        ))}

        <DropdownMenuItem
          className="text-primary flex items-center gap-2"
          onClick={() => navigate("/condominiums/new")}
        >
          <Plus className="h-4 w-4" />
          Add condominium
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface StatusBadgeProps {
  status: boolean | string;
  activeLabel?: string;
  inactiveLabel?: string;
}

export function StatusBadge({ 
  status, 
  activeLabel = 'Active', 
  inactiveLabel = 'Inactive' 
}: StatusBadgeProps) {
  const isActive = typeof status === 'boolean' ? status : status === 'PAID';
  
  return (
    <Badge
      variant="outline"
      className={cn(
        'font-medium',
        isActive
          ? 'border-green-500 bg-green-50 text-green-700'
          : 'border-amber-500 bg-amber-50 text-amber-700'
      )}
    >
      {isActive ? activeLabel : inactiveLabel}
    </Badge>
  );
}

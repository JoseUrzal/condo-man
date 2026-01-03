import { ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  showBack?: boolean;
  onAdd?: () => void;
  addLabel?: string;
  children?: ReactNode;
}

export function PageHeader({
  title,
  subtitle,
  showBack,
  onAdd,
  addLabel = 'Add New',
  children,
}: PageHeaderProps) {
  const navigate = useNavigate();

  return (
    <div className="flex items-start justify-between mb-6">
      <div className="flex items-start gap-4">
        {showBack && (
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate(-1)}
            className="mt-0.5"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
        )}
        <div>
          <h1 className="text-2xl font-bold text-foreground">{title}</h1>
          {subtitle && (
            <p className="text-muted-foreground mt-1">{subtitle}</p>
          )}
        </div>
      </div>
      <div className="flex items-center gap-3">
        {children}
        {onAdd && (
          <Button onClick={onAdd}>
            <Plus className="h-4 w-4 mr-2" />
            {addLabel}
          </Button>
        )}
      </div>
    </div>
  );
}

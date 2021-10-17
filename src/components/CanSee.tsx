import { useCan } from 'hooks/useCan';
import { ReactNode } from 'react';

interface CanSeeProps {
  children: ReactNode;
  permissions?: string[];
  roles?: string[];
}

export function CanSee({ children, permissions, roles }: CanSeeProps) {
  const userCanSeeComponent = useCan({
    permissions,
    roles,
  });

  return !userCanSeeComponent ? null : <>{children}</>;
}

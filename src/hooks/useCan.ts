import { useAuthContext } from 'contexts/AuthCountext';
import { validateUserPermissionsAndRoles } from 'utils/validateUserPermissionsAndRoles';

type UseCanParams = {
  permissions?: string[];
  roles?: string[];
};

export function useCan({ permissions, roles }: UseCanParams) {
  const { user, isAuthenticated } = useAuthContext();

  if (!isAuthenticated) {
    return false;
  }

  const userHasValidPermissions = validateUserPermissionsAndRoles({
    user,
    permissions,
    roles,
  });

  return userHasValidPermissions;
}

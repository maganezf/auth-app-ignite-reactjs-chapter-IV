import decode from 'jwt-decode';
import {
  GetServerSideProps,
  GetServerSidePropsContext,
  GetServerSidePropsResult,
} from 'next';
import { destroyCookie, parseCookies } from 'nookies';
import { AuthTokenError } from 'services/errors/AuthTokenError';
import { validateUserPermissionsAndRoles } from './validateUserPermissionsAndRoles';

type withSSRAuthenticationOptions = {
  permissions?: string[];
  roles?: string[];
};

export function withSSRAuthentication<T>(
  getServerSideFunction: GetServerSideProps<T>,
  options?: withSSRAuthenticationOptions
): GetServerSideProps {
  return async (
    context: GetServerSidePropsContext
  ): Promise<GetServerSidePropsResult<T>> => {
    const cookies = parseCookies(context);

    const token = cookies['auth-app.token'];

    if (!token) {
      return {
        redirect: {
          destination: '/',
          permanent: false,
        },
      };
    }

    if (options) {
      const user = decode<{ permissions: string[]; roles: string[] }>(token);
      const { permissions, roles } = options;

      const userHasValidPermissions = validateUserPermissionsAndRoles({
        user,
        permissions,
        roles,
      });

      if (!userHasValidPermissions) {
        return {
          redirect: {
            destination: '/dashboard',
            permanent: false,
          },
        };
      }
    }

    try {
      return await getServerSideFunction(context);
    } catch (error) {
      if (error instanceof AuthTokenError) {
        destroyCookie(context, 'auth-app.token');
        destroyCookie(context, 'auth-app.refreshToken');

        return {
          redirect: {
            destination: '/',
            permanent: false,
          },
        };
      }
    }
  };
}

import {
  GetServerSideProps,
  GetServerSidePropsContext,
  GetServerSidePropsResult,
} from 'next';
import { destroyCookie, parseCookies } from 'nookies';
import { AuthTokenError } from 'services/errors/AuthTokenError';

export function withSSRAuthentication<T>(
  getServerSideFunction: GetServerSideProps<T>
): GetServerSideProps {
  return async (
    context: GetServerSidePropsContext
  ): Promise<GetServerSidePropsResult<T>> => {
    const cookies = parseCookies(context);

    if (!cookies['auth-app.token']) {
      return {
        redirect: {
          destination: '/',
          permanent: false,
        },
      };
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

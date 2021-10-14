import {
  GetServerSideProps,
  GetServerSidePropsContext,
  GetServerSidePropsResult,
} from 'next';
import { parseCookies } from 'nookies';

export function withSSRAuthentication<T>(
  getServerSideFunction: GetServerSideProps<T>
) {
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

    return await getServerSideFunction(context);
  };
}

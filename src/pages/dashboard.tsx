import { CanSee } from 'components/CanSee';
import { useAuthContext } from 'contexts/AuthCountext';
import { useEffect } from 'react';
import { setupApiClient } from 'services/api';
import { api } from 'services/apiClient';
import { withSSRAuthentication } from 'utils/withSSRAuthentication';

export default function Dashboard() {
  const { user, signOut } = useAuthContext();

  useEffect(() => {
    api.get('/me').then(response => console.log('/me Dashboard', response));
  }, []);

  return (
    <>
      <h1>Dashboard - Hello {user?.email}</h1>

      <button type='button' onClick={signOut}>
        SignOut
      </button>

      <CanSee
        permissions={['users.list', 'users.create', 'metrics.list']}
        roles={['administrator']}
      >
        <h1>Métricas:</h1>

        <span>pode ver as métricas</span>
      </CanSee>
    </>
  );
}

export const getServerSideProps = withSSRAuthentication(async context => {
  const apiClient = setupApiClient(context);

  const response = await apiClient.get('/me');
  console.log('response', response);

  return {
    props: {},
  };
});

import { useAuthContext } from 'contexts/AuthCountext';
import { useCan } from 'hooks/useCan';
import { useEffect } from 'react';
import { setupApiClient } from 'services/api';
import { api } from 'services/apiClient';
import { withSSRAuthentication } from 'utils/withSSRAuthentication';

export default function Dashboard() {
  const { user } = useAuthContext();

  const userCanSeeMetrics = useCan({
    permissions: ['users.list', 'users.create', 'metrics.list'],
    roles: ['administrator'],
  });

  useEffect(() => {
    api.get('/me').then(response => console.log('/me Dashboard', response));
  }, []);

  return (
    <>
      <h1>Dashboard - Hello {user?.email}</h1>

      {userCanSeeMetrics && (
        <div>
          <h1>Métricas:</h1>

          <span>pode ver as métricas</span>
        </div>
      )}
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

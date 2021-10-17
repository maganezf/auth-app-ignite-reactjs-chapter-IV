import { setupApiClient } from 'services/api';
import { withSSRAuthentication } from 'utils/withSSRAuthentication';

export default function Dashboard() {
  return (
    <>
      <h1>Metrics</h1>
    </>
  );
}

export const getServerSideProps = withSSRAuthentication(
  async context => {
    const apiClient = setupApiClient(context);
    const response = await apiClient.get('/me');

    return {
      props: {},
    };
  },
  {
    permissions: ['metrics.list'],
    roles: ['administrator'],
  }
);

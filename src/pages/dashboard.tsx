import { useAuthContext } from 'contexts/AuthCountext';
import { useEffect } from 'react';
import { api } from 'services/api';
import { withSSRAuthentication } from 'utils/withSSRAuthentication';

export default function Dashboard() {
  const { user } = useAuthContext();

  useEffect(() => {
    api
      .get('/me')
      .then(response => console.log('/me Dashboard', response))
      .catch(error => console.log(error));
  }, []);

  return (
    <div>
      <h1>Dashboard</h1>
      <h1>{user?.email}</h1>
    </div>
  );
}

export const getServerSideProps = withSSRAuthentication(async context => {
  return {
    props: {},
  };
});

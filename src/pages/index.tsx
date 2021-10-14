import { useAuthContext } from 'contexts/AuthCountext';
import { GetServerSideProps } from 'next';
import { FormEvent, useState } from 'react';
import { withSSRGuest } from 'utils/withSSRGuest';
import styles from './home.module.scss';

export default function Home() {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');

  const { signIn } = useAuthContext();

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();

    const data = {
      email,
      password,
    };

    await signIn(data);
  }

  return (
    <form onSubmit={handleSubmit} className={styles.container}>
      <p>email</p>
      <input
        type='email'
        value={email}
        onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
          setEmail(event.target.value)
        }
      />

      <p>password</p>
      <input
        type='password'
        value={password}
        onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
          setPassword(event.target.value)
        }
      />

      <button type='submit'>Login</button>
    </form>
  );
}

export const getServerSideProps: GetServerSideProps = withSSRGuest(
  async context => {
    return {
      props: {},
    };
  }
);

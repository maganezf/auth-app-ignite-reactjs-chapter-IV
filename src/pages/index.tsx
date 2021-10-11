import { useAuthContext } from 'contexts/AuthCountext';
import { FormEvent, useState } from 'react';
import styles from './home.module.scss';

export default function Home() {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');

  const { isAuthenticated, signIn } = useAuthContext();

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

import { FormEvent, useContext, useState } from 'react';

import { UserTokenContext } from '../../contextes/userTokenContext';

import accountAPI from '../../requests/account';

import styles from './Login.module.scss';

export default function Login() {
  const { setToken } = useContext(UserTokenContext);

  const [error, setError] = useState<string | null>(null);
  const [type, setType] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      if (type === 'register') setToken(await accountAPI.register(email, password));
      if (type === 'login') setToken(await accountAPI.login(email, password));
    } catch (err) { if (err instanceof Error) setError(err.message); }
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      {error && (<div className={styles.error}>{error}</div>)}

      <label className={styles.label}>
        Email:
        <input type="email" name="email" onChange={(e) => { setEmail(e.target.value); }} className={styles.input} />
      </label>
      <label className={styles.label}>
        Password:
        <input type="password" name="password" onChange={(e) => { setPassword(e.target.value); }} className={styles.input} />
      </label>

      <div className={styles.buttons}>
        <button type="submit" onClick={() => { setType('register'); }} className={styles.button}>Register</button>
        <button type="submit" onClick={() => { setType('login'); }} className={styles.button}>Login</button>
      </div>
    </form>
  );
}

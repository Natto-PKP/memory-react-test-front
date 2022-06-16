import { useContext } from 'react';
import { Link } from 'react-router-dom';

import { UserTokenContext } from '../../contextes/userTokenContext';

import styles from './Header.module.scss';

export default function Header() {
  const { token, setToken } = useContext(UserTokenContext);

  return (
    <header className={styles.header}>
      <div className={styles.nav}>
        <Link to="/" className={styles.name}>Memory</Link>
        {token
          ? (<button type="button" onClick={() => { localStorage.clear(); setToken(null); }} className={styles.button}>Disconnect</button>)
          : (<Link to="/login" className={styles.button}>Login / Signup</Link>)}
      </div>
    </header>
  );
}

import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useState } from 'react';

import Login from './Login/Login';
import Header from './Header/Header';
import Game from './Game/Game';

import { UserTokenContext } from '../contextes/userTokenContext';

import styles from './App.module.scss';

export default function App() {
  const [token, setToken] = useState(localStorage.getItem('token') || null);

  return (
    <BrowserRouter>
      <UserTokenContext.Provider value={{ token, setToken }}>
        <Header />

        <div className={styles.body}>
          <Routes>
            <Route path="/" element={<App />} />
            <Route index element={<Game />} />
            <Route path="/login" element={<Login />} />
          </Routes>
        </div>
      </UserTokenContext.Provider>
    </BrowserRouter>
  );
}

// Environ 5h

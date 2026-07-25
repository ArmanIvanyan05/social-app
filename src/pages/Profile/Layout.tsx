import { useEffect, useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import {
  getCurrentUser,
  logoutUser,
} from '../../helpers/api';
import type { IUser } from '../../helpers/types';

export const Layout = () => {
  const [account, setAccount] = useState<IUser | null>(null);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    let active = true;
    getCurrentUser()
      .then(user => {
        if (active) setAccount(user);
      })
      .catch(() => {
        if (!active) return;
        logoutUser();
        navigate('/login', { replace: true });
      });
    return () => {
      active = false;
    };
  }, [navigate]);

  const logout = () => {
    logoutUser();
    setAccount(null);
    setError('');
    navigate('/login', { replace: true });
  };

  if (!account) return <p role="status">Restoring session…</p>;

  return (
    <>
      <nav aria-label="Main navigation">
        <span>Signed in as {account.username}</span>{' '}
        <NavLink to="/profile/posts">Posts</NavLink>{' '}
        <button type="button" onClick={logout}>Log out</button>
      </nav>
      {error && <p role="alert">{error}</p>}
      <Outlet context={{ account, setAccount, setError }} />
    </>
  );
};

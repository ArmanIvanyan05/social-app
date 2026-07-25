import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import {
  createBrowserRouter,
  Navigate,
  RouterProvider,
} from 'react-router-dom';
import './index.css';
import { PublicOnly } from './components/PublicOnly';
import { FeatureUnavailable } from './components/FeatureUnavailable';
import { Login } from './pages/Login';
import { Layout } from './pages/Profile/Layout';
import { Photos } from './pages/Profile/photos';
import { Signup } from './pages/Signup';

const routes = createBrowserRouter([
  {
    path: '/',
    element: (
      <PublicOnly>
        <Signup />
      </PublicOnly>
    ),
  },
  {
    path: '/login',
    element: (
      <PublicOnly>
        <Login />
      </PublicOnly>
    ),
  },
  {
    path: '/profile',
    element: <Layout />,
    children: [
      { index: true, element: <Navigate to="posts" replace /> },
      { path: 'posts', element: <Photos /> },
      { path: 'albums', element: <Photos /> },
      {
        path: 'settings',
        element: <FeatureUnavailable feature="Settings" />,
      },
      { path: 'search', element: <FeatureUnavailable feature="Search" /> },
      {
        path: 'requests',
        element: <FeatureUnavailable feature="Follow requests" />,
      },
      {
        path: 'followers',
        element: <FeatureUnavailable feature="Followers" />,
      },
      {
        path: 'followings',
        element: <FeatureUnavailable feature="Following" />,
      },
      {
        path: ':id',
        element: <FeatureUnavailable feature="User profile" />,
      },
    ],
  },
  { path: '*', element: <Navigate to="/" replace /> },
]);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={routes} />
  </StrictMode>
);

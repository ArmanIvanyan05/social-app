import type { ReactElement } from 'react';
import { Navigate } from 'react-router-dom';
import { hasAuthToken } from '../helpers/auth';

interface Props {
  children: ReactElement;
}

export const PublicOnly = ({ children }: Props) =>
  hasAuthToken() ? <Navigate to="/profile/posts" replace /> : children;

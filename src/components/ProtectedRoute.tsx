import { ReactNode } from 'react';
import { auth } from '../firebase.ts';
import { Navigate } from 'react-router-dom';

export default function ProtectedRoute({ children }: { children: ReactNode }) {
  const user = auth.currentUser;
  if (!user) {
    return <Navigate to={'/login'} />;
  }
  return children;
}

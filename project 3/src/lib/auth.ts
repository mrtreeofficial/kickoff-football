import { verifyToken } from './db';

export async function isAuthenticated() {
  const token = localStorage.getItem('token');
  if (!token) return false;

  const user = await verifyToken(token);
  return !!user;
}

export async function isAdmin() {
  const token = localStorage.getItem('token');
  if (!token) return false;

  const user = await verifyToken(token);
  return user?.isAdmin ?? false;
}

export async function getUser() {
  const token = localStorage.getItem('token');
  if (!token) return null;

  return await verifyToken(token);
}
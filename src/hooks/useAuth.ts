// hooks/useAuth.ts
'use client';

import { useCallback } from 'react';
import { clearTokens, getAccessToken } from '@/utils/auth';

const API_BASE = process.env.NEXT_PUBLIC_BACKEND_API_AUTH_URL;

export function useAuth() {
  /** Return `{ Authorization: Bearer … }` or an empty object */
  const getAuthHeader = useCallback((): Record<string, string> => {
    const token = getAccessToken();
    return token ? { Authorization: `Bearer ${token}` } : {};
  }, []);

  /** Remove local tokens and redirect to landing page */
  const logoutClientSide = useCallback(() => {
    clearTokens();
    window.location.replace('/');
  }, []);

  /** Call API → always fall back to client‑side logout */
  const logout = useCallback(async () => {
    if (!API_BASE) {
      console.error('API URL is not configured');
      return logoutClientSide();
    }

    try {
      await fetch(`${API_BASE}logout`, {
        method: 'POST',
        headers: {
          ...getAuthHeader(),
          'Content-Type': 'application/json',
        },
      });
    } catch (err) {
      console.error('Logout request failed:', err);
    } finally {
      logoutClientSide();
    }
  }, [getAuthHeader, logoutClientSide]);

  return {
    getAuthHeader,
    logout,
  };
}

// src/context/AdminAuthContext.tsx
import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { useRouter } from 'next/router';
import { ADMIN_PANEL_URL } from "@/src/config/url.config"; // << ПРОВЕРЬТЕ ПУТЬ
import { useAuth } from '@/src/hooks/useAuth'; // << IMPORT useAuth TO OBSERVE USER STATE

interface AdminAuthContextType {
  isAdminVerified: boolean;
  isPasswordModalOpen: boolean;
  verifyAdminAccess: (password: string) => boolean;
  openPasswordModal: () => void;
  closePasswordModal: () => void;
  logoutAdmin: () => void; // This function will now be used internally on main user logout
}

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined);

const ADMIN_PASSWORD = process.env.NEXT_PUBLIC_ADMIN_PASSWORD || "1337";
const ADMIN_VERIFIED_KEY = 'isAdminAccessVerified';

export const AdminAuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isAdminVerified, setIsAdminVerified] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const router = useRouter();
  const { user } = useAuth(); // Get the main user state

  // Initialize isAdminVerified from sessionStorage on component mount
  useEffect(() => {
    const storedVerification = sessionStorage.getItem(ADMIN_VERIFIED_KEY);
    if (storedVerification === 'true') {
      setIsAdminVerified(true);
    } else {
      setIsAdminVerified(false); // Ensure it's false if not found or not 'true'
    }
  }, []); // Runs only once on mount

  // Define logoutAdmin with useCallback for stability
  const logoutAdmin = useCallback(() => {
    sessionStorage.removeItem(ADMIN_VERIFIED_KEY);
    setIsAdminVerified(false);
    setIsPasswordModalOpen(false);
    // If the user is currently on an admin page when access is revoked,
    // redirect them to the homepage.
    if (router.pathname.startsWith(ADMIN_PANEL_URL)) {
      router.push('/');
    }
  }, [router]); // router is a stable dependency from useRouter

  // Effect to reset admin verification if the main user logs out
  useEffect(() => {
    // If there's no main user (logged out) AND admin was previously verified
    if (!user && isAdminVerified) {
      // console.log("Main user logged out, resetting admin verification."); // For debugging
      logoutAdmin();
    }
  }, [user, isAdminVerified, logoutAdmin]); // Dependencies for this effect

  const verifyAdminAccess = (password: string): boolean => {
    if (password === ADMIN_PASSWORD) {
      sessionStorage.setItem(ADMIN_VERIFIED_KEY, 'true');
      setIsAdminVerified(true);
      setIsPasswordModalOpen(false);
      if (!router.pathname.startsWith(ADMIN_PANEL_URL)) {
        router.push(ADMIN_PANEL_URL);
      }
      return true;
    }
    return false;
  };

  const openPasswordModal = () => {
    setIsPasswordModalOpen(true);
  };

  const closePasswordModal = () => {
    setIsPasswordModalOpen(false);
  };

  return (
    <AdminAuthContext.Provider
      value={{
        isAdminVerified,
        isPasswordModalOpen,
        verifyAdminAccess,
        openPasswordModal,
        closePasswordModal,
        logoutAdmin, // Expose logoutAdmin if needed externally, e.g., for an "Admin Logout" button
      }}
    >
      {children}
    </AdminAuthContext.Provider>
  );
};

export const useAdminAuth = (): AdminAuthContextType => {
  const context = useContext(AdminAuthContext);
  if (context === undefined) {
    throw new Error('useAdminAuth must be used within an AdminAuthProvider');
  }
  return context;
};
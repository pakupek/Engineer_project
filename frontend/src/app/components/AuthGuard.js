"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { checkAuthStatus } from "../services/auth";

export default function AuthGuard({ children, requireAuth = true }) {
  const [isChecking, setIsChecking] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const verifyAuth = async () => {
      setIsChecking(true);
      const { isAuthenticated: authStatus } = await checkAuthStatus();
      
      setIsAuthenticated(authStatus);

      if (requireAuth && !authStatus) {
        router.push('/login');
      } else {
        setIsChecking(false);
      }
    };

    verifyAuth();
  }, [router, requireAuth]);

  if (isChecking) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-lg text-gray-600">Weryfikacja autoryzacji...</p>
        </div>
      </div>
    );
  }

  if (requireAuth && !isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <p className="text-lg text-gray-600">Przekierowywanie do logowania...</p>
        </div>
      </div>
    );
  }

  return children;
}
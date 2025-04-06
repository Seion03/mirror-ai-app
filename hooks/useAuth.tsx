import { useState, useEffect } from 'react';
import { auth } from '../scripts/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { useUser } from '../context/UserContext';

// Both export the function as named export AND as default export
export function useAuth() {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const { setUser } = useUser();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setIsLoading(false);
      
      if (user) {
        // User is signed in
        setUser({
          email: user.email || '',
          name: user.displayName || ''
        });
        setIsAuthenticated(true);
      } else {
        // User is signed out
        setUser(null);
        setIsAuthenticated(false);
      }
    });

    return unsubscribe;
  }, []);

  return { isLoading, isAuthenticated };
}

// Add default export to ensure compatibility
export default useAuth;
import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode';
import { useNavigate } from 'react-router-dom';

interface User {
  email: string;
  name: string;
  picture: string;
  token: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: () => void;
  logout: () => void;
  handleGoogleSuccess: (credentialResponse: any) => void;
  handleGoogleError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Load user from localStorage if available
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = () => {
    // This will be handled by the GoogleLogin component
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  const handleGoogleSuccess = async (response: any) => {
    console.log('Google login success', response);
    try {
      if (!response.access_token) {
        throw new Error('No access token received from Google');
      }
      // Fetch user info from Google
      const res = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
        headers: {
          Authorization: `Bearer ${response.access_token}`,
        },
      });
      const profile = await res.json();
      const userData: User = {
        email: profile.email,
        name: profile.name,
        picture: profile.picture,
        token: response.access_token,
      };
      setUser(userData);
      localStorage.setItem('user', JSON.stringify(userData));
      console.log('User set, redirecting to /chat', userData);
      navigate('/chat');
    } catch (err) {
      console.error('Google userinfo fetch or user set failed:', err);
    }
  };

  const handleGoogleError = () => {
    console.error('Login Failed');
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, handleGoogleSuccess, handleGoogleError }}>
      <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
        {children}
      </GoogleOAuthProvider>
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export { GoogleLogin }; 
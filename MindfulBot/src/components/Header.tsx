import React from 'react';
import { MessageCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { LoginButton } from './LoginButton';

const Header: React.FC = () => {
  const { user, logout } = useAuth();
  return (
    <header className="py-6 animate-fade-in w-full">
      <div className="container max-w-4xl mx-auto px-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="h-10 w-10 rounded-full glass-panel flex items-center justify-center animate-float-slow">
              <MessageCircle className="w-5 h-5 text-starry-highlight" />
            </div>
            <div>
              <h1 className="text-xl font-medium text-starry-text text-glow">
                Mindful<span className="text-starry-highlight">Companion</span>
              </h1>
              <p className="text-xs text-starry-muted">Your private AI support space</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            {user ? (
              <div className="flex items-center gap-2">
                <span className="text-starry-text font-medium">Hi {user.name}</span>
                <button onClick={logout} className="ml-2 px-2 py-1 bg-red-500 text-white rounded">Logout</button>
              </div>
            ) : (
              <LoginButton />
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;

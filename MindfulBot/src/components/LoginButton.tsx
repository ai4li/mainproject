import { useAuth } from '../context/AuthContext';
import { Button } from './ui/button';
import { FcGoogle } from 'react-icons/fc';
import { useGoogleLogin } from '@react-oauth/google';

export function LoginButton() {
  const { handleGoogleSuccess, handleGoogleError } = useAuth();

  const login = useGoogleLogin({
    onSuccess: (response) => {
      console.log('Google login response:', response);
      handleGoogleSuccess(response);
    },
    onError: handleGoogleError,
    flow: 'implicit',
  });

  return (
    <div className="flex items-center justify-center">
      <Button
        className="bg-starry-blue hover:bg-starry-highlight text-white flex items-center gap-2 px-4 py-2 rounded shadow"
        onClick={() => login()}
      >
        <FcGoogle className="text-xl" />
        Sign in with Google
      </Button>
    </div>
  );
} 
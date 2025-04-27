import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { supabase } from '../lib/supabase';

export default function AuthCallback() {
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        const username = searchParams.get('username');
        
        if (username) {
          localStorage.setItem('username', username);
        }
        
        const { error } = await supabase.auth.getSession();
        
        if (error) {
          setError(error.message);
        } else {
          navigate('/dashboard');
        }
      } catch (err) {
        setError('Ocorreu um problema durante a autenticação.');
        console.error(err);
      }
    };

    handleAuthCallback();
  }, [navigate, searchParams]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="p-8 text-center bg-white rounded-lg shadow-md">
        {error ? (
          <div className="text-red-600">
            <h2 className="text-xl font-bold">Authentication error</h2>
            <p className="mt-2">{error}</p>
            <button
              onClick={() => navigate('/login')}
              className="px-4 py-2 mt-4 text-white bg-blue-600 rounded-md hover:bg-blue-700"
            >
              Voltar para o login
            </button>
          </div>
        ) : (
          <div className="text-gray-800">
            <h2 className="text-xl font-bold">Authenticating...</h2>
            <div className="mt-4 flex justify-center space-x-1">
              <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce delay-100"></div>
              <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce delay-200"></div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
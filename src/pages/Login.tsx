import React, { useState, useEffect, FormEvent } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import { Button } from '@heroui/button';

interface AuthError {
  message: string;
}

interface SignInResponse {
  error?: AuthError;
}

export default function Login() {
  const [email, setEmail] = useState<string>('');
  const [username, setUsername] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [message, setMessage] = useState<string>('');
  const [fadeIn, setFadeIn] = useState<boolean>(false);
  const { user, signInWithMagicLink } = useAuth();

  useEffect(() => {
    setFadeIn(true);
  }, []);

  if (user) {
    return <Navigate to="/dashboard" />;
  }

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!username.trim()) {
      setMessage('Erro: Nome de usuário é obrigatório');
      return;
    }

    setLoading(true);
    setMessage('');

    localStorage.setItem('username', username);

    const { error } = await signInWithMagicLink(email, username);

    setLoading(false);

    if (error) {
      setMessage(`Erro: ${error.message}`);
    } else {
      setMessage('Check your email for the login link!');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div
        className={`w-full max-w-md p-5 bg-white rounded-2xl shadow-lg animate-fade-in-translate`}
      >
        <div className="">
          <h1 className="title ">
            Welcome to CodeLeap network!
          </h1>
          <p className=" ">Enter your email to receive a magic link</p>
        </div>

        {message && (
          <div
            className={`p-4 login-message-animation rounded-md transition-all duration-300 ease-in-out transform ${message.includes('Erro') ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700 fade-in'}`}
          >
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          <div className="relative">
            <label htmlFor="username" className="block">
              Please enter your username
            </label>
            <input
              id="username"
              name="username"
              type="text"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300 ease-in-out h-8"
              placeholder="John Doe"
            />
            <div className={`absolute bottom-0 left-0 h-0.5 bg-blue-500 transition-all duration-300 ease-out ${username ? 'w-full' : 'w-0'}`}></div>
          </div>

          <div className="relative">
            <label htmlFor="email" className="block">
              Please enter your email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300 ease-in-out h-8"
              placeholder="johndoe@email.com"
            />
            <div className={`absolute bottom-0 left-0 h-0.5 bg-blue-500 transition-all duration-300 ease-out ${email ? 'w-full' : 'w-0'}`}></div>
          </div>

          <div className='w-full text-right'>
            <Button
              type='submit'
              isLoading={loading}
              className='bg-default-blue w-[120px] h-8 px-2 text-white font-bold cursor-pointer disabled:cursor-default'
              disabled={loading}
            >
              Send Magic Link
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
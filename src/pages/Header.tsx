import { LogOut } from 'lucide-react';
import React from 'react';
import { useAuth } from '../contexts/AuthContext';

export default function Header({ isScrolled }: {isScrolled: boolean}) {
    const { signOut } = useAuth();
  return (
    <header
      className={`bg-default-blue text-white px-4 flex items-center fixed top-0 max-w-[800px] w-full z-10 transition-all duration-300 ${isScrolled ? 'py-2' : 'py-6'}`}
      style={{ boxShadow: isScrolled ? '0 2px 4px rgba(0,0,0,0.1)' : 'none' }}
    >
      <div className="w-full max-w-3xl mx-auto flex justify-between items-center">
        <h1 className={`title transition-all duration-300 ${isScrolled ? 'text-lg' : 'text-xl'}`}>
          CodeLeap Network
        </h1>
        <button
          onClick={signOut}
        >
          <LogOut
            color='white'
            className='cursor-pointer lg:hidden block'
          />
        </button>
      </div>
    </header>
  );
}
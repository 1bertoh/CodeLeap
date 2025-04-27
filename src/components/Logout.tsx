import { LogOut } from 'lucide-react'
import React from 'react'
import { useAuth } from '../contexts/AuthContext';

type Props = {}

const Logout = (props: Props) => {
      const { signOut } = useAuth();
  return (
    <button
        onClick={signOut} 
        className='bg-default-blue p-5 rounded-full fixed top-6 left-3 hover:animate-bounce cursor-pointer shadow-lg lg:block hidden'
    >
        <LogOut color='white'/>
    </button>
  )
}

export default Logout
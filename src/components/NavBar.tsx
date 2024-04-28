import React from 'react';
import { useRouter } from 'next/router';
import { useAuth } from './useAuth';
import { signOut } from "firebase/auth";
import { auth } from '../firebase-config';

const NavBar = () => {
  const user = useAuth();
  const router = useRouter();

  const logOut = async () => {
    try {
      await signOut(auth);
      router.push('/login');
    } catch (error) {
      console.error('Logout failed', error);
    }
  };

  return (
    <div className="flex justify-between items-center p-4">
      <img src="/images.png" alt="Decorative Image" className="w-20 h-20" />
      {user ? (
        <div className="relative group">
          <div className="w-10 h-10 rounded-full bg-backy text-white flex items-center justify-center text-lg font-bold cursor-pointer">
            {user.email[0].toUpperCase()}
          </div>
          <div className="absolute right-0 top-full mt-2 hidden group-hover:block">
            <button onClick={logOut} className="bg-red-100 text-red-800 hover:bg-red-200 font-bold py-1 px-4 rounded text-sm">
              Logout
            </button>
          </div>
        </div>
      ) : (
        <button onClick={() => router.push('/login')} className="bg-backy text-white hover:bg-gray-600 py-1 px-4 rounded-md">
          Log In
        </button>
      )}
    </div>
  );
};

export default NavBar;
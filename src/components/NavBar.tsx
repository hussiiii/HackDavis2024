import React from 'react';
import { useRouter } from 'next/router';
import { useAuth } from './useAuth';
import { signOut } from "firebase/auth";
import { auth } from '../firebase-config';
import Link from 'next/link';

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

  const isAdmin = user && user.email === "admin@hello.com";

  return (
    <div className="flex justify-between items-center p-4 bg-creamy">
      <Link href="/">
        <img src="/images.png" alt="Decorative Image" className="w-20 h-20 cursor-pointer" />
      </Link>
      {user ? (
        <div className="relative group">
          {user.email ? (
            <div className="w-10 h-10 rounded-full bg-backy text-white flex items-center justify-center text-lg font-bold cursor-pointer">
              {user.email[0].toUpperCase()}
            </div>
          ) : (
            <div className="w-10 h-10 rounded-full bg-backy text-white flex items-center justify-center text-lg font-bold cursor-pointer">
              U
            </div>
          )}

          {/* Dropdown Menu */}
          <div className="absolute right-0 top-full w-48 bg-white border border-gray-200 rounded-lg shadow-lg hidden group-hover:block z-10">
            <div className="py-2">
              <div className="px-4 py-2 text-gray-800 font-semibold">
                {'Menu'}
              </div>
              <hr className="border-t border-gray-300" />
              <button
                onClick={() => router.push('/profile')}
                className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                Profile
              </button>
              {isAdmin && (
                <>
                  <button
                    onClick={() => router.push('/clockin-sheet')}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Clock In Sheet
                  </button>
                  <button
                    onClick={() => router.push('/clockout-sheet')}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Clock Out Sheet
                  </button>
                  <button
                    onClick={() => router.push('/manage-users')}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Manage Users
                  </button>
                </>
              )}
              <button
                onClick={logOut}
                className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
              >
                Logout
              </button>
            </div>
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
import React, { useState } from 'react';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "../firebase-config";
import { useRouter } from 'next/router';

const daysOfWeek = [
  { name: 'Sunday', value: '1' },
  { name: 'Monday', value: '2' },
  { name: 'Tuesday', value: '3' },
  { name: 'Wednesday', value: '4' },
  { name: 'Thursday', value: '5' },
  { name: 'Friday', value: '6' },
  { name: 'Saturday', value: '7' },
];

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');
  const [isCreatingAccount, setIsCreatingAccount] = useState(false);
  const [availableDays, setAvailableDays] = useState<string[]>([]);

  const router = useRouter();

  const handleToggle = () => {
    setIsCreatingAccount((prev) => !prev);
  };

  const handleCheckboxChange = (day: string) => {
    setAvailableDays(prev =>
      prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day]
    );
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(''); // Reset error message on new submission
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      const formattedPhone = `+1${phone}`;

      // Save user data to the database using fetch
      const response = await fetch('/api/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username,
          email: user.email,
          phone: formattedPhone,
          availability: availableDays.join(''),
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create user');
      }

      router.push('/');
    } catch (error: any) {
      setError(error.message);
    }
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(''); // Reset error message on new submission
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      router.push('/');
    } catch (error: any) {
      setError(error.message);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;

      // Check if user exists in the database
      const response = await fetch(`/api/getUserInfo?email=${user.email}`);
      if (response.status === 404) {
        // User does not exist, create a new user with default username
        await fetch('/api/users', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            username: 'NEWUSER',
            email: user.email,
            phone: '',
            availability: '',
          }),
        });
      }

      router.push('/');
    } catch (error: any) {
      setError(error.message);
    }
  };

  return (
    <div className="flex flex-col justify-center items-center min-h-screen bg-creamy">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-2">Welcome to Aggie House!</h2>
        <p className="text-gray-600 mb-4">
          Please {isCreatingAccount ? 'create an account' : 'sign into your account'} below
        </p>
        <p className="text-blue-500 cursor-pointer" onClick={handleToggle}>
          or {isCreatingAccount ? 'sign into your account' : 'create an account'}
        </p>
      </div>
      <div className="w-full max-w-md p-8 bg-white rounded-lg border border-gray-300">
        <form onSubmit={isCreatingAccount ? handleSignUp : handleSignIn}>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="email">
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="border rounded-lg w-full py-2 px-3 text-gray-700 focus:outline-none focus:ring focus:border-blue-300"
              required
            />
          </div>
          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="password">
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="border rounded-lg w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring focus:border-blue-300"
              required
            />
          </div>
          {isCreatingAccount && (
            <>
              <div className="mb-6">
                <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="username">
                  Username 
                </label>
                <input
                  type="text"
                  id="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="border rounded-lg w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring focus:border-blue-300"
                  required
                />
              </div>
              <div className="mb-6">
                <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="phone">
                  Phone Number (no symbols or spaces)
                </label>
                <input
                  type="text"
                  id="phone"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="border rounded-lg w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring focus:border-blue-300"
                  required
                />
              </div>
              <div className="mb-6">
                <label className="block text-gray-700 text-sm font-medium mb-2">
                  I am generally free on...
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {daysOfWeek.map((day) => (
                    <div key={day.value} className="flex items-center">
                      <input
                        type="checkbox"
                        id={day.name}
                        value={day.value}
                        onChange={() => handleCheckboxChange(day.value)}
                        className="mr-2"
                      />
                      <label htmlFor={day.name} className="text-gray-700 text-sm">
                        {day.name}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
          <div className="text-center mb-6">
            <span className="block text-gray-500 text-sm mb-4">OR</span>
            <button type="button" className="py-3 px-24 inline-flex justify-center items-center gap-x-2 text-sm font-medium rounded-lg border border-gray-300 bg-white shadow-sm text-black hover:bg-gray-200" onClick={handleGoogleSignIn}>
              <svg className="w-4 h-auto" width="46" height="47" viewBox="0 0 46 47" fill="none">
                <path d="M46 24.0287C46 22.09 45.8533 20.68 45.5013 19.2112H23.4694V27.9356H36.4069C36.1429 30.1094 34.7347 33.37 31.5957 35.5731L31.5663 35.8669L38.5191 41.2719L38.9885 41.3306C43.4477 37.2181 46 31.1669 46 24.0287Z" fill="#4285F4"/>
                <path d="M23.4694 47C29.8061 47 35.1161 44.9144 39.0179 41.3012L31.625 35.5437C29.6301 36.9244 26.9898 37.8937 23.4987 37.8937C17.2793 37.8937 12.0281 33.7812 10.1505 28.1412L9.88649 28.1706L2.61097 33.7812L2.52296 34.0456C6.36608 41.7125 14.287 47 23.4694 47Z" fill="#34A853"/>
                <path d="M10.1212 28.1413C9.62245 26.6725 9.32908 25.1156 9.32908 23.5C9.32908 21.8844 9.62245 20.3275 10.0918 18.8588V18.5356L2.75765 12.8369L2.52296 12.9544C0.909439 16.1269 0 19.7106 0 23.5C0 27.2894 0.909439 30.8731 2.49362 34.0456L10.1212 28.1413Z" fill="#FBBC05"/>
                <path d="M23.4694 9.07688C27.8699 9.07688 30.8622 10.9863 32.5344 12.5725L39.1645 6.11C35.0867 2.32063 29.8061 0 23.4694 0C14.287 0 6.36607 5.2875 2.49362 12.9544L10.0918 18.8588C11.9987 13.1894 17.25 9.07688 23.4694 9.07688Z" fill="#EB4335"/>
              </svg>
              Continue with Google
            </button>
          </div>
          <div className="text-center">
            <button
              type="submit"
              className="w-full bg-backy hover:bg-gray-600 text-white py-2 px-4 rounded focus:outline-none focus:ring focus:border-blue-300"
            >
              {isCreatingAccount ? 'Create Account' : 'Login'}
            </button>
          </div>
          {error && (
            <p className="text-red-500 text-xs italic mt-4 text-center">
              {error}
            </p>
          )}
        </form>
      </div>
    </div>
  );
};

export default Login;
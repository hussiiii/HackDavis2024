import React, { useState, useEffect } from 'react';
import NavBar from '@/components/NavBar';
import { useAuth } from '@/components/useAuth';
import { useRouter } from 'next/router';
import Footer from '@/components/Footer';

const ManageUsersPage = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const user = useAuth();
  const router = useRouter();

  // If user is not an admin, redirect them to home
  useEffect(() => {
    if (user) {
      if (user.email !== 'admin@hello.com') {
        router.push('/');
      } else {
        setLoading(false);
      }
    }
  }, [user, router]);

  useEffect(() => {
      const fetchUsers = async () => {
        try {
          const response = await fetch('/api/users');
          const data = await response.json();
          // Sort the data by username in ascending order
          const sortedData = data.sort((a: any, b: any) => a.username.localeCompare(b.username));
          setUsers(sortedData);
        } catch (error) {
          console.error('Error fetching users:', error);
        }
      };

      fetchUsers();
    }, []);

  const removeUser = async (userId: any) => {
    try {
      const response = await fetch(`/api/users?user_id=${userId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        const data = await response.json();
        console.log('User deleted:', data);

        // Update state to remove user
        setUsers((prevUsers) => prevUsers.filter((user) => user.user_id !== userId));
      } else {
        console.error('Failed to delete user:', response.statusText);
      }
    } catch (error) {
      console.error('Error during deletion:', error);
    }
  }

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
      <div className="flex flex-col min-h-screen">
        <NavBar />
        <div className="flex-grow p-8 max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold mb-4">Volunteers</h1>
          <p className="mb-5" style={{ fontSize: '17px', color: 'grey' }}>
              Volunteers are listed in alphabetical order of their username. You can remove a user by clicking the Remove button.
          </p>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 border border-gray-200 table-fixed">
              <thead className="bg-greeny">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-black uppercase tracking-wider">Username</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-black uppercase tracking-wider">Email</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-black uppercase tracking-wider">Phone Number</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-black uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {users.map((user) => (
                  <tr key={user.user_id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.username}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.email}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.phone}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <button
                        className="text-red-500 hover:text-red-700 font-semibold"
                        onClick={() => removeUser(user.user_id)}
                      >
                        Remove
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <Footer />
      </div>
    );
};

export default ManageUsersPage;
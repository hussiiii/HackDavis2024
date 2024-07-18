import React, { useState, useEffect } from 'react';
import NavBar from '@/components/NavBar';
import { useAuth } from '@/components/useAuth';
import { useRouter } from 'next/router';

const Profile = () => {
  const [username, setUsername] = useState('');
  const [phone, setPhone] = useState('');
  const [availableDays, setAvailableDays] = useState<string[]>([]);
  const user = useAuth();
  const router = useRouter();

  const daysOfWeek = [
    { name: 'Sunday', value: '1' },
    { name: 'Monday', value: '2' },
    { name: 'Tuesday', value: '3' },
    { name: 'Wednesday', value: '4' },
    { name: 'Thursday', value: '5' },
    { name: 'Friday', value: '6' },
    { name: 'Saturday', value: '7' },
  ];

  useEffect(() => {
    if (user) {
      fetch(`/api/getUserInfo?email=${user.email}`)
        .then(response => response.json())
        .then(data => {
          setUsername(data.username);
          setPhone(data.phone);
          setAvailableDays(data.availability.split(''));
        })
        .catch(error => console.error('Error fetching user data:', error));
    }
  }, [user]);

  const handleCheckboxChange = (day: string) => {
    setAvailableDays(prev =>
      prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day]
    );
  };

  const handleSaveChanges = async () => {
    try {
      const response = await fetch(`/api/updateUserInfo?email=${user?.email}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username,
          phone,
          availability: availableDays.join(''),
        }),
      });

      if (response.ok) {
        console.log('Profile updated successfully');
      } else {
        console.error('Failed to update profile');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <NavBar />
      <div className="mt-8">
        <h1 className="text-4xl mb-6">Profile</h1>
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
              Username
            </label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="border rounded-lg w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring focus:border-blue-300"
            />
          </div>
          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
              Phone
            </label>
            <input
              type="text"
              id="phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="border rounded-lg w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring focus:border-blue-300"
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
                    checked={availableDays.includes(day.value)}
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
        </div>
        <button
          onClick={handleSaveChanges}
          className="bg-backy text-white py-2 px-4 rounded-lg"
        >
          Save Changes
        </button>
      </div>
    </div>
  );
};

export default Profile;
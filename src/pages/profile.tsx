import React, { useState, useEffect } from 'react';
import NavBar from '@/components/NavBar';
import { useAuth } from '@/components/useAuth';
import { useRouter } from 'next/router';
import Footer from '@/components/Footer';

const Profile = () => {
  const [username, setUsername] = useState('');
  const [phone, setPhone] = useState('');
  const [availableDates, setAvailableDates] = useState<string[]>([]);
  const [selectedDates, setSelectedDates] = useState<string[]>([]);
  const user = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (user) {
      // Fetch user info
      fetch(`/api/getUserInfo?email=${user.email}`)
        .then(response => response.json())
        .then(data => {
          setUsername(data.username);
          setPhone(data.phone);
          setSelectedDates(data.availabilities.map((availability: any) => new Date(availability.date).toISOString()));
        })
        .catch(error => console.error('Error fetching user data:', error));

      // Fetch available dates from the Shift table
      fetch('/api/shifts')
        .then(response => response.json())
        .then(data => {
          const dates = data.map((shift: any) => new Date(shift.date).toISOString());
          setAvailableDates(dates);
        })
        .catch(error => console.error('Error fetching shifts:', error));
    }
  }, [user]);

  const handleCheckboxChange = (date: string) => {
    setSelectedDates(prev =>
      prev.includes(date) ? prev.filter(d => d !== date) : [...prev, date]
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
          availability: selectedDates,
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
    <>
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
                {availableDates.map((date) => (
                  <div key={date} className="flex items-center">
                    <input
                      type="checkbox"
                      id={date}
                      value={date}
                      checked={selectedDates.includes(date)}
                      onChange={() => handleCheckboxChange(date)}
                      className="mr-2"
                    />
                    <label htmlFor={date} className="text-gray-700 text-sm">
                      {new Date(date).toLocaleDateString()}
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
      <Footer />
    </>
  );
};

export default Profile;
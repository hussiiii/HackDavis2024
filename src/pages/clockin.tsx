import React, { useState, useEffect } from 'react';
import NavBar from '@/components/NavBar';
import { useAuth } from '@/components/useAuth';
import { useRouter } from 'next/router';
import Footer from '@/components/Footer';

const Clockin = () => {
  const user = useAuth();
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [coVolunteer, setCoVolunteer] = useState('');
  const [onTime, setOnTime] = useState('');
  const [comments, setComments] = useState('');

  useEffect(() => {
    if (user) {
      fetch(`/api/getUserInfo?email=${user.email}`)
        .then(response => response.json())
        .then(data => {
          setUsername(data.username);
        })
        .catch(error => console.error('Error fetching user data:', error));
    }
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const clockInData = {
      date: new Date(),
      volunteer: username,
      covolunteer: coVolunteer,
      onTime,
      comments,
    };

    try {
      const response = await fetch('/api/clockin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(clockInData),
      });

      if (response.ok) {
        router.push('/');
      } else {
        alert('Failed to clock in.');
      }
    } catch (error) {
      console.error('Error clocking in:', error);
      alert('An error occurred. Please try again.');
    }
  };

  return (
    <>
      <div className="p-8 max-w-4xl mx-auto">
        <NavBar />
        <div className="mt-12">
          <h1 className="text-4xl font-bold mb-4">Clock In</h1>
          <p className="text-gray-600 mb-6">
            Please fill out the following form to clock in for your shift.
          </p>

          <form className="space-y-6" onSubmit={handleSubmit}>
            {/* Co-Volunteer Name */}
            <div>
              <label className="block text-lg font-medium text-gray-700" htmlFor="co-volunteer">
                Who is your co-volunteer? (Include First and Last name)<span className="text-red-600">*</span>
              </label>
              <input
                type="text"
                id="co-volunteer"
                name="co-volunteer"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="First Last"
                value={coVolunteer}
                onChange={(e) => setCoVolunteer(e.target.value)}
                required
              />
            </div>

            {/* Co-Volunteer On-Time */}
            <div>
              <label className="block text-lg font-medium text-gray-700" htmlFor="on-time">
                Is your co-volunteer on-time (or have they communicated when they will arrive)?<span className="text-red-600">*</span>
              </label>
              <fieldset className="mt-2 space-y-4">
                <div className="flex items-center">
                  <input
                    id="on-time-yes"
                    name="on-time"
                    type="radio"
                    value="Yes"
                    className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300"
                    onChange={(e) => setOnTime(e.target.value)}
                    required
                  />
                  <label htmlFor="on-time-yes" className="ml-3 block text-sm text-gray-700">
                    Yes
                  </label>
                </div>

                <div className="flex items-center">
                  <input
                    id="on-time-no"
                    name="on-time"
                    type="radio"
                    value="No"
                    className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300"
                    onChange={(e) => setOnTime(e.target.value)}
                    required
                  />
                  <label htmlFor="on-time-no" className="ml-3 block text-sm text-gray-700">
                    No (please explain in the next question)
                  </label>
                </div>

                <div className="flex items-center">
                  <input
                    id="on-time-alone"
                    name="on-time"
                    type="radio"
                    value="Alone"
                    className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300"
                    onChange={(e) => setOnTime(e.target.value)}
                    required
                  />
                  <label htmlFor="on-time-alone" className="ml-3 block text-sm text-gray-700">
                    I am scheduled by myself for this shift
                  </label>
                </div>

                <div className="flex items-center">
                  <input
                    id="on-time-other"
                    name="on-time"
                    type="radio"
                    value="Other"
                    className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300"
                    onChange={(e) => setOnTime(e.target.value)}
                    required
                  />
                  <label htmlFor="on-time-other" className="ml-3 block text-sm text-gray-700">
                    Other (Please explain in the next question)
                  </label>
                </div>
              </fieldset>
            </div>

            {/* Questions/Comments/Concerns */}
            <div>
              <label className="block text-lg font-medium text-gray-700" htmlFor="comments">
                Questions, comments, concerns:
              </label>
              <textarea
                id="comments"
                name="comments"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="Your answer"
                value={comments}
                onChange={(e) => setComments(e.target.value)}
              ></textarea>
            </div>

            {/* Submit Button */}
            <div>
              <button
                type="submit"
                className="w-1/4 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-backy hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Complete Clock in
              </button>
            </div>
          </form>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Clockin;
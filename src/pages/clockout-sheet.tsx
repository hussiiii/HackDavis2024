import React, { useState, useEffect } from 'react';
import NavBar from '@/components/NavBar';
import { useAuth } from '@/components/useAuth';
import { useRouter } from 'next/router';
import Footer from '@/components/Footer';

const Clockoutsheet = () => {
  const [clockOuts, setClockOuts] = useState<any[]>([]);
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
    const fetchClockOuts = async () => {
      try {
        const response = await fetch('/api/getClockouts');
        const data = await response.json();
        // Sort the data by date in descending order
        const sortedData = data.sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime());
        setClockOuts(sortedData);
      } catch (error) {
        console.error('Error fetching clock-outs:', error);
      }
    };

    fetchClockOuts();
  }, []);

  const formatDateToPST = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', { timeZone: 'America/Los_Angeles' });
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex flex-col min-h-screen">
      <NavBar />
      <div className="flex-grow p-8 max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-4">Clock Out Sheet</h1>
        <p className="mb-5" style={{ fontSize: '17px', color: 'grey' }}>
            Any time a volunteer submits the Clock Out form, that information will automatically be added as a new row below. It sorted so that the most recent clock outs are shown first, at the top.
        </p>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 border border-gray-200 table-fixed">
            <thead className="bg-greeny">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-black uppercase tracking-wider">Date</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-black uppercase tracking-wider">Time (PST)</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-black uppercase tracking-wider">Volunteer</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-black uppercase tracking-wider">Rating</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-black uppercase tracking-wider">Comments</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-black uppercase tracking-wider">Tasks Completed</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-black uppercase tracking-wider">Items to Purchase</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-black uppercase tracking-wider">Can Reach Out</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {clockOuts.map((clockOut) => (
                <tr key={clockOut.clockout_id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(clockOut.date).toLocaleDateString()}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatDateToPST(clockOut.date)}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{clockOut.volunteer}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{clockOut.rating}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{clockOut.comments}</td>
                  <td className="px-6 py-4 whitespace-normal text-sm text-gray-500 break-words">{clockOut.tasksCompleted}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{clockOut.items}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{clockOut.reachOut}</td>
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

export default Clockoutsheet;
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/components/useAuth';
import { auth } from '../firebase-config'; 
import { signOut } from "firebase/auth";
import Link from 'next/link';
import { useRouter } from 'next/router';
import NavBar from '@/components/NavBar';
import Footer from './Footer';

const TableView = () => {
  const [dates, setDates] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 7;
  const [selectedUser, setSelectedUser] = useState('');
  const [editingShiftId, setEditingShiftId] = useState(null);
  const [currentWeek, setCurrentWeek] = useState(1);
  const [todayVolunteers, setTodayVolunteers] = useState('');
  const [nextShift, setNextShift] = useState<any>(null);
  const [username, setUsername] = useState('');
  const [userPhone, setUserPhone] = useState('');
  const [userId, setUserId] = useState<number | null>(null);
  const [userShifts, setUserShifts] = useState<any[]>([]);
  const [isSwapModalOpen, setIsSwapModalOpen] = useState(false);
  const [swapReason, setSwapReason] = useState('');
  const [swapShiftId, setSwapShiftId] = useState<number | null>(null);
  const [swapShiftDate, setSwapShiftDate] = useState<string | null>(null); 
  const [swaps, setSwaps] = useState<any[]>([]);


  const user = useAuth();
  const router = useRouter();

  const isAdmin = user && user.email === "admin@hello.com";

  // Fetch shifts data from the server
  const fetchShifts = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Normalize the time part to ensure correct comparison
  
    fetch(`/api/shifts`)
      .then(response => response.json())
      .then(data => {
        console.log('Raw data:', data);
  
        const sortedData = data.sort((a: any, b: any) => Number(new Date(a.date)) - Number(new Date(b.date)));
        const formattedData = sortedData.map((shift: any) => {
          const shiftDate = new Date(shift.date);
          return {
            ...shift,
            formattedDate: `${shiftDate.toLocaleDateString('en-US', { weekday: 'long' })} - ${shiftDate.toLocaleDateString()}`,
            volunteer: shift.UserShifts.map((us: any) => us.User.username).join(', ')
          };
        });
  
        console.log('Formatted data:', formattedData);
  
        setDates(formattedData); 
  
        // Filter out today's shifts for displaying today's volunteers
        const todayShifts = formattedData.filter((shift: any) => {
          const shiftDate = new Date(shift.date);
          shiftDate.setHours(0, 0, 0, 0);
          return shiftDate.getTime() === today.getTime();
        });
  
        if (todayShifts.length > 0) {
          setTodayVolunteers(todayShifts.map((shift: any) => shift.volunteer).join(', '));
        } else {
          setTodayVolunteers('No volunteers scheduled for today');
        }
  
        if (user && user.email !== "admin@hello.com") {
          const userShifts = data.filter((shift: any) => shift.UserShifts.some((us: any) => us.User.email === user.email));
          const earliestShift = userShifts.sort((a: any, b: any) => Number(new Date(a.date)) - Number(new Date(b.date)))[0];
          setNextShift(earliestShift);
          setUserShifts(userShifts); // Set user shifts
        }
      })
      .catch(error => console.error('Error fetching shifts:', error));
  };

  // Fetch swaps data from the server
  const fetchSwaps = () => {
    fetch(`/api/getSwaps`)
      .then(response => response.json())
      .then(data => {
        setSwaps(data);
      })
      .catch(error => console.error('Error fetching swaps:', error));
  };

  useEffect(() => {

    if (user) {
      // fetch specific info of logged-in user 
      fetch(`/api/getUserInfo?email=${user.email}`)
        .then(response => response.json())
        .then(data => {
          setUsername(data.username);
          setUserPhone(data.phone);
          setUserId(data.user_id);

        // Check for default username and empty phone number
        if (data.username === "NEWUSER") {
          alert("Please change your username to your name from the Profile section!");
        }
        if (!data.phone) {
          alert("Please set your phone number in the Profile section!");
        }

        })
        .catch(error => console.error('Error fetching user data:', error));
    }

    fetchShifts();
    fetchSwaps();

    fetch(`/api/users`)
      .then(response => response.json())
      .then(setUsers)
      .catch(console.error);
  }, [user]);

  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentRows = dates.slice(indexOfFirstRow, indexOfLastRow);

  const handleNext = () => {
    setCurrentPage(prev => {
      const lastPage = Math.ceil(dates.length / rowsPerPage);
      const newPage = prev === lastPage ? 1 : prev + 1;
      setCurrentWeek(current => current === 4 ? 1 : current + 1);
      return newPage;
    });
  };

  const handlePrevious = () => {
    setCurrentPage(prev => {
      const lastPage = Math.ceil(dates.length / rowsPerPage);
      const newPage = prev === 1 ? lastPage : prev - 1;
      setCurrentWeek(current => current === 1 ? 4 : current - 1);
      return newPage;
    });
  };

  const removeVolunteer = async (shiftId: number, userId: number) => {
    const response = await fetch('/api/shifts', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ shift_id: shiftId, user_id: userId })
    });
    if (response.ok) {
      fetchShifts();  // Refetch shifts data
    } else {
      console.error('Error removing volunteer:', await response.json());
    }
  };

  const assignVolunteer = async () => {
    const response = await fetch('/api/shifts', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ shift_id: editingShiftId, user_id: selectedUser })
    });
    if (response.ok) {
      fetchShifts();  // Refetch shifts data
      setIsModalOpen(false);
    } else {
      console.error('Failed to add volunteer:', await response.json());
    }
  };

  const requestSwap = (shiftId: number, shiftDate: any) => {
    setSwapShiftId(shiftId);
    setSwapShiftDate(shiftDate);
    setIsSwapModalOpen(true);
  };

  const handleSwapSubmit = async () => {
    if (!swapShiftId || !swapReason) {
      console.error('Missing swapShiftId or swapReason');
      return;
    }

    try {
      const response = await fetch('/api/addToSwap', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          date: swapShiftDate,
          requester: username,
          requesterPhone: userPhone,
          reason: swapReason,
          shift_id: swapShiftId,
        }),
      });

      if (response.ok) {
        console.log('Swap request submitted successfully');
        setIsSwapModalOpen(false);
        fetchSwaps(); 
      } else {
        console.error('Failed to submit swap request:', await response.json());
      }
    } catch (error) {
      console.error('Error submitting swap request:', error);
    }
  };

  const handleAcceptSwap = async (swap: any) => {
    if (swap.requester === username) {
      alert("You cannot swap shifts with yourself!");
      return;
    }

    try {
      const response = await fetch('/api/acceptSwap', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          swap_id: swap.swap_id,
          new_user_id: userId // Assuming user object contains user_id
        }),
      });

      if (response.ok) {
        alert("Shift swap accepted successfully")
        fetchSwaps(); // Refresh the swaps list
        fetchShifts(); // Refresh the shifts list
      } else {
        console.error('Failed to accept shift swap:', await response.json());
      }
    } catch (error) {
      console.error('Error accepting shift swap:', error);
    }
  };

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <NavBar />

      {/* Welcome box */}
      <div className="flex flex-col items-start mb-4"> 
        {user && user.email !== "admin@hello.com" && (
          <>
          <h1 className="text-4xl font-bold mb-4">Welcome back, {username} 👋 </h1>
          <div style={{ width: '50%' }} className="p-4 bg-white border border-grey-200 my-4 rounded mb-4">
            <h3 className="text-3xl mb-5">
              Your next shift is {
                isNaN(new Date(nextShift?.date).getTime()) ? 
                "You have no scheduled shifts" : 
                <span className="text-backy" style={{ fontWeight: 'bold' }}>
                  {new Date(nextShift?.date).toLocaleDateString('en-US', {
                  weekday: 'long',
                  month: 'short',
                  day: 'numeric',
                })}</span>
              }
            </h3>
            <p className="mb-5" style={{ fontSize: '14px', color: 'grey' }}>
              Do not forget to clock in at the start of your shift to record your hours. If you have any questions please consult the volunteer website and then reach out if you need more support. Have a great shift!
            </p>
            <div className="flex space-x-4">
            <button
              className="bg-backy text-white hover:bg-gray-600 py-1 px-4 rounded-md"
              onClick={()=> router.push('/clockin')}
            >
              Clock In
            </button>
            <button
              className="bg-backy text-white hover:bg-gray-600 py-1 px-4 rounded-md"
              onClick={()=> router.push('/clockout')}
            >
              Clock Out
            </button>
          </div>
          </div>
          </>
        )}


        {/* Your shifts section */}
        {user && user.email !== "admin@hello.com" && (
          <div className="p-4 rounded-lg my-4 mb-4 w-full">
            <h3 className="text-2xl font-semibold mb-4">Your shifts</h3>
            
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3">
              {userShifts.map((shift) => (
                <div
                  key={shift.shift_id}
                  className="p-4 border border-gray-300 rounded-lg shadow-sm bg-white"
                >
                  <div className="mb-2">
                    <span className="block text-lg font-medium">
                      {new Date(shift.date).toLocaleDateString('en-US', {
                        weekday: 'long',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </span>
                    <span className="block text-gray-500">
                      7:30PM - 8:00PM
                    </span>
                  </div>
                  <div className="flex items-center justify-between mt-2">
                    <button
                      className="bg-white text-black border border-bg-gray-800 hover:bg-gray-200 py-1 px-3 rounded-md text-sm"
                      onClick={() => requestSwap(shift.shift_id, shift.date)}
                    >
                      Request Swap
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        {isSwapModalOpen && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center">
          <div className="relative p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3 text-center">
              <h3 className="text-lg leading-6 font-medium text-gray-900">Enter reason you cannot make the shift below</h3>
              <div className="mt-2 px-7 py-3">
                <input
                  type="text"
                  className="form-input mt-1 block w-full"
                  value={swapReason}
                  onChange={(e) => setSwapReason(e.target.value)}
                />
              </div>
              <div className="items-center px-4 py-3">
                <button
                  className="mb-2 px-4 py-2 bg-green-500 text-white text-base font-medium rounded-md w-full shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-300"
                  onClick={handleSwapSubmit}
                >
                  Submit
                </button>
                <button
                  className="px-4 py-2 bg-red-100 text-white text-base font-medium rounded-md shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-300"
                  onClick={() => setIsSwapModalOpen(false)}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}


        {/* Available swaps section */}
        {user && user.email !== "admin@hello.com" && (
        <div className="p-4 rounded-lg my-4 mb-24 w-full">
          <h3 className="text-2xl font-semibold mb-4">Shifts that volunteers have requested to swap</h3>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3">
          {swaps.map((swap) => (
            <div
              key={swap.swap_id}
              className="p-4 border border-gray-300 rounded-lg shadow-sm bg-white"
            >
              <div className="mb-2">
                <span className="block text-lg font-medium">
                  {new Date(swap.date).toLocaleDateString('en-US', {
                    weekday: 'long',
                    month: 'long',
                    day: 'numeric',
                  })}
                </span>
                <span className="block text-gray-500">
                  {swap.requester}
                </span>
                <span className="block text-gray-500">
                  {swap.requesterPhone}
                </span>
                <span className="block text-gray-500 mb-2">
                  {swap.reason}
                </span>
                <button
                  className="bg-white text-black border border-bg-gray-800 hover:bg-gray-200 py-1 px-3 rounded-md text-sm"
                  onClick={() => handleAcceptSwap(swap)}
                >
                  Take This Shift
                </button>
              </div>
            </div>
            ))}
          </div>
        </div>
        )}


        {/* The actual table */}
        <span className="text-lg font-semibold mb-4 text-green-800">SCHEDULED FOR TODAY: <span className="bg-backy text-white px-2 py-1 rounded-full">{todayVolunteers.length > 0 ? todayVolunteers : 'No volunteers scheduled for today'}</span></span>
        <span className="text-lg font-semibold bg-greeny py-1 px-4 rounded-md">Week {currentWeek}</span> {/* Week text */}
      </div>
      <table className="min-w-full divide-y divide-gray-200 border border-gray-200">
        <thead className="bg-greeny">
          <tr>
            <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-black uppercase tracking-wider">Date</th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-black uppercase tracking-wider">Time</th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-black uppercase tracking-wider">Status</th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-black uppercase tracking-wider">Volunteers</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
        {currentRows.map(shift => (
          <tr key={shift.shift_id}>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{shift.formattedDate}</td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">7:30PM - 8:00PM</td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              {shift.volunteer?.length > 0 ? (
                <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full">
                  Assigned
                </span>
              ) : (
                <span className="bg-red-100 text-red-800 px-2 py-1 rounded-full">
                  Unassigned
                </span>
              )}
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
            <div className="flex flex-col space-y-1">
            {shift.volunteer && shift.volunteer.split(', ').map((volunteer: any, index: any) => (
              volunteer.trim() !== "" && (
                <div key={index} className="flex items-center space-x-2"> 
                  <span className="bg-backy text-white px-2 py-1 rounded-full">
                    {volunteer}
                  </span>
                  {isAdmin && (
                    <button
                      className="text-red-500 hover:text-red-700"
                      onClick={() => removeVolunteer(shift.shift_id, users.find(u => u.username === volunteer).user_id)}
                    >
                      X
                    </button>
                  )}
                </div>
              )
            ))}
          <div className="flex items-center"> 
          {isAdmin && (
            <button
              className="bg-green-200 hover:bg-green-400 text-black px-12 py-1 rounded-full text-black"
              onClick={() => { setIsModalOpen(true); setEditingShiftId(shift.shift_id); }}
            >
              Add
            </button>
          )}
          </div>

            </div>
          </td>
          </tr>
        ))}
        </tbody>
      </table>
      <div className="flex justify-end mt-4">
        <button onClick={handlePrevious} className="bg-white border border-gray-200 hover:bg-gray-400 text-black py-1 px-2 rounded-md mx-3">
          Previous
        </button>
        <button onClick={handleNext} className="bg-backy text-white hover:bg-gray-600 py-1 px-4 rounded-md">
          Next
        </button>
      </div>
      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center" id="my-modal">
          <div className="relative p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3 text-center">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
                {/* Icon or image can go here */}
              </div>
              <h3 className="text-lg leading-6 font-medium text-gray-900">Assign Volunteer</h3>
              <div className="mt-2 px-7 py-3">
                <select onChange={(e) => setSelectedUser(e.target.value)} className="form-select block w-full mt-1 border-gray-300">
                  {users.filter(user => user.username !== "Admin").map(user => (
                    <option key={user.user_id} value={user.user_id}>{user.username}</option>
                  ))}
                </select>
              </div>
              <div className="items-center px-4 py-3">
                <button
                  className="mb-2 px-4 py-2 bg-green-500 text-white text-base font-medium rounded-md w-full shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-300"
                  onClick={assignVolunteer}
                >
                  Confirm
                </button>
                <button
                  className="px-4 py-2 bg-red-100 text-white text-base font-medium rounded-md shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-300"
                  onClick={() => setIsModalOpen(false)}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default TableView;
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/components/useAuth';
import { auth } from '../firebase-config'; 
import { signOut } from "firebase/auth";
import Link from 'next/link';
import { useRouter } from 'next/router';
import NavBar from '@/components/NavBar';



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
  const [isClockedIn, setIsClockedIn] = useState(false);


  const user = useAuth();
  const router = useRouter();


    // Function to check if the user is an admin
  const isAdmin = user && user.email === "admin@hello.com";


  // Fetch shifts data from the server
  const fetchShifts = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Normalize the time part to ensure correct comparison
  
    fetch(`/api/shifts`)
      .then(response => response.json())
      .then(data => {
        const sortedData = data.sort((a: any, b: any) => Number(new Date(a.date)) - Number(new Date(b.date)));
        const formattedData = sortedData.map((shift:any) => ({
          ...shift,
          formattedDate: `${new Date(shift.date).toLocaleDateString('en-US', { weekday: 'long' })} - ${new Date(shift.date).toLocaleDateString()}`,
          volunteer: shift.UserShifts.map((us:any) => us.User.username).join(', ')
        }));
        setDates(formattedData); // Continue to set all shifts
  
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
        const userShifts = data.filter((shift:any) => shift.UserShifts.some((us:any) => us.User.email === user.email));
        const earliestShift = userShifts.sort((a: any, b: any) => Number(new Date(a.date)) - Number(new Date(b.date)))[0];
        setNextShift(earliestShift);
      }
    })
      .catch(error => console.error('Error fetching shifts:', error));
  };

  useEffect(() => {
    fetchShifts();

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

  const logOut = async () => {
    try {
      await signOut(auth);
      console.log('User logged out successfully');
      // Redirect to login page or root after logging out
      router.push('/table-view'); 
    } catch (error) {
      console.error('Logout failed', error);
    }
  };

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <NavBar />

      <div className="flex flex-col items-start mb-4"> {/* Changed to items-start for left alignment */}
        {user && user.email !== "admin@hello.com" && (
          <div style={{ width: '50%' }} className="p-4 bg-white border border-grey-200 my-4 rounded mb-24">
            <h3 className="text-xl mb-5">
              Your next upcoming shift is: {
                isNaN(new Date(nextShift?.date).getTime()) ? 
                "You have no scheduled shifts" : 
                <span style={{ fontWeight: 'bold' }}>{new Date(nextShift?.date).toLocaleDateString()}</span>
              }
            </h3>
            <p className="mb-5" style={{ fontSize: '14px', color: 'grey' }}>
              Do not forget to clock in at the start of your shift to record your hours. If you have any questions please consult the volunteer website and then reach out if you need more support. Have a great shift!
            </p>
            <button
              className="bg-backy text-white hover:bg-gray-600 py-1 px-56 rounded-md"
              onClick={() => setIsClockedIn(!isClockedIn)}
            >
              {isClockedIn ? 'Clock Out' : 'Clock In'}
            </button>
          </div>
        )}
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
                  onClick={async () => {
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
                  }}
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
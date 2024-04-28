import React, { useState, useEffect } from 'react';

const TableView = () => {
  const [dates, setDates] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedUserId, setSelectedUserId] = useState("");
  const [selectedShiftId, setSelectedShiftId] = useState("");
  const rowsPerPage = 7;


  // Fetch shifts data from the server
  useEffect(() => {
    fetch(`/api/shifts`)
      .then(response => response.json())
      .then(data => {
        // Sort the data by date
        const sortedData = data.sort((a:any, b:any) => new Date(a.date) - new Date(b.date));
        // Format dates on the client side to include the day of the week
        const formattedData = sortedData.map((shift:any) => ({
          ...shift,
          formattedDate: `${new Date(shift.date).toLocaleDateString('en-US', { weekday: 'long' })} - ${new Date(shift.date).toLocaleDateString()}`
        }));
        setDates(formattedData);
      })
      .catch(error => console.error('Error fetching shifts:', error));

      fetch(`/api/users`)
      .then(response => response.json())
      .then(setUsers)
      .catch(console.error);
  }, []);

  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentRows = dates.slice(indexOfFirstRow, indexOfLastRow);

  const handleNext = () => {
    setCurrentPage(prev => {
      // If the current page is the last page, loop back to the first page
      const lastPage = Math.ceil(dates.length / rowsPerPage);
      return prev === lastPage ? 1 : prev + 1;
    });
  };

  const handlePrevious = () => {
    setCurrentPage(prev => {
      // If the current page is the first page, loop back to the last page
      const lastPage = Math.ceil(dates.length / rowsPerPage);
      return prev === 1 ? lastPage : prev - 1;
    });
  };

  const assignShift = (userId:String, shiftId:String) => {
    if (!selectedUserId || !selectedShiftId) {
      alert('Please select a user and shift.');
      return;
    }

    fetch(`/api/users`, {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId,
        shiftId
      }),
    }).then((response) => {
      console.log("Success!");
      // dates.find((shift) => shift.id === shiftId).volunteer =
    }).catch(() => console.log("Fail :("));
  }

  return (
    <div>
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time</th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Volunteers</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {currentRows.map(shift => (
            <tr key={shift.shift_id}>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{shift.formattedDate}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">7:30PM - 8:00PM</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">null</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {shift.volunteer || (
                  <button
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded"
                    onClick={() => {
                      setSelectedShiftId(shift.shift_id);
                      setIsModalOpen(true);
                    }}
                  >
                    Assign
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="flex justify-end mt-4">
        <button onClick={handlePrevious} className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded-l">
          Previous
        </button>
        <button onClick={handleNext} className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded-r">
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
                <select className="form-select block w-full mt-1 border-gray-300" onChange={(e) => setSelectedUserId(e.target.value)}>
                  {users.map(user => (
                    <option key={user.id} value={user.id}>{user.username}</option>
                  ))}
                </select>
              </div>
              <div className="items-center px-4 py-3">
                <button
                  className="mb-2 px-4 py-2 bg-green-500 text-white text-base font-medium rounded-md w-full shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-300"
                  onClick={() => {
                    assignShift(selectedUserId, selectedShiftId)
                    setIsModalOpen(false);
                    setSelectedShiftId("")
                  }}
                >
                  Confirm
                </button>
                <button
                  className="px-4 py-2 bg-red-500 text-white text-base font-medium rounded-md shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-300"
                  onClick={() => {
                    setIsModalOpen(false)
                    setSelectedShiftId("")
                  }}
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
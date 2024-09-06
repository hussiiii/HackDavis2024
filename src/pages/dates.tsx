import React from 'react';
import axios from 'axios';

const DatesPage = () => {
  const handleGenerateDates = async () => {
    try {
      const response = await axios.post('/api/generateTableDates', {
        startDate: '2024-09-26', // Set your desired starting date here
      });
      console.log(response.data.message);
    } catch (error) {
      console.error('Error generating dates:', error);
    }
  };

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Generate Table Dates</h1>
      <button
        onClick={handleGenerateDates}
        className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-700"
      >
        Generate Dates
      </button>
    </div>
  );
};

export default DatesPage;
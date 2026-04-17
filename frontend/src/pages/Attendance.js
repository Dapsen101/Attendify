import React, { useState } from 'react';
import API from '../api/axios';

function Attendance() {
  const [matricNumber, setMatricNumber] = useState('');
  const [token, setToken] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    alert(`Submitted token ${token} for ${matricNumber}`);
    // Later: call backend API to submit attendance
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <div className="bg-white p-10 rounded-xl shadow-md w-full max-w-md flex flex-col gap-6">
        <h1 className="text-3xl font-bold text-blue-600 text-center">Submit Attendance</h1>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            placeholder="Matric Number"
            value={matricNumber}
            onChange={e => setMatricNumber(e.target.value)}
            className="border border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            placeholder="Session Token"
            value={token}
            onChange={e => setToken(e.target.value)}
            className="border border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            className="bg-blue-600 text-white p-3 rounded-md font-semibold hover:bg-blue-700 transition"
          >
            Submit Attendance
          </button>
        </form>
      </div>
    </div>
  );
}

export default Attendance;
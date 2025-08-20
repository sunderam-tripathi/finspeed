import React from 'react';

const WelcomePage = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 text-center">
      <div className="max-w-md p-8 bg-white rounded-lg shadow-lg">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">Finspeed</h1>
        <h2 className="text-2xl font-semibold text-gray-600 mb-2">Coming Soon</h2>
        <p className="text-gray-500 mb-6">
          We are working hard to bring you an amazing online shopping experience. Our store will be launching soon!
        </p>
        <p className="text-sm text-gray-400">
          &copy; {new Date().getFullYear()} Finspeed. All rights reserved.
        </p>
      </div>
    </div>
  );
};

export default WelcomePage;

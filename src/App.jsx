import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function App() {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gray-100">
      <h1 className="text-4xl font-bold text-blue-600">
        Tailwind CSS is Working! 🎉
      </h1>
      <p className="mt-4 text-lg text-gray-700">
        Welcome to <span className="font-semibold">E-GameBazzi</span>
      </p>
      <button className="mt-6 px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-all">
        Test Button
      </button>
    </div>
  );
}

export default App;

import { BrowserRouter, Routes, Route } from "react-router-dom";
import Signup from "./pages/Signup.jsx";
import Login from "./pages/Login.jsx";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={
          <div className="min-h-screen flex flex-col justify-center items-center bg-gray-100">
            <h1 className="text-4xl font-bold text-blue-600">
              Tailwind CSS is Working! 🎉
            </h1>
            <p className="mt-4 text-lg text-gray-700">
              Welcome to <span className="font-semibold">E-GameBazzi</span>
            </p>
            <div className="flex gap-4 mt-6">
              <a href="/login" className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">Login</a>
              <a href="/signup" className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600">Signup</a>
            </div>
          </div>
        } />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

import { useState } from "react";
import { signInWithEmailAndPassword, sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../firebase";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [showReset, setShowReset] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const userCred = await signInWithEmailAndPassword(auth, email, password);

      if (!userCred.user.emailVerified) {
        setMessage("Please verify your email before logging in.");
        return;
      }

      const token = await userCred.user.getIdToken();
      localStorage.setItem("token", token);

      const res = await fetch("http://localhost:5000/api/auth/verify", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({}),
      });

      if (!res.ok) {
        setMessage("Backend verification failed.");
        return;
      }

      const data = await res.json();
      console.log("User verified with backend:", data);
      setMessage("Login successful ✅");
    } catch (err) {
      setMessage(err.message);
    }
  };

  const handleReset = async () => {
    try {
      await sendPasswordResetEmail(auth, email);
      setMessage("Reset email sent to your inbox ✅");
    } catch (err) {
      setMessage(err.message);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <form onSubmit={handleLogin} className="bg-white p-6 rounded shadow-md w-96">
        <h2 className="text-xl font-semibold mb-4">Login to E-GameBazzi</h2>
        <input
          className="w-full border p-2 mb-2"
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          className="w-full border p-2 mb-2"
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button
          className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
          type="submit"
        >
          Login
        </button>
        <p
          onClick={() => setShowReset(true)}
          className="text-sm mt-2 text-blue-600 cursor-pointer hover:underline text-center"
        >
          Forgot Password?
        </p>
        <p className="text-sm mt-3 text-center text-red-600">{message}</p>
      </form>

      {showReset && (
        <div className="bg-white p-6 rounded shadow-md w-96 mt-4">
          <h2 className="text-xl font-semibold mb-4">Reset Password</h2>
          <input
            className="w-full border p-2 mb-2"
            type="email"
            placeholder="Enter your Gmail"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <button
            className="w-full bg-orange-600 text-white p-2 rounded hover:bg-orange-700"
            onClick={handleReset}
          >
            Send Reset Email
          </button>
        </div>
      )}
    </div>
  );
};

export default Login;

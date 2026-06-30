  import { useState } from "react";
  import { loginUser } from "../api/auth";
  import { useNavigate } from 'react-router';

  export default function Login({setToken}) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
      e.preventDefault();
      try {
        const data = await loginUser({ email, password });
        localStorage.setItem("token", data.success.token); // store JWT
        setToken(data.success.token);
        setMessage("Login successful!");
        navigate("/");
      } catch (error) {
        setMessage(error.message || "Login failed");
      }
    };

    return (
      <div className="auth-page">
      <div className="w-full max-w-md bg-gray-800 rounded-lg shadow-lg p-6">
        <h1 className="text-3xl font-bold text-center text-white mb-6">Login</h1>
        <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={evemt => setEmail(evemt.target.value)}
            required
            className="w-full p-3 rounded border border-gray-600 bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={event => setPassword(event.target.value)}
            required
            className="w-full p-3 rounded border border-gray-600 bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <button
            type="submit"
            className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-3 rounded transition"
          >
            Login
          </button>
        </form>
        {message && (
          <p className="mt-4 text-center text-sm text-yellow-400">{message}</p>
        )}
      </div>
    </div>
    );
  }

import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FiMail, FiLock } from "react-icons/fi";

import { useAuth } from "../../contexts/AuthContext";
import { ConvoxaMark } from "../layouts/Logo";

export default function Register() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const { currentUser, register, setError, error } = useAuth();

  useEffect(() => {
    if (currentUser) {
      navigate("/");
    }
  }, [currentUser, navigate]);

  async function handleFormSubmit(e) {
    e.preventDefault();

    if (password !== confirmPassword) {
      return setError("Passwords do not match");
    }

    try {
      setError("");
      setLoading(true);
      await register(email, password);
      navigate("/profile");
    } catch (e) {
      setError("Failed to register");
    }

    setLoading(false);
  }

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-slate-50 px-4 py-10">
      <div className="w-full max-w-[380px] bg-white rounded-2xl shadow-xl shadow-rose-100/60 ring-1 ring-rose-100 p-7 sm:p-9">
        <div className="mb-5 flex justify-center">
          <ConvoxaMark size={44} />
        </div>

        <h2 className="text-2xl font-bold tracking-tight text-slate-900 mb-1 text-center">
          Create your account
        </h2>
        <p className="text-sm text-slate-500 mb-6 text-center">
          Join Convoxa and start chatting in seconds.
        </p>

        {error && (
          <p className="mb-4 text-xs font-medium text-red-600 bg-red-50 border border-red-100 rounded-lg px-3 py-2">
            {error}
          </p>
        )}

        <form className="space-y-3.5" onSubmit={handleFormSubmit}>
          <div className="relative">
            <FiMail
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
              size={17}
            />
            <input
              id="email-address"
              name="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              className="w-full pl-11 pr-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-rose-400 focus:border-rose-400 focus:bg-white transition"
              placeholder="Email address"
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="relative">
            <FiLock
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
              size={17}
            />
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="new-password"
              required
              value={password}
              className="w-full pl-11 pr-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-rose-400 focus:border-rose-400 focus:bg-white transition"
              placeholder="Password"
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <div className="relative">
            <FiLock
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
              size={17}
            />
            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              autoComplete="new-password"
              required
              value={confirmPassword}
              className="w-full pl-11 pr-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-rose-400 focus:border-rose-400 focus:bg-white transition"
              placeholder="Confirm password"
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl text-sm font-semibold tracking-wide text-white bg-rose-600 hover:bg-rose-500 shadow-md shadow-rose-200 active:scale-[0.98] disabled:opacity-50 disabled:hover:bg-rose-600 transition mt-1"
          >
            {loading ? "Creating account..." : "Create account"}
          </button>

          <div className="relative flex items-center py-1">
            <div className="flex-1 border-t border-slate-200"></div>
            <span className="px-3 text-sm text-slate-400 whitespace-nowrap">
              Already have an account?
            </span>
            <div className="flex-1 border-t border-slate-200"></div>
          </div>

          <Link
            to="/login"
            className="block w-full text-center py-3 rounded-xl text-sm font-semibold text-rose-600 bg-rose-50 border border-rose-200 hover:bg-rose-100 active:scale-[0.98] transition"
          >
            Sign in instead
          </Link>
        </form>
      </div>
    </div>
  );
}

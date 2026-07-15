import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FiMail, FiLock, FiCheck } from "react-icons/fi";

import { useAuth } from "../../contexts/AuthContext";
import { ConvoxaMark } from "../layouts/Logo";

function ChatConnectIllustration() {
  return (
    <svg
      viewBox="0 0 300 190"
      className="w-full max-w-xs"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* left person */}
      <path
        d="M26 172c0-30 20-50 46-50s46 20 46 50z"
        fill="white"
        fillOpacity="0.9"
      />
      <circle cx="72" cy="78" r="26" fill="white" fillOpacity="0.9" />

      {/* right person */}
      <path
        d="M182 172c0-30 20-50 46-50s46 20 46 50z"
        fill="white"
        fillOpacity="0.55"
      />
      <circle cx="228" cy="78" r="26" fill="white" fillOpacity="0.55" />

      {/* dashed connection */}
      <path
        d="M100 96 Q150 60 200 96"
        fill="none"
        stroke="white"
        strokeOpacity="0.5"
        strokeWidth="2"
        strokeDasharray="5 6"
        strokeLinecap="round"
      />

      {/* speech bubble from left person */}
      <g transform="translate(78,14)">
        <rect width="76" height="44" rx="14" fill="white" />
        <path d="M14 44 L8 56 L28 44 Z" fill="white" />
        <circle cx="22" cy="22" r="4" fill="#C93E79" />
        <circle cx="38" cy="22" r="4" fill="#C93E79" />
        <circle cx="54" cy="22" r="4" fill="#C93E79" />
      </g>

      {/* speech bubble reply from right person */}
      <g transform="translate(148,86)">
        <rect width="66" height="38" rx="12" fill="#F3C0D9" />
        <path d="M48 38 L54 49 L36 38 Z" fill="#F3C0D9" />
        <path
          d="M14 20 L24 28 L40 12"
          fill="none"
          stroke="#7A2249"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>
    </svg>
  );
}

export default function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [resetMessage, setResetMessage] = useState("");

  const { currentUser, login, error, setError, resetPassword } = useAuth();

  useEffect(() => {
    if (currentUser) {
      navigate("/");
    }
  }, [currentUser, navigate]);

  useEffect(() => {
    const savedEmail = localStorage.getItem("convoxa_remember_email");
    if (savedEmail) {
      setEmail(savedEmail);
      setRememberMe(true);
    }
  }, []);

  async function handleFormSubmit(e) {
    e.preventDefault();

    try {
      setError("");
      setResetMessage("");
      setLoading(true);
      await login(email, password);

      if (rememberMe) {
        localStorage.setItem("convoxa_remember_email", email);
      } else {
        localStorage.removeItem("convoxa_remember_email");
      }

      navigate("/");
    } catch (e) {
      setError("Failed to login");
    }

    setLoading(false);
  }

  async function handleForgotPassword() {
    setResetMessage("");
    setError("");

    if (!email) {
      setError("Enter your email above first, then tap Forgot password.");
      return;
    }

    try {
      await resetPassword(email);
      setResetMessage("Password reset email sent — check your inbox.");
    } catch (e) {
      setError("Couldn't send reset email. Check the address and try again.");
    }
  }

  return (
    <div className="min-h-screen w-full grid md:grid-cols-2 bg-slate-50">
      {/* Left panel */}
      <div
        className="relative hidden md:flex flex-col justify-between overflow-hidden bg-gradient-to-br from-rose-300 via-rose-500 to-rose-700 p-12 lg:p-16"
        style={{ clipPath: "url(#loginCurve)" }}
      >
        <div className="absolute -top-16 -left-16 w-56 h-56 rounded-full bg-white/15 blur-3xl"></div>
        <div className="absolute -bottom-20 right-0 w-64 h-64 rounded-full bg-rose-900/20 blur-3xl"></div>

        <div className="relative flex items-center gap-3">
          <ConvoxaMark size={48} />
          <span className="text-3xl font-bold tracking-[-0.01em] bg-gradient-to-r from-white to-rose-100 bg-clip-text text-transparent">
            Convoxa
          </span>
        </div>

        <div className="relative flex justify-center">
          <ChatConnectIllustration />
        </div>

        <div className="relative">
          <h1 className="text-3xl font-medium text-white leading-tight mb-3">
            Stay connected,
            <br />
            effortlessly.
          </h1>
          <p className="text-sm text-rose-50/80 max-w-sm">
            Real-time messaging with the people who matter, wherever you are.
          </p>
        </div>
      </div>

      {/* Right panel */}
      <div className="flex items-center justify-center p-6 sm:p-10 lg:p-16 bg-slate-50">
        <div className="w-full max-w-[380px] bg-white rounded-2xl shadow-xl shadow-rose-100/60 ring-1 ring-rose-100 p-7 sm:p-9">
          <div className="mb-5 md:hidden flex justify-center">
            <ConvoxaMark size={44} />
          </div>

          <h2 className="text-2xl font-bold tracking-tight text-slate-900 mb-1">
            Welcome back
          </h2>
          <p className="text-sm text-slate-500 mb-6">
            Sign in to keep the conversation going.
          </p>

          {error && (
            <p className="mb-4 text-xs font-medium text-red-600 bg-red-50 border border-red-100 rounded-lg px-3 py-2">
              {error}
            </p>
          )}
          {resetMessage && (
            <p className="mb-4 text-xs font-medium text-emerald-700 bg-emerald-50 border border-emerald-100 rounded-lg px-3 py-2">
              {resetMessage}
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
                placeholder="Username"
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
                autoComplete="current-password"
                required
                value={password}
                className="w-full pl-11 pr-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-rose-400 focus:border-rose-400 focus:bg-white transition"
                placeholder="Password"
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <div className="flex items-center justify-between text-xs pt-0.5">
              <label className="flex items-center gap-2 cursor-pointer select-none text-slate-600 font-medium">
                <span
                  onClick={() => setRememberMe((v) => !v)}
                  className={`w-5 h-5 rounded flex items-center justify-center border transition ${
                    rememberMe
                      ? "bg-rose-500 border-rose-500"
                      : "bg-white border-slate-300"
                  }`}
                >
                  {rememberMe && <FiCheck size={14} className="text-white" />}
                </span>
                Remember me
              </label>
              <button
                type="button"
                onClick={handleForgotPassword}
                className="text-rose-600 hover:text-rose-700 font-medium underline underline-offset-2"
              >
                Forgot password?
              </button>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl text-sm font-semibold tracking-wide text-white bg-rose-600 hover:bg-rose-500 shadow-md shadow-rose-200 active:scale-[0.98] disabled:opacity-50 disabled:hover:bg-rose-600 transition"
            >
              {loading ? "Signing in..." : "Sign in"}
            </button>

            <div className="relative flex items-center py-2">
              <div className="flex-1 border-t border-slate-200"></div>
              <span className="px-3 text-sm text-slate-400 whitespace-nowrap">
                Don't have an account?
              </span>
              <div className="flex-1 border-t border-slate-200"></div>
            </div>

            <Link
              to="/register"
              className="block w-full text-center py-3 rounded-xl text-sm font-semibold text-rose-600 bg-rose-50 border border-rose-200 hover:bg-rose-100 active:scale-[0.98] transition"
            >
              Create account
            </Link>
          </form>
        </div>
      </div>

      <svg width="0" height="0" className="absolute">
        <defs>
          <clipPath id="loginCurve" clipPathUnits="objectBoundingBox">
            <path d="M0,0 L0.9,0 C0.76,0.22 0.76,0.78 0.9,1 L0,1 Z" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

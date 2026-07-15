import { LogoutIcon } from "@heroicons/react/outline";
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";

import { useAuth } from "../../contexts/AuthContext";
import Logout from "../accounts/Logout";
import ThemeToggler from "./ThemeToggler";
import Logo from "./Logo";

export default function Header() {
  const [modal, setModal] = useState(false);
  const location = useLocation();

  const { currentUser } = useAuth();

  // The login screen renders full-screen, without the app chrome above it.
  if (location.pathname === "/login") return null;

  return (
    <>
      <nav className="px-6 py-3.5 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 shadow-sm relative z-10">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5">
            <Logo
              size={36}
              textClassName="text-lg text-slate-800 dark:text-slate-100"
            />
          </Link>
          <div className="flex items-center gap-1">
            <ThemeToggler />

            {currentUser && (
              <>
                <button
                  className="p-2.5 rounded-full text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                  onClick={() => setModal(true)}
                  aria-label="Log out"
                >
                  <LogoutIcon className="h-6 w-6" aria-hidden="true" />
                </button>

                <Link
                  to="/profile"
                  className="ml-1 rounded-full ring-2 ring-transparent hover:ring-rose-500 transition"
                >
                  <img
                    className="h-9 w-9 rounded-full object-cover bg-slate-200 dark:bg-slate-700"
                    src={currentUser.photoURL}
                    alt=""
                  />
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>
      {modal && <Logout modal={modal} setModal={setModal} />}
    </>
  );
}

import { Fragment, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Dialog, Transition } from "@headlessui/react";
import { FiLogOut } from "react-icons/fi";

import { useAuth } from "../../contexts/AuthContext";

export default function Logout({ modal, setModal }) {
  const cancelButtonRef = useRef(null);
  const navigate = useNavigate();

  const { logout, setError } = useAuth();

  async function handleLogout() {
    try {
      setError("");
      await logout();
      setModal(false);
      navigate("/login");
    } catch {
      setError("Failed to logout");
    }
  }

  return (
    <Transition.Root show={modal} as={Fragment}>
      <Dialog
        as="div"
        className="fixed z-50 inset-0 overflow-y-auto"
        initialFocus={cancelButtonRef}
        onClose={setModal}
      >
        <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:items-center sm:p-0">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Dialog.Overlay className="fixed inset-0 bg-slate-900/40 transition-opacity" />
          </Transition.Child>

          <span
            className="hidden sm:inline-block sm:align-middle sm:h-screen"
            aria-hidden="true"
          >
            &#8203;
          </span>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            enterTo="opacity-100 translate-y-0 sm:scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 translate-y-0 sm:scale-100"
            leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
          >
            <div className="inline-block align-bottom bg-white dark:bg-slate-800 rounded-2xl text-left overflow-hidden shadow-2xl transform transition-all sm:my-8 sm:align-middle sm:max-w-sm sm:w-full">
              <div className="px-5 pt-6 pb-4">
                <div className="flex flex-col items-center text-center gap-3 sm:flex-row sm:text-left">
                  <div className="shrink-0 flex items-center justify-center h-11 w-11 rounded-full bg-rose-100 dark:bg-rose-900/40">
                    <FiLogOut
                      className="h-5 w-5 text-rose-600 dark:text-rose-400"
                      aria-hidden="true"
                    />
                  </div>
                  <div>
                    <Dialog.Title
                      as="h3"
                      className="text-base font-semibold text-slate-800 dark:text-slate-100"
                    >
                      Logging out
                    </Dialog.Title>
                    <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                      Are you sure you want to log out?
                    </p>
                  </div>
                </div>
              </div>
              <div className="bg-slate-50 dark:bg-slate-900/40 px-5 py-3.5 flex flex-col-reverse sm:flex-row sm:justify-end gap-2">
                <button
                  type="button"
                  className="w-full sm:w-auto inline-flex justify-center rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm px-4 py-2 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-sm font-medium hover:bg-slate-100 dark:hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-rose-300 transition"
                  onClick={() => setModal(false)}
                  ref={cancelButtonRef}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="w-full sm:w-auto inline-flex justify-center rounded-xl border border-transparent shadow-md shadow-rose-200 dark:shadow-none px-4 py-2 bg-rose-600 hover:bg-rose-500 text-sm font-semibold text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-rose-400 transition"
                  onClick={handleLogout}
                >
                  Log out
                </button>
              </div>
            </div>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition.Root>
  );
}

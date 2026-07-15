import { XCircleIcon } from "@heroicons/react/solid";

import { useAuth } from "../../contexts/AuthContext";

export default function ErrorMessage() {
  const { error, setError } = useAuth();

  return (
    error && (
      <div className="flex justify-center px-4">
        <div className="rounded-xl max-w-md w-full bg-red-50 border border-red-100 shadow-sm p-4 mt-4">
          <div className="flex items-start gap-3">
            <XCircleIcon
              onClick={() => setError("")}
              className="h-5 w-5 text-red-400 shrink-0 cursor-pointer"
              aria-hidden="true"
            />
            <h3 className="text-sm font-medium text-red-800">
              {error}
            </h3>
          </div>
        </div>
      </div>
    )
  );
}

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { useAuth } from "../../contexts/AuthContext";
import { generateAvatar } from "../../utils/GenerateAvatar";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function Profile() {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [avatars, setAvatars] = useState([]);
  const [selectedAvatar, setSelectedAvatar] = useState();
  const [loading, setLoading] = useState(false);

  const { currentUser, updateUserProfile, setError, error } = useAuth();

  useEffect(() => {
    const fetchData = () => {
      const res = generateAvatar();
      setAvatars(res);
    };

    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    setUsername(currentUser.displayName || "");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    if (selectedAvatar === undefined) {
      return setError("Please select an avatar");
    }

    if (!username.trim()) {
      return setError("Please enter a display name");
    }

    try {
      setError("");
      setLoading(true);
      const user = currentUser;
      const profile = {
        displayName: username.trim(),
        photoURL: avatars[selectedAvatar],
      };
      await updateUserProfile(user, profile);
      navigate("/");
    } catch (e) {
      setError("Failed to update profile");
    }

    setLoading(false);
  };

  return (
    <div className="min-h-[calc(100vh-64px)] w-full flex items-center justify-center bg-slate-50 px-4 py-10">
      <div className="w-full max-w-lg bg-white rounded-2xl shadow-xl shadow-rose-100/60 ring-1 ring-rose-100 p-7 sm:p-9">
        <h2 className="text-2xl font-bold tracking-tight text-slate-900 mb-1 text-center">
          Pick an avatar
        </h2>
        <p className="text-sm text-slate-500 mb-6 text-center">
          Choose a look and a display name for your profile.
        </p>

        {error && (
          <p className="mb-4 text-xs font-medium text-red-600 bg-red-50 border border-red-100 rounded-lg px-3 py-2">
            {error}
          </p>
        )}

        <form className="space-y-5" onSubmit={handleFormSubmit}>
          <div className="grid grid-cols-4 sm:grid-cols-6 gap-2.5">
            {avatars.map((avatar, index) => (
              <button
                type="button"
                key={index}
                onClick={() => setSelectedAvatar(index)}
                className={classNames(
                  "rounded-full p-0.5 transition active:scale-95",
                  index === selectedAvatar
                    ? "ring-2 ring-rose-500 ring-offset-2"
                    : "ring-1 ring-transparent hover:ring-rose-200"
                )}
              >
                <img
                  alt="Avatar option"
                  className="block object-cover object-center w-full aspect-square rounded-full bg-rose-50"
                  src={avatar}
                />
              </button>
            ))}
          </div>

          <div className="relative">
            <input
              id="username"
              name="username"
              type="text"
              autoComplete="username"
              required
              className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-rose-400 focus:border-rose-400 focus:bg-white transition"
              placeholder="Enter a display name"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl text-sm font-semibold tracking-wide text-white bg-rose-600 hover:bg-rose-500 shadow-md shadow-rose-200 active:scale-[0.98] disabled:opacity-50 disabled:hover:bg-rose-600 transition"
          >
            {loading ? "Saving..." : "Update profile"}
          </button>
        </form>
      </div>
    </div>
  );
}

const AVATAR_SIZES = {
  sm: "w-9 h-9",
  md: "w-11 h-11",
  lg: "w-20 h-20",
};

const DOT_SIZES = {
  sm: "w-2.5 h-2.5",
  md: "w-3 h-3",
  lg: "w-4 h-4",
};

export default function UserLayout({
  user,
  onlineUsersId,
  size = "md",
  showStatus = false,
  align = "left",
  subtitle,
  meta,
  fileIndicator,
  unread = false,
}) {
  const isOnline = onlineUsersId?.includes(user?.uid);

  return (
    <div
      className={`flex items-center gap-3 min-w-0 ${
        align === "center" ? "flex-col text-center" : ""
      }`}
    >
      <div className="relative shrink-0">
        <img
          className={`${AVATAR_SIZES[size]} rounded-full object-cover bg-slate-200 dark:bg-slate-700 ring-2 ring-white dark:ring-slate-900`}
          src={user?.photoURL}
          alt=""
        />
        <span
          className={`${DOT_SIZES[size]} absolute bottom-0 right-0 rounded-full border-2 border-white dark:border-slate-900 ${
            isOnline ? "bg-emerald-500" : "bg-slate-400 dark:bg-slate-600"
          }`}
        ></span>
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between gap-2">
          <p
            className={`truncate tracking-[-0.01em] leading-tight ${
              unread
                ? "font-bold text-slate-900 dark:text-white"
                : "font-semibold text-[15px] text-slate-800 dark:text-slate-100"
            }`}
          >
            {user?.displayName}
          </p>
          <div className="shrink-0 flex items-center gap-1.5">
            {meta && (
              <span
                className={`text-[11px] ${
                  unread
                    ? "text-rose-600 dark:text-rose-400 font-semibold"
                    : "text-slate-400 dark:text-slate-500"
                }`}
              >
                {meta}
              </span>
            )}
            {unread && (
              <span className="w-2 h-2 rounded-full bg-rose-500 shrink-0"></span>
            )}
          </div>
        </div>
        {subtitle ? (
          <p
            className={`truncate text-[13px] mt-0.5 flex items-center gap-1 ${
              unread
                ? "text-slate-700 dark:text-slate-200 font-medium"
                : "text-slate-500 dark:text-slate-400"
            }`}
          >
            {fileIndicator}
            <span className="truncate">{subtitle}</span>
          </p>
        ) : (
          showStatus && (
            <p
              className={`text-xs mt-0.5 ${
                isOnline
                  ? "text-emerald-600 dark:text-emerald-400"
                  : "text-slate-500 dark:text-slate-400"
              }`}
            >
              {isOnline ? "Online" : "Offline"}
            </p>
          )
        )}
      </div>
    </div>
  );
}

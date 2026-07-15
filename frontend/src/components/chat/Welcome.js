import { WelcomeSVG } from "../../utils/WelcomeSVG";

export default function Welcome() {
  return (
    <div className="flex-1 min-w-0 flex flex-col items-center justify-center gap-4 bg-slate-50 dark:bg-black chat-wallpaper px-6">
      <div className="w-72 max-w-full opacity-90">
        <WelcomeSVG />
      </div>
      <div className="text-center">
        <h2 className="text-lg font-medium text-slate-600 dark:text-slate-300">
          Select a chat to start messaging
        </h2>
        <p className="text-sm text-slate-400 dark:text-slate-500 mt-1">
          Pick a conversation from the left, or start a new one.
        </p>
      </div>
    </div>
  );
}

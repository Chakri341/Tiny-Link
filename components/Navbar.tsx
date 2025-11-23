import Link from "next/link";
import ThemeToggle from "./ThemeToggle";

const Navbar = () => {
  return (
    <nav className="w-full border-b bg-white/80 dark:bg-slate-900/80 backdrop-blur-lg supports-[backdrop-filter]:bg-white/60 dark:supports-[backdrop-filter]:bg-slate-900/60 shadow-sm">
      <div className="max-w-6xl mx-auto px-4 py-1 flex items-center justify-between">
        <Link
          href="/"
          className="font-semibold text-[20px] text-gray-900 dark:text-gray-100 tracking-tight hover:opacity-80 transition"
        >
           TinyLink 🔗
        </Link>

        <div className="flex items-center gap-3">
          <ThemeToggle />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

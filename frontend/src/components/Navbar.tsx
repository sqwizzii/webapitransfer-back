import { NavLink, useNavigate } from "react-router-dom";
import { isAuthenticated, logout } from "../shared/auth";
import ThemeToggle from "./ThemeToggle";

export default function Navbar() {
    const nav = useNavigate();
    const auth = isAuthenticated();

    function onLogout() {
        logout();
        nav("/login");
    }

    return (
        <header className="border-b mb-6">
            <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
                {/* LEFT */}
                <nav className="flex gap-4">
                    <NavLink
                        to="/"
                        className={({ isActive }) =>
                            isActive
                                ? "font-semibold text-blue-600"
                                : "text-neutral-600 hover:text-black"
                        }
                    >
                        Home
                    </NavLink>

                    {auth && (
                        <NavLink
                            to="/admin"
                            className={({ isActive }) =>
                                isActive
                                    ? "font-semibold text-blue-600"
                                    : "text-neutral-600 hover:text-black"
                            }
                        >
                            Admin
                        </NavLink>
                    )}
                </nav>

                {/* RIGHT */}
                <div className="flex items-center gap-3">
                    <ThemeToggle />

                    {!auth ? (
                        <NavLink
                            to="/login"
                            className="border rounded-lg px-3 py-1 hover:bg-neutral-100"
                        >
                            Login
                        </NavLink>
                    ) : (
                        <button
                            onClick={onLogout}
                            className="border rounded-lg px-3 py-1 hover:bg-neutral-100"
                        >
                            Logout
                        </button>
                    )}
                </div>
            </div>
        </header>
    );
}

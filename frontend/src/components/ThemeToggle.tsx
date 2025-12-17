import { useEffect, useState } from "react";
import { initTheme, setTheme } from "../shared/theme";

export default function ThemeToggle() {
    const [theme, setT] = useState<"light" | "dark">("light");

    useEffect(() => {
        setT(initTheme() as "light" | "dark");
    }, []);

    return (
        <button
            className="px-3 py-2 rounded-lg border dark:border-neutral-700 dark:bg-neutral-900"
            onClick={() => {
                const next = theme === "light" ? "dark" : "light";
                setT(next);
                setTheme(next);
            }}
        >
            {theme === "light" ? "🌙 Dark" : "☀️ Light"}
        </button>
    );
}

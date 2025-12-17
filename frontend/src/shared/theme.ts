const KEY = "theme";

export function initTheme() {
    const saved = localStorage.getItem(KEY);
    const theme = saved === "dark" ? "dark" : "light";
    document.documentElement.classList.toggle("dark", theme === "dark");
    return theme;
}

export function setTheme(theme: "light" | "dark") {
    localStorage.setItem(KEY, theme);
    document.documentElement.classList.toggle("dark", theme === "dark");
}

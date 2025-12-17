import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../shared/api";
import { setToken } from "../shared/auth";

export default function Login() {
    const nav = useNavigate();
    const [email, setEmail] = useState("admin@gmail.com");
    const [password, setPassword] = useState("Admin123");
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    async function onSubmit(e: React.FormEvent) {
        e.preventDefault();
        setError(null);
        setLoading(true);

        try {
            const res = await api.post("/api/Account/Login", { email, password });

            const token = res.data?.token ?? res.data;
            setToken(token);

            nav("/admin");
        } catch (err: any) {
            setError(err?.response?.data?.message ?? "Login error");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="max-w-md mx-auto space-y-4">
            <h1 className="text-2xl font-semibold">Login</h1>

            {error && (
                <div className="rounded-lg border p-3 text-red-600">
                    {String(error)}
                </div>
            )}

            <form onSubmit={onSubmit} className="space-y-3">
                <input
                    className="w-full border rounded-lg p-2"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Email"
                />

                <input
                    className="w-full border rounded-lg p-2"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Password"
                    type="password"
                />

                <button
                    className="w-full rounded-lg border p-2 font-medium"
                    disabled={loading}
                >
                    {loading ? "Loading..." : "Login"}
                </button>
            </form>
        </div>
    );
}

import { useState } from "react";
import { api } from "../shared/api";
import { Link } from "react-router-dom";

export default function ResetPassword() {
    const [email, setEmail] = useState("");
    const [token, setToken] = useState("");
    const [newPassword, setNewPassword] = useState("");

    const [message, setMessage] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    async function onSubmit(e: React.FormEvent) {
        e.preventDefault();
        setMessage(null);
        setError(null);
        setLoading(true);

        try {
            const res = await api.post("/api/Account/ResetPassword", {
                email,
                token,
                newPassword,
            });

            setMessage(res.data?.message ?? "Password changed!");
        } catch (err: any) {
            setError(err?.response?.data?.message ?? "Reset password error");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="max-w-md mx-auto space-y-4">
            <h1 className="text-2xl font-semibold">Reset password</h1>

            {message && (
                <div className="rounded-lg border border-green-200 bg-green-50 p-3 text-green-700">
                    {message}
                </div>
            )}

            {error && (
                <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-red-700">
                    {error}
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
                    value={token}
                    onChange={(e) => setToken(e.target.value)}
                    placeholder="Token (demo)"
                />

                <input
                    className="w-full border rounded-lg p-2"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="New password"
                    type="password"
                />

                <button
                    className="w-full rounded-lg border p-2 font-medium"
                    disabled={loading}
                >
                    {loading ? "Loading..." : "Change password"}
                </button>
            </form>

            <div className="text-sm text-neutral-600">
                Go back to <Link className="underline" to="/login">Login</Link>
            </div>
        </div>
    );
}

import { useState } from "react";
import { Link } from "react-router-dom";
import { forgotPassword } from "../shared/account";

export default function ForgotPassword() {
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);

    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    async function onSubmit(e: React.FormEvent) {
        e.preventDefault();
        setError(null);
        setSuccess(null);

        const trimmed = email.trim();

        if (!trimmed) {
            setError("Вкажи email");
            return;
        }
        if (!trimmed.includes("@")) {
            setError("Некоректний email");
            return;
        }

        setLoading(true);
        try {
            await forgotPassword(trimmed);
            setSuccess("Якщо такий email існує — ми відправили лист для відновлення пароля.");
            setEmail("");
        } catch (e: any) {
            // якщо бек повертає помилку
            const msg =
                e?.response?.data?.message ??
                e?.response?.data ??
                e?.message ??
                "Помилка відправки. Спробуй ще раз.";
            setError(String(msg));
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="mx-auto max-w-md space-y-4">
            <div className="space-y-1">
                <h1 className="text-2xl font-semibold">Відновлення пароля</h1>
                <p className="text-sm text-neutral-500">
                    Введи email — ми надішлемо інструкцію для відновлення.
                </p>
            </div>

            {error && (
                <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                    {error}
                </div>
            )}

            {success && (
                <div className="rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-800">
                    {success}
                </div>
            )}

            <form onSubmit={onSubmit} className="space-y-3 rounded-2xl border p-4">
                <div className="space-y-1">
                    <label className="text-sm text-neutral-600">Email</label>
                    <input
                        type="email"
                        className="w-full rounded-xl border px-3 py-2"
                        placeholder="name@gmail.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        autoComplete="email"
                    />
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full rounded-xl bg-black px-4 py-2 text-white disabled:opacity-60"
                >
                    {loading ? "Відправляю..." : "Відправити"}
                </button>
            </form>

            <div className="text-sm">
                <Link to="/login" className="text-blue-600 hover:underline">
                    ← Назад до входу
                </Link>
            </div>
        </div>
    );
}

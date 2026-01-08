import { useEffect, useMemo, useState } from "react";
import { searchUsers } from "../../shared/users";
import type { UserItem } from "../../types/user";

export default function AdminUsers() {
    const [query, setQuery] = useState("");
    const [page, setPage] = useState(1);
    const pageSize = 10;

    const [items, setItems] = useState<UserItem[]>([]);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const totalPages = useMemo(() => Math.max(1, Math.ceil(total / pageSize)), [total]);

    async function load() {
        setLoading(true);
        setError(null);
        try {
            const data = await searchUsers({ query, page, pageSize });
            setItems(data.items ?? []);
            setTotal(data.totalCount ?? 0);
        } catch (e: any) {
            setError(e?.response?.data?.message ?? e?.message ?? "Failed to search users");
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        load();
    }, [page]);

    useEffect(() => {
        const t = setTimeout(() => {
            setPage(1);
            load().then(r => );
        }, 350);
        return () => clearTimeout(t);
    }, [query]);

    return (
        <div className="space-y-4">
            <div>
                <h1 className="text-2xl font-semibold">Users</h1>
                <p className="text-sm text-neutral-500">Search users by email / username / phone</p>
            </div>

            <div className="rounded-2xl border p-4 space-y-3">
                <input
                    className="w-full rounded-xl border px-3 py-2"
                    placeholder="Type to search… (ex: admin)"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                />

                {error && (
                    <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                        {error}
                    </div>
                )}

                <div className="flex items-center justify-between text-sm text-neutral-500">
                    <div>
                        Total: <span className="text-neutral-900">{total}</span>
                    </div>
                    <button
                        type="button"
                        onClick={load}
                        className="rounded-lg border px-3 py-1.5 hover:bg-neutral-50"
                    >
                        Refresh
                    </button>
                </div>

                {loading ? (
                    <div className="text-sm text-neutral-500">Loading…</div>
                ) : items.length === 0 ? (
                    <div className="text-sm text-neutral-500">No users found</div>
                ) : (
                    <div className="overflow-hidden rounded-2xl border">
                        <table className="w-full text-sm">
                            <thead className="bg-neutral-50">
                            <tr>
                                <th className="p-3 text-left">Email</th>
                                <th className="p-3 text-left">UserName</th>
                                <th className="p-3 text-left">Phone</th>
                                <th className="p-3 text-left">Roles</th>
                            </tr>
                            </thead>
                            <tbody>
                            {items.map((u) => (
                                <tr key={u.id} className="border-t">
                                    <td className="p-3">{u.email}</td>
                                    <td className="p-3">{u.userName ?? "-"}</td>
                                    <td className="p-3">{u.phoneNumber ?? "-"}</td>
                                    <td className="p-3">{(u.roles ?? []).join(", ") || "-"}</td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                )}

                <div className="flex items-center justify-between">
                    <button
                        type="button"
                        disabled={page <= 1}
                        onClick={() => setPage((p) => Math.max(1, p - 1))}
                        className="rounded-lg border px-3 py-1.5 text-sm disabled:opacity-50"
                    >
                        Prev
                    </button>

                    <div className="text-sm text-neutral-600">
                        Page <span className="text-neutral-900">{page}</span> /{" "}
                        <span className="text-neutral-900">{totalPages}</span>
                    </div>

                    <button
                        type="button"
                        disabled={page >= totalPages}
                        onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                        className="rounded-lg border px-3 py-1.5 text-sm disabled:opacity-50"
                    >
                        Next
                    </button>
                </div>
            </div>
        </div>
    );
}

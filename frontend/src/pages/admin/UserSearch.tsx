import { useState } from "react";
import { searchUsers, UserItem } from "../../shared/users";

export default function UserSearch() {
    const [query, setQuery] = useState("");
    const [items, setItems] = useState<UserItem[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    async function onSearch(e: React.FormEvent) {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const res = await searchUsers(query);
            setItems(res.items);
        } catch (e: any) {
            setError(e?.response?.data ?? "Search error");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="space-y-4">
            <h1 className="text-2xl font-semibold">User search</h1>

            <form onSubmit={onSearch} className="flex gap-2">
                <input
                    className="flex-1 border rounded-lg p-2"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Email / Username / Phone"
                />
                <button className="border rounded-lg px-4">
                    Search
                </button>
            </form>

            {loading && <div>Loading...</div>}
            {error && <div className="text-red-600">{error}</div>}

            <div className="space-y-2">
                {items.map((u) => (
                    <div
                        key={u.id}
                        className="border rounded-lg p-3"
                    >
                        <div><b>Email:</b> {u.email}</div>
                        <div><b>UserName:</b> {u.userName || "-"}</div>
                        <div><b>Phone:</b> {u.phoneNumber || "-"}</div>
                        <div>
                            <b>Roles:</b>{" "}
                            {u.roles.join(", ")}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

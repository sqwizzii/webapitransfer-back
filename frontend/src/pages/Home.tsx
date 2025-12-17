import { useEffect, useState } from "react";
import { api } from "../shared/api";
import type { Country } from "../types/country";

export default function Home() {
    const [countries, setCountries] = useState<Country[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        api.get<Country[]>("/api/Countries")
            .then((res) => setCountries(res.data))
            .finally(() => setLoading(false));
    }, []);

    if (loading) return <div>Loading...</div>;

    return (
        <div className="space-y-4">
            <h1 className="text-2xl font-semibold">Countries</h1>

            {countries.length === 0 && (
                <div className="text-neutral-500">Даних поки немає</div>
            )}

            <div className="grid grid-cols-3 gap-4">
                {countries.map((c) => (
                    <div key={c.id} className="border p-4 rounded-xl">
                        <img
                            src={`${import.meta.env.VITE_API_URL}/images/${c.image}`}
                            className="h-24 object-cover mb-2"
                        />
                        <div className="font-medium">{c.name}</div>
                        <div className="text-sm text-neutral-500">
                            Code: {c.code}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

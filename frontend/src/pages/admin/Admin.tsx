import { useEffect, useMemo, useState } from "react";
import type { Country } from "../../types/country";
import { createCountry, deleteCountry, getCountries, updateCountry } from "../../shared/countries";

type FormState = {
    name: string;
    code: string;
    slug: string;
    image: File | null;
};

const emptyForm: FormState = { name: "", code: "", slug: "", image: null };

function slugify(input: string) {
    return input
        .trim()
        .toLowerCase()
        .replaceAll("’", "")
        .replaceAll("'", "")
        .replace(/[^a-z0-9\u0400-\u04FF]+/gi, "-")
        .replace(/-+/g, "-")
        .replace(/^-|-$/g, "");
}

function buildImageUrl(image: string) {
    if (!image) return "";

    if (image.startsWith("http")) return image;

    const base = import.meta.env.VITE_API_URL; // напр. http://localhost:5055
    const dir = "images";
    return `${base}/${dir}/${image}`;
}

export default function Admin() {
    const [items, setItems] = useState<Country[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [form, setForm] = useState<FormState>(emptyForm);
    const [saving, setSaving] = useState(false);

    const [editingId, setEditingId] = useState<number | null>(null);

    const title = useMemo(() => (editingId ? "Edit country" : "Create country"), [editingId]);

    async function load() {
        setError(null);
        setLoading(true);
        try {
            const data = await getCountries();
            setItems(data);
        } catch (e: any) {
            setError(e?.message ?? "Failed to load countries");
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        load();
    }, []);

    function setField<K extends keyof FormState>(key: K, value: FormState[K]) {
        setForm((prev) => ({ ...prev, [key]: value }));
    }

    function startEdit(c: Country) {
        setEditingId(c.id);
        setForm({
            name: c.name ?? "",
            code: c.code ?? "",
            slug: c.slug ?? "",
            image: null,
        });
    }

    function cancelEdit() {
        setEditingId(null);
        setForm(emptyForm);
    }

    async function onSubmit(e: React.FormEvent) {
        e.preventDefault();
        setError(null);

        if (!form.name.trim()) {
            setError("Name is required");
            return;
        }

        setSaving(true);
        try {
            const fd = new FormData();
            fd.append("Name", form.name);
            fd.append("Code", form.code);
            fd.append("Slug", form.slug || slugify(form.name));
            if (form.image) fd.append("Image", form.image);

            if (editingId) {
                fd.append("Id", String(editingId));
                await updateCountry(fd);
            } else {
                await createCountry(fd);
            }


            cancelEdit();
            await load();
        } catch (e: any) {
            setError(e?.response?.data?.message ?? e?.message ?? "Save failed");
        } finally {
            setSaving(false);
        }
    }

    async function onDelete(id: number) {
        const ok = confirm("Delete this country?");
        if (!ok) return;

        setError(null);
        try {
            await deleteCountry(id);
            setItems((prev) => prev.filter((x) => x.id !== id));
        } catch (e: any) {
            setError(e?.message ?? "Delete failed");
        }
    }

    return (
        <div className="space-y-6">
            <div className="flex items-end justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-semibold">Admin</h1>
                    <p className="text-sm text-neutral-500">Countries CRUD</p>
                </div>
            </div>

            {error && (
                <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                    {error}
                </div>
            )}

            <div className="grid gap-6 lg:grid-cols-2">
                {/* FORM */}
                <div className="rounded-2xl border p-4">
                    <div className="mb-3 flex items-center justify-between">
                        <h2 className="text-lg font-semibold">{title}</h2>

                        {editingId && (
                            <button
                                type="button"
                                onClick={cancelEdit}
                                className="rounded-lg border px-3 py-1.5 text-sm hover:bg-neutral-50"
                            >
                                Cancel
                            </button>
                        )}
                    </div>

                    <form onSubmit={onSubmit} className="space-y-3">
                        <div className="space-y-1">
                            <label className="text-sm text-neutral-600">Name</label>
                            <input
                                className="w-full rounded-xl border px-3 py-2"
                                value={form.name}
                                onChange={(e) => {
                                    const name = e.target.value;
                                    setField("name", name);
                                    if (!editingId) setField("slug", slugify(name));
                                }}
                                placeholder="Ukraine"
                            />
                        </div>

                        <div className="grid gap-3 sm:grid-cols-2">
                            <div className="space-y-1">
                                <label className="text-sm text-neutral-600">Code</label>
                                <input
                                    className="w-full rounded-xl border px-3 py-2"
                                    value={form.code}
                                    onChange={(e) => setField("code", e.target.value)}
                                    placeholder="UA"
                                />
                            </div>

                            <div className="space-y-1">
                                <label className="text-sm text-neutral-600">Slug</label>
                                <input
                                    className="w-full rounded-xl border px-3 py-2"
                                    value={form.slug}
                                    onChange={(e) => setField("slug", e.target.value)}
                                    placeholder="ukraine"
                                />
                            </div>
                        </div>

                        <div className="space-y-1">
                            <label className="text-sm text-neutral-600">Image</label>
                            <input
                                type="file"
                                accept="image/*"
                                className="w-full rounded-xl border px-3 py-2"
                                onChange={(e) => setField("image", e.target.files?.[0] ?? null)}
                            />
                           
                        </div>

                        <button
                            type="submit"
                            disabled={saving}
                            className="w-full rounded-xl bg-black px-4 py-2 text-white disabled:opacity-60"
                        >
                            {saving ? "Saving..." : editingId ? "Update" : "Create"}
                        </button>
                    </form>
                </div>

                {/* LIST */}
                <div className="rounded-2xl border p-4">
                    <div className="mb-3 flex items-center justify-between">
                        <h2 className="text-lg font-semibold">Countries</h2>
                        <button
                            type="button"
                            onClick={load}
                            className="rounded-lg border px-3 py-1.5 text-sm hover:bg-neutral-50"
                        >
                            Refresh
                        </button>
                    </div>

                    {loading ? (
                        <div className="text-sm text-neutral-500">Loading...</div>
                    ) : items.length === 0 ? (
                        <div className="text-sm text-neutral-500">No countries yet</div>
                    ) : (
                        <div className="space-y-3">
                            {items.map((c) => {
                                const img = buildImageUrl(c.image);
                                return (
                                    <div key={c.id} className="flex items-center justify-between gap-3 rounded-2xl border p-3">
                                        <div className="flex items-center gap-3">
                                            <div className="h-12 w-12 overflow-hidden rounded-xl border bg-neutral-50">
                                                {img ? (
                                                    <img src={img} alt={c.name} className="h-full w-full object-cover" />
                                                ) : (
                                                    <div className="flex h-full w-full items-center justify-center text-xs text-neutral-400">
                                                        no
                                                    </div>
                                                )}
                                            </div>

                                            <div>
                                                <div className="font-medium">{c.name}</div>
                                                <div className="text-xs text-neutral-500">
                                                    code: {c.code || "-"} • slug: {c.slug || "-"} • id: {c.id}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex gap-2">
                                            <button
                                                type="button"
                                                onClick={() => startEdit(c)}
                                                className="rounded-lg border px-3 py-1.5 text-sm hover:bg-neutral-50"
                                            >
                                                Edit
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => onDelete(c.id)}
                                                className="rounded-lg border border-red-200 bg-red-50 px-3 py-1.5 text-sm text-red-700 hover:bg-red-100"
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

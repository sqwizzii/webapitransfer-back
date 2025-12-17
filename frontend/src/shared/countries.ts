import { api } from "./api";
import type { Country } from "../types/country";

export async function getCountries(): Promise<Country[]> {
    const res = await api.get<Country[]>("/api/Countries");
    return res.data ?? [];
}

export async function createCountry(data: FormData): Promise<Country> {
    const res = await api.post<Country>("/api/Countries", data, {
        headers: { "Content-Type": "multipart/form-data" },
    });
    return res.data;
}

export async function updateCountry(fd: FormData) {
    return api.put("/api/Countries", fd, {
        headers: { "Content-Type": "multipart/form-data" },
    });
}


export async function deleteCountry(id: number): Promise<void> {
    await api.delete(`/api/Countries/${id}`);
}

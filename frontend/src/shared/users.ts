import { api } from "./api";

export type UserItem = {
    id: string;
    email: string;
    userName?: string;
    phoneNumber?: string;
    roles: string[];
};

export type SearchResult<T> = {
    items: T[];
    totalCount: number;
    page: number;
    pageSize: number;
};

export async function searchUsers(query: string, page = 1, pageSize = 10) {
    const res = await api.get<SearchResult<UserItem>>(
        "/api/Account/SearchUsers",
        {
            params: { query, page, pageSize },
        }
    );

    return res.data;
}

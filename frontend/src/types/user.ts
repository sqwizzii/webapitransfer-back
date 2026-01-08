export type UserItem = {
    id: number; // ✅ number, не string
    email: string;
    userName?: string | null;
    phoneNumber?: string | null;
    roles: string[];
};

export type SearchResult<T> = {
    items: T[];
    totalCount: number;
    page: number;
    pageSize: number;
};

export type Country = {
    id: number;
    name: string;
    code: string;
    slug: string;
    image: string;
};

export type City = {
    id: number;
    name: string;
    countryId: number;
};

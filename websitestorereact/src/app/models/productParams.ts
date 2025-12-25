export type ProductParams = {
    orderBy: string;
    searchTerm?: string;
    brands: string[];
    types: string[];
    pageNumber: number;
    pageSize: number;
}
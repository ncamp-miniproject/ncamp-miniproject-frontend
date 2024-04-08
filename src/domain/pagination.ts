export type PPagination = {
    previousPageSetAvailable: boolean;
    nextPageSetAvailable: boolean;
    previousPageSetEntry: number;
    nextPageSetEntry: number;
    pagesToDisplay: number[];
    currentPage: number;
    pageSize: number;
}
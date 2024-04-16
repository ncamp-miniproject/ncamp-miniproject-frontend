import {PPagination} from "../../domain/pagination";
import {Category, Product} from "../../domain/product";

export type CategoryResponseEntity = Category[];

export type ProductListResponseEntity = {
    count: number;
    products: Product[];
    pagination: PPagination;
};

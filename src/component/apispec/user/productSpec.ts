import {PPagination} from "../../../domain/pagination";
import {Category, Product} from "../../../domain/product";

export type CategoryResponseEntity = Category[];

export type ProductResponseEntity = {
    count: number;
    products: Product[];
    pagination: PPagination;
};

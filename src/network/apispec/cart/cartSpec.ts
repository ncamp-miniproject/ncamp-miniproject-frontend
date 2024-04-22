import {ProductInfoResponseBody} from "../product/productSpec";

export type CartListResponseBody = {
    priceSum: number;
    itemCount: number;
    productsInCart: {product: ProductInfoResponseBody; quantity: number}[];
};

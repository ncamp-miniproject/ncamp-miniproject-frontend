import { Category, ProductImage } from "../../../domain/product";

export type ProductInfoRequestParam = {
    userId: string;
}

export type ProductInfoResponseBody = {
    prodNo: number;
    seller: string;
    prodName: string;
    prodDetail: string;
    price: number;
    manuDate: string;
    stock: number;
    productImages: ProductImage[];
    category: Category;
};
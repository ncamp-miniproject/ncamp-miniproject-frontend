export type Category = {
    categoryNo: number;
    categoryName: string;
};

export type Product = {
    prodNo: number;
    seller: string;
    prodName: string;
    prodDetail: string;
    price: number;
    manuDate: Date;
    stock: number;
    productImages: ProductImage[];
    category: Category;
};

export type ProductImage = {
    imageNo: number;
    fileName: string;
    description: string;
    thumbnail: boolean;
};

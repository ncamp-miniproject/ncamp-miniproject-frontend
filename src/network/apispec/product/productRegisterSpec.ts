export type ProductImageDto = {
    fileExtension: string;
    base64Data: string;
    description: string;
    thumbnail: boolean;
};

export type ProductRegisterRequestBody = {
    seller: string;
    prodName: string;
    prodDetail: string;
    price: number;
    manuDate?: string;
    stock: number;
    categoryNo?: number;
    productImageDto: ProductImageDto[];
};

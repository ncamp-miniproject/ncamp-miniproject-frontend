import {ProductInfoResponseBody} from "../product/productSpec";

export type TransactionProductionDto = {
    tranNo: number;
    product: ProductInfoResponseBody;
    quantity: number;
};

export type PurchaseResponseBody = {
    tranNo: number;
    buyerId: string;
    paymentOption: {
        code: string;
        paymentName: string;
    };
    receiverPhone: string;
    divyAddr: string;
    divyRequest: string;
    tranStatusCode: {
        code: string;
        status: string;
    };
    orderDate: string; // yyyy-mm-dd
    divyDate: string; // yyyy-mm-dd
    transactionProductions: TransactionProductionDto[];
};

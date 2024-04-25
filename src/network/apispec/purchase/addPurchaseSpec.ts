export type AddPurchaseRequestBody = {
    buyerId: string;
    paymentOption: string;
    receiverName: string;
    receiverPhone: string;
    divyAddr: string;
    divyRequest: string;
    divyDate: string;
    tranProds: {
        prodNo: number;
        quantity: number;
    }[];
};

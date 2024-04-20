import {PPagination} from "../../../domain/pagination";
import {SearchCondition} from "../SearchCondition";
import {PurchaseResponseBody} from "./purchaseSpec";

export type SaleListRequestParams = {
    page: number;
    pageSize: number;
};

export type PurchaseListRequestParams = SaleListRequestParams & {
    searchKeyword: string;
    searchCondition: SearchCondition;
    buyerId: string;
};

export type PurchaseListResponseBody = {
    paginationInfo: PPagination;
    count: number;
    purchaseList: PurchaseResponseBody[];
    menu: string;
};

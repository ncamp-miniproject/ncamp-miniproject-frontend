/**
 * A request for signing in
 *
 * - path: /api/users
 * - method: GET
 */

import {PPagination} from "../../../domain/pagination";
import { SearchCondition } from "../SearchCondition";
import {UserResponseBody} from "./userSpec";

export type UserListRequestParam = {
    page: number;
    pageSize: number;
    searchCondition: SearchCondition;
    searchKeyword: string;
};

export type UserListResponseBody = {
    count: number;
    list: UserResponseBody[];
    paginationInfo: PPagination;
};

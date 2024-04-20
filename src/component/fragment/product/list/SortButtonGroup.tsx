import {ButtonGroup, Dropdown, DropdownButton} from "react-bootstrap";
import {SetURLSearchParams} from "react-router-dom";

export function SortButtonGroup({
    queryParameters,
    setQueryParameters
}: {
    queryParameters: URLSearchParams;
    setQueryParameters: SetURLSearchParams;
}) {
    return (
        <ButtonGroup>
            <DropdownButton
                id="sortByProdName"
                title="상품이름 정렬"
                variant="secondary"
            >
                <Dropdown.Item
                    onClick={(e) => {
                        queryParameters.set("orderBy", "prodName");
                        queryParameters.set("ascend", "true");
                        queryParameters.set("page", "1");
                        setQueryParameters(queryParameters);
                    }}
                >
                    오름차순
                </Dropdown.Item>
                <Dropdown.Item
                    onClick={(e) => {
                        queryParameters.set("orderBy", "prodName");
                        queryParameters.set("ascend", "false");
                        queryParameters.set("page", "1");
                        setQueryParameters(queryParameters);
                    }}
                >
                    내림차순
                </Dropdown.Item>
            </DropdownButton>
            <DropdownButton
                id="sortByPrice"
                title="가격 정렬"
                variant="secondary"
            >
                <Dropdown.Item
                    onClick={(e) => {
                        queryParameters.set("orderBy", "price");
                        queryParameters.set("ascend", "true");
                        queryParameters.set("page", "1");
                        setQueryParameters(queryParameters);
                    }}
                >
                    가격 낮은 순
                </Dropdown.Item>
                <Dropdown.Item
                    onClick={(e) => {
                        queryParameters.set("orderBy", "price");
                        queryParameters.set("ascend", "false");
                        queryParameters.set("page", "1");
                        setQueryParameters(queryParameters);
                    }}
                >
                    가격 높은 순
                </Dropdown.Item>
            </DropdownButton>
            <DropdownButton
                id="sortByDate"
                title="날짜순 정렬"
                variant="secondary"
            >
                <Dropdown.Item
                    onClick={(e) => {
                        queryParameters.set("orderBy", "regDate");
                        queryParameters.set("ascend", "true");
                        queryParameters.set("page", "1");
                        setQueryParameters(queryParameters);
                    }}
                >
                    오래된 순
                </Dropdown.Item>
                <Dropdown.Item
                    onClick={(e) => {
                        queryParameters.set("orderBy", "regDate");
                        queryParameters.set("ascend", "false");
                        queryParameters.set("page", "1");
                        setQueryParameters(queryParameters);
                    }}
                >
                    최신순
                </Dropdown.Item>
            </DropdownButton>
        </ButtonGroup>
    );
}

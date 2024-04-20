import {useEffect, useRef, useState} from "react";
import {Button, Col, Container, Form, Row} from "react-bootstrap";
import {useAppSelector} from "../../../store/hook";
import {
    CategoryResponseEntity,
    ProductListResponseEntity
} from "../../../network/apispec/product/productListSpec";
import {Category, Product} from "../../../domain/product";
import {PPagination} from "../../../domain/pagination";
import httpRequest from "../../../network/httpRequest";
import PageDisplay from "../../fragment/PageDisplay";
import {useSearchParams} from "react-router-dom";
import PageSizeSelection from "../../fragment/PageSizeSelection";
import {SearchCondition} from "../../../network/apispec/SearchCondition";
import {SortButtonGroup} from "../../fragment/product/list/SortButtonGroup";
import {CategoryList} from "../../fragment/product/list/CategoryList";
import {ProductDisplay} from "../../fragment/product/list/ProductDisplay";

export default function ProductList() {
    const [queryParameters, setQueryParameters] = useSearchParams();

    const [categoryList, setCategoryList] = useState<Category[]>([]);
    const [products, setProducts] = useState<Product[]>([]);
    const [count, setCount] = useState<number>();
    const [pagination, setPagination] = useState<PPagination>({
        previousPageSetAvailable: false,
        nextPageSetAvailable: false,
        previousPageSetEntry: 1,
        nextPageSetEntry: 1,
        pagesToDisplay: [],
        currentPage: 1
    });
    const [currentPage, setCurrentPage] = useState<number | undefined>();
    const [searchKeyword, setSearchKeyword] = useState<string>("");
    const [priceLowerBound, setPriceLowerBound] = useState<number>(0);
    const [priceUpperBound, setPriceUpperBound] = useState<number>(0);

    const searchConditionRef = useRef<HTMLSelectElement>(null);

    const apiUrl = useAppSelector((state) => state.metadata.apiUrl);
    useEffect(() => {
        apiUrl &&
            httpRequest(
                `${apiUrl}/api/products`,
                (response) => {
                    const responseEntity =
                        response.data as ProductListResponseEntity;

                    console.log(responseEntity);

                    setProducts(
                        responseEntity.products.map((prod) => {
                            return {...prod, manuDate: new Date(prod.manuDate)};
                        })
                    );
                    setCount(responseEntity.count);
                    setPagination(responseEntity.pagination);
                },
                queryParameters
            );

        apiUrl &&
            httpRequest(`${apiUrl}/api/categories`, (response) => {
                const responseEntity = response.data as CategoryResponseEntity;
                setCategoryList(responseEntity.map((re) => re as Category));
            });
    }, [apiUrl, queryParameters]);

    let searchConditionForm;
    if (!searchConditionRef || searchConditionRef.current?.value === "1") {
        searchConditionForm = (
            <Form.Control
                type="text"
                id="inputSearchKeyword"
                placeholder="검색어 입력"
                onChange={(e) => {
                    setSearchKeyword(e.target.value);
                }}
                onKeyDown={(e) => {
                    if (e.key === "Enter") {
                        search();
                    }
                }}
            />
        );
    } else {
        searchConditionForm = (
            <>
                <Form.Control
                    type="number"
                    placeholder="lower bound"
                    onChange={(e) => {
                        setPriceLowerBound(parseInt(e.target.value));
                    }}
                    onKeyDown={(e) => {
                        if (e.key === "Enter") {
                            search();
                        }
                    }}
                />
                -
                <Form.Control
                    type="number"
                    placeholder="upper bound"
                    onChange={(e) => {
                        setPriceUpperBound(parseInt(e.target.value));
                    }}
                    onKeyDown={(e) => {
                        if (e.key === "Enter") {
                            search();
                        }
                    }}
                />
            </>
        );
    }

    function search() {
        if (
            !searchConditionRef ||
            searchConditionRef.current?.value === SearchCondition.BY_NAME
        ) {
            queryParameters.set("searchKeyword", searchKeyword);
        } else {
            queryParameters.set(
                "searchKeyword",
                `${priceLowerBound}-${priceUpperBound}`
            );
        }
        searchConditionRef.current
            ? queryParameters.set(
                  "searchCondition",
                  searchConditionRef.current.value
              )
            : queryParameters.set("searchCondition", SearchCondition.BY_NAME);
        queryParameters.set("page", "1");
        setQueryParameters(queryParameters);
    }

    return (
        <Container>
            <Row>
                <Col md={3}>
                    <CategoryList categories={categoryList} />
                </Col>
                <Col md={9} style={productDisplayStyle}>
                    <h2>상품 목록 조회</h2>
                    <Row>
                        <Col md={3}>
                            <Form.Select ref={searchConditionRef}>
                                <option value="1">상품명</option>
                                <option value="2">상품가격</option>
                            </Form.Select>
                        </Col>
                        <Col md={5}>{searchConditionForm}</Col>
                        <Col md={2}>
                            <Button
                                variant="primary"
                                onClick={(e) => {
                                    search();
                                }}
                            >
                                검색
                            </Button>
                        </Col>
                    </Row>
                    <div
                        style={{
                            display: "flex",
                            flexDirection: "row",
                            justifyContent: "space-between"
                        }}
                    >
                        <SortButtonGroup />
                        <PageSizeSelection />
                    </div>
                    <PageDisplay
                        pagination={pagination}
                        setCurrentPage={setCurrentPage}
                    />
                    <p>전체 {count}개 상품</p>
                    <ProductDisplay products={products} />
                </Col>
            </Row>
        </Container>
    );
}

const productDisplayStyle: React.CSSProperties = {
    display: "flex",
    flexDirection: "column",
    gap: "16px"
};

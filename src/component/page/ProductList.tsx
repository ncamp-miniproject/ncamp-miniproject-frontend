import {useEffect, useState} from "react";
import {
    Button,
    ButtonGroup,
    Col,
    Container,
    Dropdown,
    DropdownButton,
    Form,
    Image,
    ListGroup,
    Pagination,
    Row
} from "react-bootstrap";
import {useAppSelector} from "../../store/hook";
import {
    CategoryResponseEntity,
    ProductListResponseEntity
} from "../../network/product/productSpec";
import {Category, Product} from "../../domain/product";
import {PPagination} from "../../domain/pagination";
import httpRequest from "../../network/httpRequest";

type ApiRequestOptions = {
    menu?: string;
    page?: number;
    pageSize?: number;
    searchKeyword?: string;
    categoryNo?: number;
    orderBy?: string;
    ascend?: boolean;
};

export default function ProductList() {
    const [categoryList, setCategoryList] = useState<Category[]>([]);
    const [products, setProducts] = useState<Product[]>([]);
    const [count, setCount] = useState<number>();
    const [pagination, setPagination] = useState<PPagination>({
        previousPageSetAvailable: false,
        nextPageSetAvailable: false,
        previousPageSetEntry: 1,
        nextPageSetEntry: 1,
        pagesToDisplay: [],
        currentPage: 1,
        pageSize: 3
    });
    const [apiRequestOptions, setApiRequestOptions] =
        useState<ApiRequestOptions>({});
    const [searchKeyword, setSearchKeyword] = useState<string>("");
    const [searchCondition, setSearchCondition] = useState<string>("1");
    const [priceLowerBound, setPriceLowerBound] = useState<number>(0);
    const [priceUpperBound, setPriceUpperBound] = useState<number>(0);

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
                {
                    ...apiRequestOptions,
                    searchCondition
                }
            );

        apiUrl &&
            httpRequest(`${apiUrl}/api/categories`, (response) => {
                const responseEntity = response.data as CategoryResponseEntity;
                setCategoryList(responseEntity.map((re) => re as Category));
            });
    }, [apiUrl, apiRequestOptions]);

    let searchConditionForm;
    if (searchCondition === "1") {
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
                        setApiRequestOptions({
                            ...apiRequestOptions,
                            searchKeyword,
                            page: 1
                        });
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
                            setApiRequestOptions({
                                ...apiRequestOptions,
                                searchKeyword: `${priceLowerBound}-${priceUpperBound}`,
                                page: 1
                            });
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
                            setApiRequestOptions({
                                ...apiRequestOptions,
                                searchKeyword: `${priceLowerBound}-${priceUpperBound}`,
                                page: 1
                            });
                        }
                    }}
                />
            </>
        );
    }

    return (
        <Container>
            <Row>
                <Col md={3}>
                    <CategoryList
                        categories={categoryList}
                        apiRequestOptions={apiRequestOptions}
                        setApiRequestOptions={setApiRequestOptions}
                    />
                </Col>
                <Col md={9} style={productDisplayStyle}>
                    <h2>상품 목록 조회</h2>
                    <Row>
                        <Col md={3}>
                            <Form.Select
                                onChange={(e) => {
                                    setSearchCondition(e.target.value);
                                }}
                            >
                                <option value="1">상품명</option>
                                <option value="2">상품가격</option>
                            </Form.Select>
                        </Col>
                        <Col md={5}>{searchConditionForm}</Col>
                        <Col md={2}>
                            <Button
                                variant="primary"
                                onClick={(e) => {
                                    setApiRequestOptions({
                                        ...apiRequestOptions,
                                        searchKeyword,
                                        page: 1
                                    });
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
                        <SortButtonGroup
                            apiRequestOptions={apiRequestOptions}
                            setApiRequestOptions={setApiRequestOptions}
                        />
                        <DropdownButton
                            id="pageSize"
                            title="페이지 크기"
                            variant="secondary"
                        >
                            <Dropdown.Item
                                onClick={() =>
                                    setApiRequestOptions({
                                        ...apiRequestOptions,
                                        pageSize: 3,
                                        page: 1
                                    })
                                }
                            >
                                3
                            </Dropdown.Item>
                            <Dropdown.Item
                                onClick={() =>
                                    setApiRequestOptions({
                                        ...apiRequestOptions,
                                        pageSize: 5,
                                        page: 1
                                    })
                                }
                            >
                                5
                            </Dropdown.Item>
                            <Dropdown.Item
                                onClick={() =>
                                    setApiRequestOptions({
                                        ...apiRequestOptions,
                                        pageSize: 10,
                                        page: 1
                                    })
                                }
                            >
                                10
                            </Dropdown.Item>
                        </DropdownButton>
                    </div>
                    <PageDisplay
                        pagination={pagination}
                        apiRequestOptions={apiRequestOptions}
                        setApiRequestOptions={setApiRequestOptions}
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

function SortButtonGroup({
    apiRequestOptions,
    setApiRequestOptions
}: {
    apiRequestOptions: ApiRequestOptions;
    setApiRequestOptions: React.Dispatch<
        React.SetStateAction<ApiRequestOptions>
    >;
}) {
    return (
        <ButtonGroup>
            <DropdownButton
                id="sortByProdName"
                title="상품이름 정렬"
                variant="secondary"
            >
                <Dropdown.Item
                    onClick={(e) =>
                        setApiRequestOptions({
                            ...apiRequestOptions,
                            orderBy: "prodName",
                            ascend: true,
                            page: 1
                        })
                    }
                >
                    오름차순
                </Dropdown.Item>
                <Dropdown.Item
                    onClick={(e) =>
                        setApiRequestOptions({
                            ...apiRequestOptions,
                            orderBy: "prodName",
                            ascend: false,
                            page: 1
                        })
                    }
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
                    onClick={(e) =>
                        setApiRequestOptions({
                            ...apiRequestOptions,
                            orderBy: "price",
                            ascend: true,
                            page: 1
                        })
                    }
                >
                    가격 낮은 순
                </Dropdown.Item>
                <Dropdown.Item
                    onClick={(e) =>
                        setApiRequestOptions({
                            ...apiRequestOptions,
                            orderBy: "price",
                            ascend: false,
                            page: 1
                        })
                    }
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
                    onClick={(e) =>
                        setApiRequestOptions({
                            ...apiRequestOptions,
                            orderBy: "regDate",
                            ascend: true,
                            page: 1
                        })
                    }
                >
                    오래된 순
                </Dropdown.Item>
                <Dropdown.Item
                    onClick={(e) =>
                        setApiRequestOptions({
                            ...apiRequestOptions,
                            orderBy: "regDate",
                            ascend: false,
                            page: 1
                        })
                    }
                >
                    최신순
                </Dropdown.Item>
            </DropdownButton>
        </ButtonGroup>
    );
}

function CategoryList({
    categories,
    apiRequestOptions,
    setApiRequestOptions
}: {
    categories: Category[];
    apiRequestOptions: ApiRequestOptions;
    setApiRequestOptions: React.Dispatch<
        React.SetStateAction<ApiRequestOptions>
    >;
}) {
    const [selectedCategoryNoCurrently, setSelectedCategoryNoCurrently] =
        useState<number | undefined>(undefined);
    return (
        <ListGroup>
            <ListGroup.Item
                action
                active={!selectedCategoryNoCurrently}
                onClick={() => {
                    setSelectedCategoryNoCurrently(undefined);
                    setApiRequestOptions({
                        ...apiRequestOptions,
                        categoryNo: undefined,
                        page: 1
                    });
                }}
            >
                모든 상품
            </ListGroup.Item>
            {categories &&
                categories.map((category) => (
                    <ListGroup.Item
                        action
                        key={`category-${category.categoryNo}`}
                        onClick={() => {
                            setSelectedCategoryNoCurrently(category.categoryNo);
                            setApiRequestOptions({
                                ...apiRequestOptions,
                                categoryNo: category.categoryNo,
                                page: 1
                            });
                        }}
                        active={
                            selectedCategoryNoCurrently === category.categoryNo
                        }
                    >
                        {category.categoryName}
                    </ListGroup.Item>
                ))}
        </ListGroup>
    );
}

function PageDisplay({
    pagination,
    apiRequestOptions,
    setApiRequestOptions
}: {
    pagination: PPagination;
    apiRequestOptions: ApiRequestOptions;
    setApiRequestOptions: React.Dispatch<
        React.SetStateAction<ApiRequestOptions>
    >;
}) {
    return (
        <Pagination>
            <Pagination.Prev
                disabled={!pagination.previousPageSetAvailable}
                onClick={() =>
                    setApiRequestOptions({
                        ...apiRequestOptions,
                        page: pagination.previousPageSetEntry
                    })
                }
            />
            {pagination.pagesToDisplay.map((page) => {
                return (
                    <Pagination.Item
                        key={`page-${page}`}
                        active={page === pagination.currentPage}
                        onClick={() => {
                            setApiRequestOptions({...apiRequestOptions, page});
                        }}
                    >
                        {page}
                    </Pagination.Item>
                );
            })}
            <Pagination.Next
                disabled={!pagination.nextPageSetAvailable}
                onClick={() =>
                    setApiRequestOptions({
                        ...apiRequestOptions,
                        page: pagination.nextPageSetEntry
                    })
                }
            />
        </Pagination>
    );
}

type ProductItemDisplay = {
    prodName: string;
    price: number;
    manuDate: string;
    category: Category | null;
    imageFileName: string;
};

function ProductDisplay({products}: {products: Product[]}) {
    return (
        <div style={productListStyle}>
            {products.map((prod) => (
                <ProductItem
                    key={`prod-item-${prod.prodNo}`}
                    prodName={prod.prodName}
                    price={prod.price}
                    manuDate={prod.manuDate.toISOString()}
                    category={prod.category}
                    imageFileName={
                        prod.productImages && prod.productImages.length >= 1
                            ? prod.productImages[0].fileName
                            : ""
                    }
                />
            ))}
        </div>
    );
}

const productListStyle: React.CSSProperties = {
    display: "flex",
    flexDirection: "column",
    gap: "12px"
};

function ProductItem({
    prodName,
    price,
    manuDate,
    category,
    imageFileName
}: ProductItemDisplay) {
    const apiUrl = useAppSelector((state) => state.metadata.apiUrl);

    return (
        <Row style={prodItemStyle}>
            <Col md={4}>
                {apiUrl && (
                    <Image
                        src={`${apiUrl}/images/uploadFiles/${imageFileName}`}
                        alt="product"
                        thumbnail
                    />
                )}
            </Col>
            <Col md={8}>
                <p>{prodName}</p>
                <p>{price}</p>
                <p>{category ? category.categoryName : "카테고리 없음"}</p>
                <p>{manuDate}</p>
            </Col>
        </Row>
    );
}

const prodItemStyle: React.CSSProperties = {
    border: "1px solid #ced4da",
    borderRadius: "10px",
    padding: "8px"
};

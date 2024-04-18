import {useEffect, useState} from "react";
import {
    Button,
    ButtonGroup,
    Card,
    Col,
    Container,
    Dropdown,
    DropdownButton,
    Form,
    ListGroup,
    Row
} from "react-bootstrap";
import {useAppSelector} from "../../../store/hook";
import {
    CategoryResponseEntity,
    ProductListResponseEntity
} from "../../../network/apispec/product/productListSpec";
import {Category, Product} from "../../../domain/product";
import {PPagination} from "../../../domain/pagination";
import httpRequest from "../../../network/httpRequest";
import PageDisplay from "../../fragment/PageDisplay";
import {ApiRequestOptions} from "../../../domain/ApiRequestOptions";
import {useNavigate} from "react-router-dom";
import PageSizeSelection from "../../fragment/PageSizeSelection";

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
    const [selectedCategoryNo, setSelectedCategoryNo] = useState<
        number | undefined
    >(undefined);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [pageSize, setPageSize] = useState<number>(3);
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
                    page: currentPage,
                    categoryNo: selectedCategoryNo,
                    searchCondition,
                    pageSize
                }
            );

        apiUrl &&
            httpRequest(`${apiUrl}/api/categories`, (response) => {
                const responseEntity = response.data as CategoryResponseEntity;
                setCategoryList(responseEntity.map((re) => re as Category));
            });
    }, [apiUrl, apiRequestOptions, currentPage, selectedCategoryNo, pageSize]);

    useEffect(() => {
        setCurrentPage(1);
    }, [apiRequestOptions, selectedCategoryNo, pageSize]);

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
                            searchKeyword
                        });
                        setCurrentPage(1);
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
                                searchKeyword: `${priceLowerBound}-${priceUpperBound}`
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
                                searchKeyword: `${priceLowerBound}-${priceUpperBound}`
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
                        selectedCategoryNo={selectedCategoryNo}
                        setSelectedCategoryNo={setSelectedCategoryNo}
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
                                        searchKeyword
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
                        <PageSizeSelection setPageSize={setPageSize} />
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
                            ascend: true
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
                            ascend: false
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
                            ascend: true
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
                            ascend: false
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
                            ascend: true
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
                            ascend: false
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
    selectedCategoryNo: categoryNo,
    setSelectedCategoryNo: setCategoryNo
}: {
    categories: Category[];
    selectedCategoryNo: number | undefined;
    setSelectedCategoryNo: React.Dispatch<
        React.SetStateAction<number | undefined>
    >;
}) {
    return (
        <ListGroup>
            <ListGroup.Item
                action
                active={!categoryNo}
                onClick={() => {
                    setCategoryNo(undefined);
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
                            setCategoryNo(category.categoryNo);
                        }}
                        active={categoryNo === category.categoryNo}
                    >
                        {category.categoryName}
                    </ListGroup.Item>
                ))}
        </ListGroup>
    );
}

function ProductDisplay({products}: {products: Product[]}) {
    return (
        <Container>
            <Row>
                {products.map(
                    (
                        {
                            prodNo,
                            prodName,
                            prodDetail,
                            price,
                            manuDate,
                            stock,
                            productImages,
                            category
                        },
                        idx
                    ) => (
                        <Col md={4} key={`col-${idx}`}>
                            <ProductItem
                                key={`prod-item-${idx}`}
                                prodNo={prodNo}
                                prodName={prodName}
                                prodDetail={prodDetail}
                                price={price}
                                imageFileName={
                                    productImages && productImages.length >= 1
                                        ? productImages[0].fileName
                                        : ""
                                }
                                category={category}
                            />
                        </Col>
                    )
                )}
            </Row>
        </Container>
    );
}

type ProductItemDisplay = {
    prodNo: number;
    prodName: string;
    prodDetail: string;
    price: number;
    category: Category | null;
    imageFileName: string;
};

function ProductItem({
    prodNo,
    prodName,
    prodDetail,
    price,
    category,
    imageFileName
}: ProductItemDisplay) {
    const navigate = useNavigate();
    const trimmedProdDetail =
        prodDetail.length > 15 ? prodDetail.substring(0, 15) : "";
    const apiUrl = useAppSelector((state) => state.metadata.apiUrl);
    return (
        <Card onClick={() => navigate(`${prodNo}`)}>
            <Card.Header>{prodNo}</Card.Header>
            <Card.Img variant="top" src={apiUrl ? `${apiUrl}/images/uploadFiles/${imageFileName}` : ""} />
            <Card.Body>
                <Card.Title>{prodName}</Card.Title>
                <Card.Text>{price}</Card.Text>
                <Card.Text>
                    {trimmedProdDetail}
                    {prodDetail.length > 15 ? "..." : ""}
                </Card.Text>
                <Card.Text>
                    {category ? category.categoryName : "카테고리 없음"}
                </Card.Text>
            </Card.Body>
        </Card>
    );
}

import {useEffect, useState} from "react";
import {
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
import axios from "axios";
import {
    CategoryResponseEntity,
    ProductResponseEntity
} from "../apispec/user/productSpec";
import {Category, Product} from "../../domain/product";
import {PPagination} from "../../domain/pagination";

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

    const apiUrl = useAppSelector((state) => state.metadata.apiUrl);

    useEffect(() => {
        apiUrl &&
            axios.get(`${apiUrl}/api/products`).then((response) => {
                const responseEntity = response.data as ProductResponseEntity;

                console.log(responseEntity);

                setProducts(
                    responseEntity.products.map((prod) => {
                        return {...prod, manuDate: new Date(prod.manuDate)};
                    })
                );
                setCount(responseEntity.count);
                setPagination(responseEntity.pagination);
            });

        apiUrl &&
            axios.get(`${apiUrl}/api/categories`).then((response) => {
                const responseEntity = response.data as CategoryResponseEntity;
                setCategoryList(responseEntity.map((re) => re as Category));
            });
    }, [apiUrl]);

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
                            <Form.Select>
                                <option value="1">상품명</option>
                                <option value="2">상품가격</option>
                            </Form.Select>
                        </Col>
                        <Col md={5}>
                            <Form.Control
                                type="text"
                                id="inputSearchKeyword"
                                placeholder="검색어 입력"
                            />
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
                        <DropdownButton
                            id="pageSize"
                            title="페이지 크기"
                            variant="secondary"
                        >
                            <Dropdown.Item>3</Dropdown.Item>
                            <Dropdown.Item>5</Dropdown.Item>
                            <Dropdown.Item>10</Dropdown.Item>
                        </DropdownButton>
                    </div>
                    <PageDisplay pagination={pagination} />
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

function SortButtonGroup() {
    return (
        <ButtonGroup>
            <DropdownButton
                id="sortByProdName"
                title="상품이름 정렬"
                variant="secondary"
            >
                <Dropdown.Item>오름차순</Dropdown.Item>
                <Dropdown.Item>내림차순</Dropdown.Item>
            </DropdownButton>
            <DropdownButton
                id="sortByPrice"
                title="가격 정렬"
                variant="secondary"
            >
                <Dropdown.Item>가격 낮은 순</Dropdown.Item>
                <Dropdown.Item>가격 높은 순</Dropdown.Item>
            </DropdownButton>
            <DropdownButton
                id="sortByDate"
                title="날짜순 정렬"
                variant="secondary"
            >
                <Dropdown.Item>오래된 순</Dropdown.Item>
                <Dropdown.Item>최신순</Dropdown.Item>
            </DropdownButton>
        </ButtonGroup>
    );
}

function CategoryList({categories}: {categories: Category[]}) {
    return (
        <ListGroup>
            <ListGroup.Item action active>
                모든 상품
            </ListGroup.Item>
            {categories &&
                categories.map((category) => (
                    <ListGroup.Item
                        action
                        key={`category-${category.categoryNo}`}
                    >
                        {category.categoryName}
                    </ListGroup.Item>
                ))}
        </ListGroup>
    );
}

function PageDisplay({pagination}: {pagination: PPagination}) {
    return (
        <Pagination>
            <Pagination.Prev disabled={!pagination.previousPageSetAvailable} />
            {pagination.pagesToDisplay.map((page) => {
                return (
                    <Pagination.Item
                        key={`page-${page}`}
                        active={page === pagination.currentPage}
                    >
                        {page}
                    </Pagination.Item>
                );
            })}
            <Pagination.Next disabled={!pagination.nextPageSetAvailable} />
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

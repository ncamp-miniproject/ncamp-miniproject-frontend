import {useEffect, useState} from "react";
import httpRequest, {HttpMethod} from "../../../network/httpRequest";
import {CartListResponseBody} from "../../../network/apispec/cart/cartSpec";
import {Button, Col, Container, ListGroup, Row} from "react-bootstrap";
import {ProductInfoResponseBody} from "../../../network/apispec/product/productSpec";
import {useNavigate} from "react-router-dom";
import {apiServerUrl} from "../../../common/constants";

export default function CartList() {
    const [productsInCart, setProductInCarts] = useState<
        {product: ProductInfoResponseBody; quantity: number}[]
    >([]);
    const [itemCount, setItemCount] = useState(0);
    const [priceSum, setPriceSum] = useState(0);

    useEffect(() => {
        httpRequest({
            url: `/api/cart`,
            callback: (response) => {
                const data = response.data as CartListResponseBody;
                console.log(data);
                setProductInCarts(data.productsInCart);
                setItemCount(data.itemCount);
                setPriceSum(data.priceSum);
            },
            method: HttpMethod.GET,
            withCredentials: true
        });
    }, []);

    useEffect(() => {
        let ic = 0;
        let ps = 0;
        for (const pc of productsInCart) {
            ic += pc.quantity;
            ps += pc.product.price * pc.quantity;
        }
        setItemCount(ic);
        setPriceSum(ps);
    }, [productsInCart]);

    const navigate = useNavigate();

    return (
        <Container>
            <h2>장바구니</h2>
            <p>총액: {priceSum}</p>
            <p>총 수량: {itemCount}</p>
            <Button
                variant="secondary"
                onClick={() => {
                    const queryParams = productsInCart
                        .map((p) => `${p.product.prodNo}=${p.quantity}`)
                        .join("&");

                    navigate(`/purchases/purchase-form?${queryParams}`);
                }}
                disabled={itemCount === 0}
            >
                구매하기
            </Button>
            <Button
                variant="danger"
                onClick={() => {
                    httpRequest({
                        url: "/api/cart",
                        callback: (response) => {
                            if (response.status === 204) {
                                setProductInCarts([]);
                                setItemCount(0);
                                setPriceSum(0);
                            }
                        },
                        method: HttpMethod.DELETE,
                        withCredentials: true
                    });
                }}
            >
                초기화
            </Button>
            <ListGroup as="ul">
                {productsInCart.map((p, idx) => (
                    <ListGroup.Item key={`prod-${idx}`}>
                        <ProductItem
                            productsInCart={productsInCart}
                            setProductsInCart={setProductInCarts}
                            index={idx}
                        />
                    </ListGroup.Item>
                ))}
            </ListGroup>
        </Container>
    );
}

function ProductItem({
    productsInCart,
    setProductsInCart,
    index
}: {
    productsInCart: {product: ProductInfoResponseBody; quantity: number}[];
    setProductsInCart: React.Dispatch<
        React.SetStateAction<
            {
                product: ProductInfoResponseBody;
                quantity: number;
            }[]
        >
    >;
    index: number;
}) {
    const product = productsInCart[index].product;
    const quantity = productsInCart[index].quantity;

    const thumbnailFiles = product.productImages?.filter((p) => p.thumbnail);
    const thumbnailFile =
        thumbnailFiles && thumbnailFiles.length > 0 && thumbnailFiles[0];

    return (
        <Container>
            <Row>
                <Col md={3}>
                    <img
                        src={
                            thumbnailFile
                                ? thumbnailFile.fileName
                                : ""
                        }
                        alt="prod"
                        style={{height: "256px"}}
                    />
                </Col>
                <Col md={9}>
                    <h5>상품명: {product.prodName}</h5>
                    <p>가격: {product.price}</p>
                    <p>
                        수량:{" "}
                        <input
                            type="number"
                            value={quantity}
                            onChange={(e) => {
                                if (parseInt(e.target.value) < 1) {
                                    return;
                                }
                                productsInCart[index] = {
                                    product,
                                    quantity: parseInt(e.target.value)
                                };
                                setProductsInCart([...productsInCart]);
                            }}
                        />
                    </p>
                </Col>
            </Row>
        </Container>
    );
}

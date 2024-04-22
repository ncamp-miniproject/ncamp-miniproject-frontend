import {useEffect, useState} from "react";
import httpRequest, {HttpMethod} from "../../../network/httpRequest";
import {useAppSelector} from "../../../store/hook";
import {CartListResponseBody} from "../../../network/apispec/cart/cartSpec";
import {Button, Col, Container, ListGroup, Row} from "react-bootstrap";
import {ProductInfoResponseBody} from "../../../network/apispec/product/productSpec";

export default function CartList() {
    const [cartData, setCartData] = useState<CartListResponseBody>({
        itemCount: 0,
        priceSum: 0,
        productsInCart: []
    });

    const apiUrl = useAppSelector((state) => state.metadata.apiUrl);

    useEffect(() => {
        apiUrl &&
            httpRequest({
                url: `${apiUrl}/api/cart`,
                callback: (response) => {
                    const data = response.data as CartListResponseBody;
                    console.log(data);
                    setCartData(data);
                },
                method: HttpMethod.GET,
                withCredentials: true
            });
    }, [apiUrl]);
    return (
        <Container>
            <h2>장바구니</h2>
            <p>총액: {cartData.priceSum}</p>
            <p>총 수량: {cartData.itemCount}</p>
            <Button variant="secondary" onClick={() => {}}>
                구매하기
            </Button>
            <ListGroup as="ul">
                {cartData.productsInCart.map((p, idx) => (
                    <ListGroup.Item key={`prod-${idx}`}>
                        <ProductItem
                            product={p.product}
                            quantity={p.quantity}
                        />
                    </ListGroup.Item>
                ))}
            </ListGroup>
        </Container>
    );
}

function ProductItem({
    product,
    quantity
}: {
    product: ProductInfoResponseBody;
    quantity: number;
}) {
    const apiUrl = useAppSelector((state) => state.metadata.apiUrl);

    const thumbnailFiles = product.productImages?.filter((p) => p.thumbnail);
    const thumbnailFile =
        thumbnailFiles && thumbnailFiles.length > 0 && thumbnailFiles[0];
    console.log(product);
    return (
        <Container>
            <Row>
                <Col md={3}>
                    <img
                        src={
                            apiUrl && thumbnailFile
                                ? `${apiUrl}/images/uploadFiles/${thumbnailFile.fileName}`
                                : ""
                        }
                        alt="prod"
                        style={{height: "256px"}}
                    />
                </Col>
                <Col md={9}>
                    <h5>상품명: {product.prodName}</h5>
                    <p>가격: {product.price}</p>
                    <p>수량: {quantity}</p>
                </Col>
            </Row>
        </Container>
    );
}

import "../../../css/ProductInfo.css";
import {Button, Col, Container, Row} from "react-bootstrap";
import {useNavigate, useParams} from "react-router-dom";
import {useAppSelector} from "../../../store/hook";
import {useEffect, useState} from "react";
import {ProductImage} from "../../../domain/product";
import httpRequest, {HttpMethod} from "../../../network/httpRequest";
import {ProductInfoResponseBody} from "../../../network/apispec/product/productSpec";
import * as Icon from "react-bootstrap-icons";

export default function ProductInfo() {
    const [product, setProduct] = useState<
        ProductInfoResponseBody | undefined
    >();
    const [quantity, setQuantity] = useState<number>(1);

    const {prodNo} = useParams();
    const loginUser = useAppSelector((state) => state.loginUser.value);
    const navigate = useNavigate();

    useEffect(() => {
        prodNo &&
            httpRequest({
                url: `/api/products/${prodNo}`,
                callback: (response) => {
                    const data = response.data as ProductInfoResponseBody;
                    setProduct(data);
                },
                params: {
                    userId: loginUser?.userId
                }
            });
    }, []);

    const thumbnailImageName = product?.productImages.filter(
        (d) => d.thumbnail
    )[0].fileName;

    return (
        <div>
            <h2>상품 상세</h2>
            {product && (
                <Container>
                    <Row>
                        <Col md={6}>
                            {thumbnailImageName && (
                                <img
                                    className="thumbnail"
                                    src={
                                        thumbnailImageName
                                            ? thumbnailImageName
                                            : ""
                                    }
                                    alt="Product Thumnail"
                                />
                            )}
                        </Col>
                        <Col md={6}>
                            <div className="product-info">
                                <div className="product-summary">
                                    <Row>
                                        <Col className="data-label" md={4}>
                                            상품명
                                        </Col>
                                        <Col className="data-display" md={8}>
                                            {product.prodName}
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col className="data-label" md={4}>
                                            가격
                                        </Col>
                                        <Col className="data-display" md={8}>
                                            {product.price}
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col className="data-label" md={4}>
                                            제조일자
                                        </Col>
                                        <Col className="data-display" md={8}>
                                            {product.manuDate}
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col className="data-label" md={4}>
                                            판매자
                                        </Col>
                                        <Col className="data-display" md={8}>
                                            {product.seller ? (
                                                <a
                                                    href="#"
                                                    onClick={() => {
                                                        navigate(
                                                            `/sale/${product.seller}`
                                                        );
                                                    }}
                                                >
                                                    {product.seller}
                                                </a>
                                            ) : (
                                                ""
                                            )}
                                        </Col>
                                    </Row>
                                </div>
                                <div className="purchase">
                                    <div>
                                        <label>수량</label>
                                        <input
                                            type="number"
                                            value={quantity}
                                            onChange={(e) => {
                                                const q = parseInt(
                                                    e.target.value
                                                );
                                                if (q < 1) {
                                                    setQuantity(1);
                                                } else {
                                                    setQuantity(q);
                                                }
                                            }}
                                        />
                                    </div>
                                    <Button
                                        variant="primary"
                                        onClick={() => {
                                            if (prodNo) {
                                                console.log("here");
                                                httpRequest({
                                                    url: `/api/cart`,
                                                    callback: (response) => {
                                                        if (
                                                            Math.round(
                                                                response.status /
                                                                    100
                                                            ) === 2
                                                        ) {
                                                            alert(
                                                                "장바구니에 추가됐습니다."
                                                            );
                                                        }
                                                    },
                                                    method: HttpMethod.POST,
                                                    body: {
                                                        prodNo,
                                                        quantity
                                                    },
                                                    withCredentials: true
                                                });
                                            }
                                        }}
                                    >
                                        장바구니
                                    </Button>
                                </div>
                            </div>
                        </Col>
                    </Row>
                    <h3>상품 상세</h3>
                    <p>{product.prodDetail}</p>
                    <h3>상품 이미지</h3>
                </Container>
            )}
            <ProductImageDisplay productImages={product?.productImages} />
            <Button onClick={() => navigate(-1)}>뒤로</Button>
        </div>
    );
}

function ProductImageDisplay({
    productImages
}: {
    productImages: ProductImage[] | undefined;
}) {
    const [imgIdx, setImgIdx] = useState(0);

    useEffect(() => {
        if (imgIdx < 0) {
            setImgIdx(0);
        }
        if (productImages && imgIdx >= productImages.length) {
            setImgIdx(productImages.length - 1);
        }
    }, [imgIdx]);

    return (
        <>
            <p>
                {imgIdx + 1} / {productImages?.length}
            </p>
            <div className="img-container">
                <Icon.ArrowLeft
                    size={64}
                    onClick={() => setImgIdx(imgIdx - 1)}
                />
                <div className="img-t">
                    <img
                        className="img-display"
                        src={
                            productImages &&
                            productImages.length >= 1 &&
                            imgIdx >= 0 &&
                            imgIdx < productImages.length
                                ? productImages[imgIdx].fileName
                                : ""
                        }
                        alt="Product"
                    />
                    <p>
                        {productImages &&
                            imgIdx >= 0 &&
                            imgIdx < productImages.length &&
                            productImages[imgIdx].description}
                    </p>
                </div>
                <Icon.ArrowRight
                    size={64}
                    onClick={() => setImgIdx(imgIdx + 1)}
                />
            </div>
        </>
    );
}

import "../../../css/PurchaseInfo.css";
import {useEffect, useState} from "react";
import {useParams} from "react-router-dom";
import {PurchaseResponseBody} from "../../../network/apispec/purchase/purchaseSpec";
import httpRequest from "../../../network/httpRequest";
import {useAppSelector} from "../../../store/hook";
import {Col, Container, Row} from "react-bootstrap";
import {ProductInfoResponseBody} from "../../../network/apispec/product/productSpec";
import {apiServerUrl} from "../../../common/constants";

export default function PurchaseInfo() {
    const {tranNo} = useParams();

    const [purchaseInfo, setPurchaseInfo] = useState<PurchaseResponseBody>();

    useEffect(() => {
        httpRequest({
            url: `/api/purchases/${tranNo}`,
            callback: (response) => {
                setPurchaseInfo(response.data);
            }
        });
    }, []);

    return (
        <Container>
            <h2>구매 조회</h2>
            <Row>
                <Col md={3}>구매 번호</Col>
                <Col md={9}>{purchaseInfo?.tranNo}</Col>
            </Row>
            <Row>
                <Col md={3}>구매자</Col>
                <Col md={9}>{purchaseInfo?.buyerId}</Col>
            </Row>
            <Row>
                <Col md={3}>구매 방법</Col>
                <Col md={9}>{purchaseInfo?.paymentOption.paymentName}</Col>
            </Row>
            <Row>
                <Col md={3}>수령인 연락처</Col>
                <Col md={9}>{purchaseInfo?.receiverPhone}</Col>
            </Row>
            <Row>
                <Col md={3}>배송지</Col>
                <Col md={9}>{purchaseInfo?.divyAddr}</Col>
            </Row>
            <Row>
                <Col md={3}>배송 요청 사항</Col>
                <Col md={9}>{purchaseInfo?.divyRequest}</Col>
            </Row>
            <Row>
                <Col md={3}>배송 상태</Col>
                <Col md={9}>{purchaseInfo?.tranStatusCode.status}</Col>
            </Row>
            <Row>
                <Col md={3}>주문일</Col>
                <Col md={9}>{purchaseInfo?.orderDate}</Col>
            </Row>
            <Row>
                <Col md={3}>배송 희망 날짜</Col>
                <Col md={9}>{purchaseInfo?.divyDate}</Col>
            </Row>
            {purchaseInfo &&
                purchaseInfo.transactionProductions &&
                purchaseInfo.transactionProductions.map((p, idx) => (
                    <TranProdInfo
                        key={`tran-prod-${idx}`}
                        tranNo={p.tranNo}
                        product={p.product}
                        quantity={p.quantity}
                    />
                ))}
        </Container>
    );
}

function TranProdInfo({
    tranNo,
    product,
    quantity
}: {
    tranNo: number;
    product: ProductInfoResponseBody;
    quantity: number;
}) {
    const thumbnailImage =
        product &&
        product.productImages &&
        product.productImages.filter((img) => img.thumbnail);
    return (
        <div className="tran-prod-info">
            <img
                src={
                    thumbnailImage && thumbnailImage.length > 0
                        ? `${apiServerUrl}/images/uploadFiles/${thumbnailImage[0].fileName}`
                        : ""
                }
                alt="Product"
            />
            <div>
                <p>{product.prodName}</p>
                <p>{product.price}</p>
                <p>
                    {product.category
                        ? product.category.categoryName
                        : "카테고리 없음"}
                </p>
                <p>주문 수량: {quantity}</p>
            </div>
        </div>
    );
}

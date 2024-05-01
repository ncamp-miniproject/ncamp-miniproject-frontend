import {useParams, useSearchParams} from "react-router-dom";
import {useEffect, useState} from "react";
import {Col, Container, Row} from "react-bootstrap";
import ProductList from "./ProductList";
import httpRequest from "../../../network/httpRequest";
import {SellerInfo} from "../../../network/apispec/seller/sellerInfoSpec";
import {apiServerUrl} from "../../../common/constants";

export default function SaleList() {
    const {seller} = useParams();
    const [queryParameters, setQueryParameters] = useSearchParams();

    const [sellerInfo, setSellerInfo] = useState<SellerInfo>();

    useEffect(() => {
        if (seller) {
            queryParameters.set("seller", seller);
            setQueryParameters(queryParameters);
        }
    }, []);

    useEffect(() => {
        if (queryParameters.has("seller")) {
            httpRequest({
                url: `/api/seller/${queryParameters.get("seller")}`,
                callback: (response) => {
                    const data = response.data as SellerInfo;
                    setSellerInfo(data);
                }
            });
        }
    }, [queryParameters]);

    return (
        <Container>
            <h2>판매자 정보</h2>
            <Row>
                <Col md={4}>
                    <img
                        src={
                            sellerInfo?.profileImageFile
                                ? `${apiServerUrl}/images/uploadFiles/${sellerInfo.profileImageFile}`
                                : ""
                        }
                        alt="Profile"
                        style={{width: "80%"}}
                    />
                </Col>
                <Col md={8}>
                    <h3>{sellerInfo?.nameOfUser}</h3>
                    <p>아이디: {sellerInfo?.sellerId}</p>
                    <p>이메일: {sellerInfo?.email}</p>
                    <p>연락처: {sellerInfo?.phone}</p>
                </Col>
                <h3>소개</h3>
                <p>{sellerInfo?.profile}</p>
            </Row>
            <ProductList />
        </Container>
    );
}

import {useEffect, useState} from "react";
import {useAppSelector} from "../../../store/hook";
import {LoginUser, Role} from "../../../domain/user";
import httpRequest, {HttpMethod} from "../../../network/httpRequest";
import {useSearchParams} from "react-router-dom";
import {PurchaseListResponseBody} from "../../../network/apispec/purchase/purchaseListSpec";
import {Button, Col, Container, Row, Table} from "react-bootstrap";
import PageSizeSelection from "../../fragment/PageSizeSelection";
import PageDisplay from "../../fragment/PageDisplay";
import {PurchaseResponseBody} from "../../../network/apispec/purchase/purchaseSpec";
import {Link} from "react-router-dom";

export default function PurchaseList() {
    const [queryParameters, setQueryParameters] = useSearchParams();

    const [purchaseList, setPurchaseList] = useState<PurchaseListResponseBody>({
        paginationInfo: {
            previousPageSetAvailable: false,
            nextPageSetAvailable: false,
            previousPageSetEntry: 0,
            nextPageSetEntry: 0,
            pagesToDisplay: [],
            currentPage: -1
        },
        count: 0,
        purchaseList: [],
        menu: ""
    });

    const loginUser = useAppSelector((state) => state.loginUser.value);
    const apiUrl = useAppSelector((state) => state.metadata.apiUrl);

    useEffect(() => {
        if (apiUrl && loginUser && loginUser.role) {
            let requestUrl: string;
            const apiQueryParameters = {} as any;
            console.log(queryParameters);
            queryParameters.forEach((v, k) => {
                apiQueryParameters[k] = v;
            });
            switch (loginUser.role) {
                case Role.USER:
                    requestUrl = `${apiUrl}/api/purchases`;
                    apiQueryParameters.buyerId = loginUser.userId;
                    break;
                case Role.ADMIN:
                    requestUrl = `${apiUrl}/api/purchases/sale`;
                    break;
                default:
                    console.error(
                        "The role of login user is invalid:" + loginUser.role
                    );
                    return;
            }

            httpRequest(
                requestUrl,
                (response) => {
                    const purchasesData =
                        response.data as PurchaseListResponseBody;
                    console.log(purchasesData);
                    setPurchaseList(purchasesData);
                },
                apiQueryParameters
            );
        }
    }, [apiUrl, loginUser, queryParameters]);

    return (
        <Container>
            <h2>
                {loginUser && loginUser.role === Role.ADMIN
                    ? "판매조회"
                    : "구매목록조회"}
            </h2>
            <p>전체 {purchaseList.count}건</p>
            <InfoTable purchaseList={purchaseList} />
            <Row>
                <Col md={9}>
                    <PageDisplay pagination={purchaseList.paginationInfo} />
                </Col>
                <Col md={3}>
                    <PageSizeSelection />
                </Col>
            </Row>
        </Container>
    );
}

function InfoTable({purchaseList}: {purchaseList: PurchaseListResponseBody}) {
    const loginUser = useAppSelector((state) => state.loginUser.value);

    return (
        <Table>
            <thead>
                <tr>
                    <th>구매번호</th>
                    <th>구매자 아이디</th>
                    <th>결제 방법</th>
                    <th>수령인 연락처</th>
                    <th>배송지</th>
                    <th>배송 요청 사항</th>
                    <th>배송 상태</th>
                    <th>주문일</th>
                    <th>배송 예상일</th>
                    {loginUser && loginUser.role === Role.ADMIN && (
                        <th>배송 상태 갱신</th>
                    )}
                </tr>
            </thead>
            <tbody>
                {purchaseList.purchaseList.map((purchase, idx) => (
                    <PurchaseItem key={`purchase-${idx}`} purchase={purchase} />
                ))}
            </tbody>
        </Table>
    );
}

const btnTitlePerTranStatusMap = new Map();
btnTitlePerTranStatusMap.set(1, "배송하기");
btnTitlePerTranStatusMap.set(2, "배송 완료");

function PurchaseItem({purchase}: {purchase: PurchaseResponseBody}) {
    const [tranStatus, setTranStatus] = useState<{
        code: string;
        status: string;
    }>();

    useEffect(() => {
        setTranStatus(purchase.tranStatusCode);
    }, [purchase]);

    const loginUser = useAppSelector((state) => state.loginUser.value);
    const apiUrl = useAppSelector((state) => state.metadata.apiUrl);

    const btnTitlePerTranStatus = btnTitlePerTranStatusMap.get(
        tranStatus ? parseInt(tranStatus.code) : -1
    );
    return (
        <tr>
            <td>
                <Link to={`${purchase.tranNo}`}>{purchase.tranNo}</Link>
            </td>
            <td>{purchase.buyerId}</td>
            <td>{purchase.paymentOption.paymentName}</td>
            <td>{purchase.receiverPhone}</td>
            <td>{purchase.divyAddr}</td>
            <td>{purchase.divyRequest}</td>
            <td>{tranStatus?.status}</td>
            <td>{purchase.orderDate}</td>
            <td>{purchase.divyDate}</td>
            {loginUser &&
                loginUser.role === Role.ADMIN &&
                btnTitlePerTranStatus && (
                    <Button
                        variant="secondary"
                        onClick={() => {
                            apiUrl &&
                                tranStatus &&
                                httpRequest(
                                    `${apiUrl}/api/purchases/${purchase.tranNo}/tran-code`,
                                    (response) => {
                                        const data = response.data as {
                                            code: string;
                                            status: string;
                                        };
                                        console.log(data);
                                        setTranStatus(data);
                                    },
                                    {
                                        tranCode: (
                                            parseInt(tranStatus.code) + 1
                                        ).toString()
                                    },
                                    HttpMethod.PATCH
                                );
                        }}
                    >
                        {btnTitlePerTranStatus}
                    </Button>
                )}
        </tr>
    );
}

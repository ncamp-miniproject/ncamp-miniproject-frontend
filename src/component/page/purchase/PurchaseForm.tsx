import {useNavigate, useSearchParams} from "react-router-dom";
import {useAppSelector} from "../../../store/hook";
import {useEffect, useRef, useState} from "react";
import {UserResponseBody} from "../../../network/apispec/user/userSpec";
import httpRequest, {HttpMethod} from "../../../network/httpRequest";
import {Button, Col, Container, Form, Row} from "react-bootstrap";
import {ProductInfoResponseBody} from "../../../network/apispec/product/productSpec";
import {CartListResponseBody} from "../../../network/apispec/cart/cartSpec";
import DaumPostcode from "react-daum-postcode";
import ReactDatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.module.css";
import {ProductItem} from "../../fragment/product/list/ProductItemDisplay";
import {AddPurchaseRequestBody} from "../../../network/apispec/purchase/addPurchaseSpec";

export default function PurchaseForm() {
    const [queryParameters, setQueryParameters] = useSearchParams();

    const [buyer, setBuyer] = useState<UserResponseBody>();
    const [cartData, setCartData] = useState<CartListResponseBody>({
        itemCount: 0,
        priceSum: 0,
        productsInCart: []
    });

    const loginUser = useAppSelector((state) => state.loginUser.value);
    const apiUrl = useAppSelector((state) => state.metadata.apiUrl);

    const [paymentOption, setPaymentOption] = useState<string>("0");
    const receiverNameRef = useRef<HTMLInputElement>(null);
    const [receiverPhone, setReceiverPhone] = useState<
        [string, string, string]
    >(["010", "", ""]);
    const [receiverPostCode, setReceiverPostCode] = useState<string>();
    // const [receiverAddr, setReceiverAddr] = useState<string>();
    const receiverAddrRef = useRef<HTMLInputElement>(null);
    const receiverDetailAddr = useRef<HTMLInputElement>(null);
    const divyRequestRef = useRef<HTMLInputElement>(null);
    const [divyDate, setDivyDate] = useState(new Date());

    const navigate = useNavigate();

    function validateInputs() {
        console.log(apiUrl);
        console.log(buyer);
        console.log(paymentOption);
        console.log(receiverNameRef.current?.value);
        console.log(receiverPhone);
        console.log(receiverAddrRef.current?.value);
        console.log(divyDate);
        return (
            apiUrl &&
            buyer &&
            paymentOption &&
            receiverNameRef.current?.value !== "" &&
            receiverPhone &&
            receiverAddrRef.current?.value !== "" &&
            receiverDetailAddr.current?.value !== "" &&
            divyDate
        );
    }

    useEffect(() => {
        if (loginUser && apiUrl) {
            httpRequest({
                url: `${apiUrl}/api/users/${loginUser.userId}`,
                callback: (response) => {
                    const data = response.data as UserResponseBody;
                    setBuyer(data);

                    if (receiverNameRef.current) {
                        receiverNameRef.current.value = data.nameOfUser;
                    }
                }
            });

            if (queryParameters.size > 0) {
                const pm = new Map();

                queryParameters.forEach((v, k) => {
                    pm.set(parseInt(k), parseInt(v));
                });

                const keys = pm.keys();
                const prods = [] as number[];
                while (true) {
                    const a = keys.next();
                    if (!a.value) {
                        break;
                    }
                    prods.push(a.value);
                }

                httpRequest({
                    url: `/api/products/selected`,
                    callback: (response) => {
                        const data = response.data as ProductInfoResponseBody[];
                        console.log(data);

                        const n = data.map((d) => {
                            return {
                                product: d,
                                quantity: pm.get(d.prodNo)
                            };
                        });

                        let ic = 0;
                        let ps = 0;
                        for (const d of n) {
                            ic += d.quantity;
                            ps += d.quantity * d.product.price;
                        }
                        setCartData({
                            itemCount: ic,
                            priceSum: ps,
                            productsInCart: n
                        });
                    },
                    baseUrl: apiUrl,
                    params: {
                        prodNos: prods.join(",")
                    }
                });
            }
        }
    }, [loginUser, apiUrl]);

    return (
        <Container>
            <Form>
                <Form.Group className="md-3">
                    <Form.Label>구매자 아이디</Form.Label>
                    <Form.Control value={buyer?.userId} disabled />
                </Form.Group>
                <Form.Group>
                    <Form.Label>결제방법</Form.Label>
                    <Form.Select
                        aria-label="Default select"
                        style={{width: "fit-content"}}
                        onChange={(e) => setPaymentOption(e.target.value)}
                    >
                        <option value="0">현금</option>
                        <option value="1">신용카드</option>
                    </Form.Select>
                </Form.Group>
                <Form.Group>
                    <Form.Label>수령자 이름</Form.Label>
                    <Form.Control ref={receiverNameRef} />
                </Form.Group>
                <Form.Group>
                    <Form.Label>수령인 연락처</Form.Label>
                    <Row>
                        <Col md={2}>
                            <Form.Select
                                onChange={(e) =>
                                    setReceiverPhone([
                                        e.target.value,
                                        receiverPhone[1],
                                        receiverPhone[2]
                                    ])
                                }
                            >
                                <option value="010">010</option>
                                <option value="010">011</option>
                                <option value="010">016</option>
                            </Form.Select>
                        </Col>
                        <Col md={4}>
                            <Form.Control
                                type="number"
                                onChange={(e) =>
                                    setReceiverPhone([
                                        receiverPhone[0],
                                        e.target.value,
                                        receiverPhone[2]
                                    ])
                                }
                            />
                        </Col>
                        <Col md={5}>
                            <Form.Control
                                type="number"
                                onChange={(e) =>
                                    setReceiverPhone([
                                        receiverPhone[0],
                                        receiverPhone[1],
                                        e.target.value
                                    ])
                                }
                            />
                        </Col>
                    </Row>
                </Form.Group>
                <Form.Group>
                    <Form.Label>배송지</Form.Label>
                    <Button
                        variant="secondary"
                        onClick={() => {
                            window.open(
                                "/external/daum-address",
                                "_blank",
                                "width=500,height=500"
                            );
                        }}
                    >
                        주소 검색
                    </Button>
                    <Row>
                        <Col md={3}>
                            <Form.Control
                                readOnly
                                value={receiverPostCode}
                                id="post-code-elem"
                            />
                        </Col>
                        <Col md={9}>
                            <Form.Control
                                readOnly
                                ref={receiverAddrRef}
                                id="address-elem"
                            />
                        </Col>
                    </Row>
                    <Form.Text>상세주소</Form.Text>
                    <Form.Control ref={receiverDetailAddr} />
                </Form.Group>
                <Form.Group>
                    <Form.Label>배송 요청사항</Form.Label>
                    <Form.Control
                        placeholder="퍼뜩 보내주이소"
                        ref={divyRequestRef}
                    />
                </Form.Group>
                <Form.Group>
                    <Form.Label>배송 희망날짜</Form.Label>
                </Form.Group>
                <ReactDatePicker
                    dateFormat={"yyyy-MM-dd"}
                    selected={divyDate}
                    onChange={(date) => date && setDivyDate(date)}
                />

                <div>
                    <p>구매 품목</p>
                    {cartData.productsInCart.map(({product, quantity}) => (
                        <div>
                            <ProductItem
                                key={`prod-${product.prodNo}`}
                                prodNo={product.prodNo}
                                prodName={product.prodName}
                                prodDetail={product.prodDetail}
                                price={product.price}
                                category={product.category}
                                imageFileName={
                                    product.productImages &&
                                    product.productImages.length > 1
                                        ? product.productImages[0].fileName
                                        : ""
                                }
                            />
                            <p>{quantity}개</p>
                        </div>
                    ))}
                </div>
                <p>결제금액: {cartData.priceSum}원</p>
                <Button
                    variant="primary"
                    onClick={() => {
                        if (validateInputs()) {
                            httpRequest({
                                url: "/api/purchases",
                                callback: (response) => {
                                    if (response.status === 201) {
                                        navigate("/purchases/purchase-result");
                                    } else {
                                        // TODO
                                        alert("구매에 실패했습니다.");
                                    }
                                },
                                baseUrl: `${apiUrl}`,
                                method: HttpMethod.POST,
                                body: {
                                    buyerId: buyer!.userId,
                                    paymentOption,
                                    receiverName:
                                        receiverNameRef.current!.value,
                                    receiverPhone: receiverPhone.join("-"),
                                    divyAddr: `${
                                        receiverAddrRef.current!.value
                                    } ${receiverDetailAddr.current!.value}`,
                                    divyRequest:
                                        divyRequestRef.current &&
                                        divyRequestRef.current.value
                                            ? divyRequestRef.current.value
                                            : "",
                                    divyDate: `${divyDate.getFullYear()}-${
                                        divyDate.getMonth() + 1 >= 10
                                            ? divyDate.getMonth() + 1
                                            : `0${divyDate.getMonth() + 1}`
                                    }-${divyDate.getDate()}`,
                                    tranProds: cartData.productsInCart.map(
                                        (p) => {
                                            return {
                                                prodNo: p.product.prodNo,
                                                quantity: p.quantity
                                            };
                                        }
                                    )
                                }
                            });
                        }
                    }}
                >
                    결제
                </Button>
            </Form>
        </Container>
    );
}

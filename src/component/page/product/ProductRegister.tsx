import {useEffect, useRef, useState} from "react";
import {Button, Col, Container, Form, Row} from "react-bootstrap";
import ReactDatePicker from "react-datepicker";
import {Category} from "../../../domain/product";
import {useAppSelector} from "../../../store/hook";
import httpRequest, {HttpMethod} from "../../../network/httpRequest";
import {CategoryResponseEntity} from "../../../network/apispec/product/productListSpec";
import {useNavigate} from "react-router-dom";
import {ProductRegisterRequestBody} from "../../../network/apispec/product/productRegisterSpec";
import $ from "jquery";

export default function ProductRegister() {
    const [manuDate, setManuDate] = useState(new Date());
    const [categoryList, setCategoryList] = useState<Category[]>([]);

    const [imageDataList, setImageDataList] = useState<
        {imageData: string; fileType: string; imageDesc: string}[]
    >([]);
    const [imageDataCache, setImageDataCache] = useState<
        {imageData: string; fileType: string} | undefined
    >(undefined);
    const [imageDescCache, setImageDescCache] = useState<string | undefined>(
        undefined
    );
    const [imageSelectionModal, setImageSelectionModal] = useState(false);

    const imageSelectionRef = useRef<HTMLImageElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const prodNameRef = useRef<HTMLInputElement>(null);
    const prodDetailRef = useRef<HTMLInputElement>(null);
    const priceRef = useRef<HTMLInputElement>(null);
    const stockRef = useRef<HTMLInputElement>(null);
    const categoryRef = useRef<HTMLSelectElement>(null);

    const navigate = useNavigate();

    const loginUser = useAppSelector((state) => state.loginUser.value);

    useEffect(() => {
        httpRequest({
            url: `/api/categories`,
            callback: (response) => {
                const responseEntity = response.data as CategoryResponseEntity;
                setCategoryList(responseEntity.map((re) => re as Category));
            }
        });
    }, []);

    return (
        <Container>
            <h2>상품등록</h2>
            <Form>
                <Form.Group>
                    <Form.Label>상품명</Form.Label>
                    <Form.Control ref={prodNameRef} />
                </Form.Group>
                <Form.Group>
                    <Form.Label>상품상세정보</Form.Label>
                    <Form.Control ref={prodDetailRef} />
                </Form.Group>
                <Form.Group>
                    <Form.Label>제조일자</Form.Label>
                    <ReactDatePicker
                        dateFormat={"yyyy-MM-dd"}
                        selected={manuDate}
                        onChange={(date) => date && setManuDate(date)}
                    />
                </Form.Group>
                <Form.Group>
                    <Form.Label>가격</Form.Label>
                    <Form.Control type="number" ref={priceRef} />
                </Form.Group>
                <Form.Group>
                    <Form.Label>상품 이미지</Form.Label>
                    <Button
                        variant="secondary"
                        onClick={() => {
                            setImageSelectionModal(true);
                        }}
                    >
                        이미지 추가
                    </Button>
                    {imageSelectionModal ? (
                        <Container>
                            <img
                                ref={imageSelectionRef}
                                alt="product image"
                                style={{width: "324px", height: "324px"}}
                            />
                            <Button
                                variant="secondary"
                                onClick={() => {
                                    fileInputRef.current!.click();
                                }}
                            >
                                이미지 선택
                            </Button>
                            <Form.Control
                                onChange={(e) =>
                                    setImageDescCache(e.target.value)
                                }
                                value={imageDataCache ? imageDescCache : ""}
                            />
                            <Button
                                variant="primary"
                                onClick={() => {
                                    if (imageDataCache) {
                                        setImageDataList([
                                            ...imageDataList,
                                            {
                                                imageData:
                                                    imageDataCache.imageData,
                                                fileType:
                                                    imageDataCache.fileType,
                                                imageDesc: imageDescCache
                                                    ? imageDescCache
                                                    : ""
                                            }
                                        ]);
                                    } else {
                                        alert("선택된 이미지가 없습니다.");
                                    }
                                    setImageDataCache(undefined);
                                    setImageDescCache(undefined);
                                    setImageSelectionModal(false);
                                }}
                            >
                                선택 완료
                            </Button>
                            <input
                                type="file"
                                accept="image/png, image/jpg"
                                ref={fileInputRef}
                                style={{display: "none"}}
                                onChange={(e) => {
                                    console.log("here");
                                    const reader = new FileReader();
                                    reader.onload = () => {
                                        if (imageSelectionRef.current) {
                                            if (reader.result) {
                                                imageSelectionRef.current.src =
                                                    reader.result as string;

                                                setImageDataCache({
                                                    imageData:
                                                        reader.result as string,
                                                    fileType:
                                                        e.target.files![0].type
                                                });
                                            }
                                        }
                                    };
                                    if (
                                        e.target.files &&
                                        e.target.files.length > 0
                                    ) {
                                        reader.readAsDataURL(e.target.files[0]);
                                    }
                                }}
                            />
                        </Container>
                    ) : null}
                    <Row>
                        {imageDataList.map((data, idx) => (
                            <Col md={3} key={`image-${idx}`}>
                                <img
                                    src={`${data.imageData}`}
                                    alt="product"
                                    style={{width: "256px", height: "256px"}}
                                />
                                <p>{data.imageDesc}</p>
                                <Button
                                    variant="danger"
                                    onClick={() => {
                                        imageDataList.splice(idx, 1);
                                        setImageDataList([...imageDataList]);
                                    }}
                                >
                                    삭제
                                </Button>
                            </Col>
                        ))}
                    </Row>
                </Form.Group>
                <Form.Group>
                    <Form.Label>재고</Form.Label>
                    <Form.Control type="number" ref={stockRef} />
                </Form.Group>
                <Form.Group>
                    <Form.Label>카테고리</Form.Label>
                    <Form.Select ref={categoryRef}>
                        <option value="-1">없음</option>
                        {categoryList.map((c) => (
                            <option
                                value={c.categoryNo}
                                key={`category-${c.categoryNo}`}
                            >
                                {c.categoryName}
                            </option>
                        ))}
                    </Form.Select>
                </Form.Group>
                <div>
                    <Button
                        variant="primary"
                        onClick={() => {
                            const prodName = prodNameRef.current!.value;
                            const prodDetail = prodDetailRef.current!.value;
                            const price = parseInt(priceRef.current!.value);
                            const stock = parseInt(stockRef.current!.value);
                            const categoryNo = parseInt(
                                categoryRef.current!.value
                            );
                            if (!prodName) {
                                alert("상품명은 꼭 입력하시오");
                                return;
                            }
                            if (!price) {
                                alert("가격은 꼭 입력하시오");
                                return;
                            }
                            if (!stock) {
                                alert("재고는 꼭 입력하시오");
                            }
                            const body = {
                                seller: loginUser!.userId,
                                prodName,
                                prodDetail,
                                price,
                                manuDate: `${manuDate.getFullYear()}-${
                                    manuDate.getMonth() + 1 < 10
                                        ? `0${manuDate.getMonth() + 1}`
                                        : manuDate.getMonth() + 1
                                }-${manuDate.getDate()}`,
                                stock,
                                productImageDto: imageDataList.map(
                                    (data, idx) => {
                                        return {
                                            fileExtension:
                                                data.fileType.split("/")[1],
                                            base64Data:
                                                data.imageData.substring(
                                                    "data:image/png;base64,"
                                                        .length
                                                ), // TODO
                                            description: data.imageDesc,
                                            thumbnail: idx === 0
                                        };
                                    }
                                )
                            } as ProductRegisterRequestBody;
                            if (categoryNo && categoryNo >= 0) {
                                body.categoryNo = categoryNo;
                            }

                            console.log(body);

                            $("body").attr("disabled", "true");
                            httpRequest({
                                url: "/api/products",
                                callback: (response) => {
                                    if (
                                        Math.round(response.status / 100) === 2
                                    ) {
                                        alert("성공!");
                                        navigate("/"); // TODO
                                    }
                                },
                                method: HttpMethod.POST,
                                body
                            });
                        }}
                    >
                        등록
                    </Button>
                    <Button variant="danger">취소</Button>
                </div>
            </Form>
        </Container>
    );
}

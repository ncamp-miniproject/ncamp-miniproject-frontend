import {Col, Container, Row} from "react-bootstrap";
import {Product} from "../../../../domain/product";
import ProductItem from "./ProductItem";
import {useNavigate} from "react-router-dom";

export function ProductDisplay({products}: {products: Product[]}) {
    const navigate = useNavigate();
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
                        <Col
                            md={4}
                            key={`col-${idx}`}
                            onClick={() => navigate(`/products/${prodNo}`)}
                        >
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

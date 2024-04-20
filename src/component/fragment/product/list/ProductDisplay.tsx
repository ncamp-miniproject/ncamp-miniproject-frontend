import {Col, Container, Row} from "react-bootstrap";
import {Product} from "../../../../domain/product";
import {ProductItem} from "./ProductItemDisplay";

export function ProductDisplay({products}: {products: Product[]}) {
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
                        <Col md={4} key={`col-${idx}`}>
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

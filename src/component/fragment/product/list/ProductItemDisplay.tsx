import {Card} from "react-bootstrap";
import {useAppSelector} from "../../../../store/hook";
import {Category} from "../../../../domain/product";
import {useNavigate} from "react-router-dom";

type ProductItemDisplay = {
    prodNo: number;
    prodName: string;
    prodDetail: string;
    price: number;
    category: Category | null;
    imageFileName: string;
};

export function ProductItem({
    prodNo,
    prodName,
    prodDetail,
    price,
    category,
    imageFileName
}: ProductItemDisplay) {
    const navigate = useNavigate();
    const trimmedProdDetail =
        prodDetail.length > 15 ? prodDetail.substring(0, 15) : "";
    const apiUrl = useAppSelector((state) => state.metadata.apiUrl);
    return (
        <Card onClick={() => navigate(`${prodNo}`)}>
            <Card.Header>{prodNo}</Card.Header>
            <Card.Img
                variant="top"
                src={
                    apiUrl
                        ? `${apiUrl}/images/uploadFiles/${imageFileName}`
                        : ""
                }
            />
            <Card.Body>
                <Card.Title>{prodName}</Card.Title>
                <Card.Text>{price}</Card.Text>
                <Card.Text>
                    {trimmedProdDetail}
                    {prodDetail.length > 15 ? "..." : ""}
                </Card.Text>
                <Card.Text>
                    {category ? category.categoryName : "카테고리 없음"}
                </Card.Text>
            </Card.Body>
        </Card>
    );
}

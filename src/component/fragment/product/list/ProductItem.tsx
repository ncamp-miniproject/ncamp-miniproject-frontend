import {Card} from "react-bootstrap";
import {useAppSelector} from "../../../../store/hook";
import {Category} from "../../../../domain/product";
import {apiServerUrl} from "../../../../common/constants";

type ProductItemData = {
    prodNo: number;
    seller: string;
    prodName: string;
    prodDetail: string;
    price: number;
    category: Category | null;
    imageFileName: string;
};

export default function ProductItem({
    prodNo,
    seller,
    prodName,
    prodDetail,
    price,
    category,
    imageFileName
}: ProductItemData) {
    const trimmedProdDetail =
        prodDetail.length > 15 ? prodDetail.substring(0, 15) : "";
    return (
        <Card>
            <Card.Header>{prodNo}</Card.Header>
            <Card.Img
                variant="top"
                src={imageFileName ? imageFileName : ""}
            />
            <Card.Body>
                <Card.Title>{prodName}</Card.Title>
                <Card.Text>{price}</Card.Text>
                <Card.Text>
                    {trimmedProdDetail}
                    {prodDetail.length > 15 ? "..." : ""}
                </Card.Text>
                <Card.Text>판매자: {seller}</Card.Text>
                <Card.Text>
                    {category ? category.categoryName : "카테고리 없음"}
                </Card.Text>
            </Card.Body>
        </Card>
    );
}

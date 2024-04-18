import {Button, Container} from "react-bootstrap";
import {useNavigate, useParams} from "react-router-dom";

export default function ProductInfo() {
    const {prodNo} = useParams();
    const navigate = useNavigate();
    return (
        <Container>
            Product Info: {prodNo}
            <Button onClick={() => navigate(-1)}>뒤로</Button>
        </Container>
    );
}

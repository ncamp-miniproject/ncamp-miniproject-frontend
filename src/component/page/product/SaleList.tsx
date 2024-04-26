import {useParams, useSearchParams} from "react-router-dom";
import {useAppSelector} from "../../../store/hook";
import {useEffect} from "react";
import {Container} from "react-bootstrap";
import ProductList from "./ProductList";

export default function SaleList() {
    const {seller} = useParams();
    const [queryParameters, setQueryParameters] = useSearchParams();

    const apiUrl = useAppSelector((state) => state.metadata.apiUrl);

    useEffect(() => {
        if (seller) {
            console.log(seller);
            queryParameters.set("seller", seller);
            setQueryParameters(queryParameters);
        }
    }, []);

    useEffect(() => {
        if (apiUrl) {

        }
    }, [apiUrl]);

    return (
        <Container>
            <h2>{seller}</h2>
            <ProductList />
        </Container>
    );
}

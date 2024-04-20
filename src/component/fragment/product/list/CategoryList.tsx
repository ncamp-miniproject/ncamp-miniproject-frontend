import {ListGroup} from "react-bootstrap";
import {Category} from "../../../../domain/product";
import {useSearchParams} from "react-router-dom";

export function CategoryList({categories}: {categories: Category[]}) {
    const [queryParameters, setQueryParameters] = useSearchParams();
    const categoryNo = queryParameters.get("categoryNo")
        ? parseInt(queryParameters.get("categoryNo")!)
        : undefined;

    return (
        <ListGroup>
            <ListGroup.Item
                action
                active={!categoryNo}
                onClick={() => {
                    queryParameters.delete("categoryNo");
                    queryParameters.set("page", "1");
                    setQueryParameters(queryParameters);
                }}
            >
                모든 상품
            </ListGroup.Item>
            {categories &&
                categories.map((category) => (
                    <ListGroup.Item
                        action
                        key={`category-${category.categoryNo}`}
                        onClick={() => {
                            queryParameters.set(
                                "categoryNo",
                                category.categoryNo.toString()
                            );
                            queryParameters.set("page", "1");
                            setQueryParameters(queryParameters);
                        }}
                        active={categoryNo === category.categoryNo}
                    >
                        {category.categoryName}
                    </ListGroup.Item>
                ))}
        </ListGroup>
    );
}

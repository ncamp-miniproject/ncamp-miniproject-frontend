import { ListGroup } from "react-bootstrap";
import { Category } from "../../../../domain/product";

export function CategoryList({
    categories, selectedCategoryNo: categoryNo, setSelectedCategoryNo: setCategoryNo
}: {
    categories: Category[];
    selectedCategoryNo: number | undefined;
    setSelectedCategoryNo: React.Dispatch<
        React.SetStateAction<number | undefined>
    >;
}) {
    return (
        <ListGroup>
            <ListGroup.Item
                action
                active={!categoryNo}
                onClick={() => {
                    setCategoryNo(undefined);
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
                            setCategoryNo(category.categoryNo);
                        }}
                        active={categoryNo === category.categoryNo}
                    >
                        {category.categoryName}
                    </ListGroup.Item>
                ))}
        </ListGroup>
    );
}

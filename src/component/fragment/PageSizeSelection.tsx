import {Dropdown, DropdownButton} from "react-bootstrap";
import {useSearchParams} from "react-router-dom";

const PAGE_SIZE_SET = [3, 6, 9, 12];

export default function PageSizeSelection() {
    const [queryParameters, setQueryParameters] = useSearchParams();
    return (
        <DropdownButton id="pageSize" title="페이지 크기" variant="secondary">
            {PAGE_SIZE_SET.map((pageSize, idx) => (
                <Dropdown.Item
                    key={`page-size-${idx}`}
                    onClick={() => {
                        queryParameters.set("pageSize", pageSize.toString());
                        queryParameters.set("page", "1");
                        setQueryParameters(queryParameters);
                    }}
                >
                    {pageSize}
                </Dropdown.Item>
            ))}
        </DropdownButton>
    );
}

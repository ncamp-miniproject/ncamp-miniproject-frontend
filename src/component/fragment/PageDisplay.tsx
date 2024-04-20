import {Pagination} from "react-bootstrap";
import {PPagination} from "../../domain/pagination";
import {useSearchParams} from "react-router-dom";

export default function PageDisplay({pagination}: {pagination: PPagination}) {
    const [queryParameters, setQueryParameters] = useSearchParams();
    return (
        <Pagination>
            <Pagination.Prev
                disabled={!pagination.previousPageSetAvailable}
                onClick={() => {
                    queryParameters.set(
                        "page",
                        pagination.previousPageSetEntry.toString()
                    );
                    setQueryParameters(queryParameters);
                }}
            />
            {pagination.pagesToDisplay.map((page) => {
                return (
                    <Pagination.Item
                        key={`page-${page}`}
                        active={page === pagination.currentPage}
                        onClick={() => {
                            queryParameters.set("page", page.toString());
                            setQueryParameters(queryParameters);
                        }}
                    >
                        {page}
                    </Pagination.Item>
                );
            })}
            <Pagination.Next
                disabled={!pagination.nextPageSetAvailable}
                onClick={() => {
                    queryParameters.set(
                        "page",
                        pagination.nextPageSetEntry.toString()
                    );
                    setQueryParameters(queryParameters);
                }}
            />
        </Pagination>
    );
}

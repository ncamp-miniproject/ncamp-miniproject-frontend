import {Pagination} from "react-bootstrap";
import {PPagination} from "../../domain/pagination";

export default function PageDisplay({
    pagination,
    setCurrentPage
}: {
    pagination: PPagination;
    setCurrentPage: React.Dispatch<React.SetStateAction<number | undefined>>;
}) {
    return (
        <Pagination>
            <Pagination.Prev
                disabled={!pagination.previousPageSetAvailable}
                onClick={() => setCurrentPage(pagination.previousPageSetEntry)}
            />
            {pagination.pagesToDisplay.map((page) => {
                return (
                    <Pagination.Item
                        key={`page-${page}`}
                        active={page === pagination.currentPage}
                        onClick={() => {
                            setCurrentPage(page);
                        }}
                    >
                        {page}
                    </Pagination.Item>
                );
            })}
            <Pagination.Next
                disabled={!pagination.nextPageSetAvailable}
                onClick={() => setCurrentPage(pagination.nextPageSetEntry)}
            />
        </Pagination>
    );
}

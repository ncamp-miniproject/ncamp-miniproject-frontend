import React from "react";
import {Dropdown, DropdownButton} from "react-bootstrap";

const PAGE_SIZE_SET = [3, 6, 9, 12];

export default function PageSizeSelection({
    setPageSize
}: {
    setPageSize: React.Dispatch<React.SetStateAction<number | undefined>>;
}) {
    return (
        <DropdownButton id="pageSize" title="페이지 크기" variant="secondary">
            {PAGE_SIZE_SET.map((pageSize, idx) => (
                <Dropdown.Item key={`page-size-${idx}`} onClick={() => setPageSize(pageSize)}>
                    {pageSize}
                </Dropdown.Item>
            ))}
        </DropdownButton>
    );
}

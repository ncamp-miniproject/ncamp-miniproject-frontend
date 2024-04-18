import {useEffect, useState} from "react";
import {Col, Container, ListGroup, Row} from "react-bootstrap";
import {
    UserListRequestParam,
    UserListResponseBody
} from "../../../network/apispec/user/userListSpec";
import httpRequest from "../../../network/httpRequest";
import {useAppSelector} from "../../../store/hook";
import {UserResponseBody} from "../../../network/apispec/user/userSpec";
import {useNavigate} from "react-router-dom";
import {ApiRequestOptions} from "../../../domain/ApiRequestOptions";
import {SearchCondition} from "../../../network/apispec/SearchCondition";
import PageDisplay from "../../fragment/PageDisplay";

export default function UserList() {
    const apiUrl = useAppSelector((state) => state.metadata.apiUrl);
    const [responseData, setResponseData] = useState<UserListResponseBody>({
        count: 0,
        list: [],
        paginationInfo: {
            previousPageSetAvailable: false,
            nextPageSetAvailable: false,
            previousPageSetEntry: 0,
            nextPageSetEntry: 0,
            pagesToDisplay: [],
            currentPage: 0,
            pageSize: 3
        }
    });
    const [apiRequestOptions, setApiRequestOptions] =
        useState<ApiRequestOptions>({
            pageSize: 3,
            searchKeyword: ""
        });
    const [currentPage, setCurrentPage] = useState(1);
    const [searchCondition, setSearchCondition] = useState<SearchCondition>(
        SearchCondition.BY_NAME
    );

    const navigate = useNavigate();

    useEffect(() => {
        apiUrl &&
            httpRequest(
                `${apiUrl}/api/users`,
                (response) => {
                    const data = response.data as UserListResponseBody;
                    setResponseData(data);
                },
                {
                    page: currentPage,
                    ...apiRequestOptions,
                    searchCondition
                } as UserListRequestParam
            );
    }, [apiUrl, apiRequestOptions, currentPage]);

    useEffect(() => {
        setCurrentPage(1);
    }, [apiRequestOptions]);

    return (
        <Container>
            <h2>유저 리스트</h2>
            <ListGroup as="ul">
                {responseData.list.map((user) => (
                    <ListGroup.Item
                        as="li"
                        key={`list-${user.userId}`}
                        action
                        onClick={() => navigate(`${user.userId}`)}
                        style={{
                            cursor: "pointer"
                        }}
                    >
                        <UserItem key={`user-${user.userId}`} userData={user} />
                    </ListGroup.Item>
                ))}
            </ListGroup>
            <PageDisplay
                pagination={responseData.paginationInfo}
                setCurrentPage={setCurrentPage}
            />
        </Container>
    );
}

function UserItem({userData}: {userData: UserResponseBody}) {
    return (
        <Container>
            <Row>
                <Col md={4}>
                    <p>아이디</p>
                </Col>
                <Col md={8}>
                    <p>{userData.userId}</p>
                </Col>
            </Row>
            <Row>
                <Col md={4}>
                    <p>이름</p>
                </Col>
                <Col md={8}>
                    <p>{userData.nameOfUser}</p>
                </Col>
            </Row>
            <Row>
                <Col md={4}>
                    <p>이메일</p>
                </Col>
                <Col md={8}>
                    <p>{userData.email}</p>
                </Col>
            </Row>
            <Row>
                <Col md={4}>
                    <p>등록일자</p>
                </Col>
                <Col md={8}>
                    <p>{userData.regDate}</p>
                </Col>
            </Row>
        </Container>
    );
}

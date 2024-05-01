import {useEffect, useState} from "react";
import {Col, Container, ListGroup, Row} from "react-bootstrap";
import {UserListResponseBody} from "../../../network/apispec/user/userListSpec";
import httpRequest from "../../../network/httpRequest";
import {useAppSelector} from "../../../store/hook";
import {UserResponseBody} from "../../../network/apispec/user/userSpec";
import {useNavigate, useSearchParams} from "react-router-dom";
import PageDisplay from "../../fragment/PageDisplay";

export default function UserList() {
    const [queryParameters, setQueryParameters] = useSearchParams();

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

    const navigate = useNavigate();

    useEffect(() => {
        httpRequest({
            url: `/api/users`,
            callback: (response) => {
                const data = response.data as UserListResponseBody;
                setResponseData(data);
            },
            params: queryParameters
        });
    }, [queryParameters]);

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
            <PageDisplay pagination={responseData.paginationInfo} />
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

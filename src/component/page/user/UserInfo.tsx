import {useEffect, useState} from "react";
import {useParams} from "react-router-dom";
import httpRequest from "../../../network/httpRequest";
import {UserResponseBody} from "../../../network/apispec/user/userSpec";
import {Button, Container, Table} from "react-bootstrap";

export default function UserInfo() {
    const [userInfo, setUserInfo] = useState<UserResponseBody>();

    const {userId} = useParams();

    useEffect(() => {
        httpRequest({
            url: `/api/users/${userId}`,
            callback: (response) => {
                const userData = response.data as UserResponseBody;
                setUserInfo(userData);
            }
        });
    }, []);

    return (
        <Container>
            <h2>개인 정보</h2>
            <Table bordered>
                <tbody>
                    <tr>
                        <td>아이디</td>
                        <td>{userInfo?.userId}</td>
                    </tr>
                    <tr>
                        <td>이름</td>
                        <td>{userInfo?.nameOfUser}</td>
                    </tr>
                    <tr>
                        <td>롤</td>
                        <td>{userInfo?.role}</td>
                    </tr>
                    <tr>
                        <td>주민번호</td>
                        <td>{userInfo?.ssn}</td>
                    </tr>
                    <tr>
                        <td>휴대폰</td>
                        <td>{userInfo?.phone}</td>
                    </tr>
                    <tr>
                        <td>주소</td>
                        <td>{userInfo?.addr}</td>
                    </tr>
                    <tr>
                        <td>이메일</td>
                        <td>{userInfo?.email}</td>
                    </tr>
                    <tr>
                        <td>등록일자</td>
                        <td>{userInfo?.regDate}</td>
                    </tr>
                </tbody>
            </Table>
            <Button variant="primary">수정</Button>
        </Container>
    );
}

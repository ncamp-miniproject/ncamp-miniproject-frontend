import {useState} from "react";
import {Button, Col, Container, Form, Row} from "react-bootstrap";

export default function SignUp() {
    const [email, setEmail] = useState("");
    const [id, setId] = useState("");
    const [password, setPassword] = useState("");
    const [passwordCheck, setPasswordCheck] = useState("");
    const [userName, setUserName] = useState("");
    const [ssn, setSsn] = useState("");
    const [phone1, setPhone1] = useState("");
    const [phone2, setPhone2] = useState("");
    const [role, setRole] = useState("");

    function onClickSignUpButton() {
        console.log("email=" + email);
        console.log("id=" + id);
        console.log("password=" + password);
        console.log("passwordCheck=" + passwordCheck);
        console.log("userName=" + userName);
        console.log("ssn=" + ssn);
        console.log("phone1=" + phone1);
        console.log("phone2=" + phone2);
        console.log("role=" + role);
    }

    return (
        <Container>
            <Form.Group
                as={Row}
                className="mb-3"
                controlId="formPlaintextEmail"
            >
                <Form.Label column sm="2">
                    이메일
                </Form.Label>
                <Col sm="8">
                    <Form.Control
                        type="email"
                        placeholder="example@example.com"
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </Col>
                <Col sm="2">
                    <Button variant="outline-secondary">이메일 인증</Button>
                </Col>
            </Form.Group>
            <Form.Group
                as={Row}
                className="mb-3"
                controlId="formPlaintextEmail"
            >
                <Form.Label column sm="2">
                    아이디
                </Form.Label>
                <Col sm="8">
                    <Form.Control
                        type="text"
                        placeholder="example"
                        onChange={(e) => setId(e.target.value)}
                    />
                </Col>
                <Col sm="2">
                    <Button variant="outline-secondary">중복확인</Button>
                </Col>
            </Form.Group>
            <Form.Group
                as={Row}
                className="mb-3"
                controlId="formPlaintextEmail"
            >
                <Form.Label column sm="2">
                    패스워드
                </Form.Label>
                <Col sm="8">
                    <Form.Control
                        type="password"
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </Col>
            </Form.Group>
            <Form.Group
                as={Row}
                className="mb-3"
                controlId="formPlaintextEmail"
            >
                <Form.Label column sm="2">
                    패스워드 확인
                </Form.Label>
                <Col sm="8">
                    <Form.Control
                        type="password"
                        onChange={(e) => setPasswordCheck(e.target.value)}
                    />
                </Col>
            </Form.Group>
            <Form.Group
                as={Row}
                className="mb-3"
                controlId="formPlaintextEmail"
            >
                <Form.Label column sm="2">
                    이름
                </Form.Label>
                <Col sm="8">
                    <Form.Control
                        type="text"
                        onChange={(e) => setUserName(e.target.value)}
                    />
                </Col>
            </Form.Group>
            <Form.Group
                as={Row}
                className="mb-3"
                controlId="formPlaintextEmail"
            >
                <Form.Label column sm="2">
                    주민번호
                </Form.Label>
                <Col sm="8">
                    <Form.Control
                        type="text"
                        onChange={(e) => setSsn(e.target.value)}
                    />
                </Col>
            </Form.Group>
            <Form.Group
                as={Row}
                className="mb-3"
                controlId="formPlaintextEmail"
            >
                <Form.Label column sm="2">
                    휴대전화번호
                </Form.Label>
                <Col sm="2">
                    <Form.Select onChange={(e) => setPhone1(e.target.value)}>
                        <option value="010">010</option>
                        <option value="011">011</option>
                        <option value="016">016</option>
                    </Form.Select>
                </Col>
                <Col sm="6">
                    <Form.Control
                        type="text"
                        onChange={(e) => setPhone2(e.target.value)}
                    />
                </Col>
            </Form.Group>
            <Form.Group
                as={Row}
                className="mb-3"
                controlId="formPlaintextEmail"
            >
                <Form.Label column sm="2">
                    역할
                </Form.Label>
                <Col sm="3">
                    <Form.Select onChange={(e) => setRole(e.target.value)}>
                        <option value="user">유저</option>
                        <option value="seller">판매자</option>
                    </Form.Select>
                </Col>
            </Form.Group>
            <Button
                variant="outline-secondary"
                size="lg"
                style={{paddingLeft: "24px", paddingRight: "24px"}}
                onClick={onClickSignUpButton}
            >
                가입
            </Button>
        </Container>
    );
}

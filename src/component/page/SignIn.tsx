import React, {useRef} from "react";
import {Button, Form} from "react-bootstrap";

function SignIn() {
    const idRef = useRef<HTMLInputElement>(null);
    const pwRef = useRef<HTMLInputElement>(null);

    return (
        <Form
            className="mx-auto"
            style={{minWidth: "240px", maxWidth: "560px"}}
        >
            <Form.Group className="mb-3" controlId="formId">
                <Form.Label>아이디</Form.Label>
                <Form.Control type="text" placeholder="Enter ID" ref={idRef} />
                <Form.Text className="text-muted">
                    비어 있으면 로그인 안 시켜줍니다.
                </Form.Text>
            </Form.Group>
            <Form.Group className="mb-3" controlId="formPassword">
                <Form.Label>패스워드</Form.Label>
                <Form.Control
                    type="password"
                    placeholder="Password"
                    ref={pwRef}
                />
                <Form.Text>여기도 비어 있으면 로그인 안 시켜줍니다.</Form.Text>
            </Form.Group>
            <Button
                variant="primary"
                type="button"
                onClick={() =>
                    doSigningIn(idRef.current?.value, idRef.current?.value)
                }
            >
                로그인
            </Button>
        </Form>
    );
}

function doSigningIn(id: string | undefined, password: string | undefined) {}

export default SignIn;

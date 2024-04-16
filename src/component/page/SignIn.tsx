import {useEffect, useRef} from "react";
import {Button, Form} from "react-bootstrap";
import {SignInRequestBody} from "../../network/user/signInSpec";
import {UserResponseBody} from "../../network/user/userSpec";
import {useAppDispatch} from "../../store/hook";
import {setLoginUser} from "../../store/slice/loginUser";
import {useNavigate} from "react-router-dom";
import $ from "jquery";

function SignIn() {
    const navigate = useNavigate();

    const idRef = useRef<HTMLInputElement>(null);
    const pwRef = useRef<HTMLInputElement>(null);
    const signInButtonRef = useRef<HTMLButtonElement>(null);

    const dispatch = useAppDispatch();

    async function doSigningIn(
        userId: string | undefined,
        password: string | undefined
    ) {
        if (!userId || !password) {
            // TODO: do some business logic when it comes to empty input
            alert("아이디와 패스워드를 입력하시오");
            return;
        }

        const success = await sendSignInRequest({userId, password});

        if (success) {
            const userInfo = await getUserInfoFromServer(userId);
            dispatch(
                setLoginUser({
                    userId: userInfo.userId
                    // TODO: I should decide whether put more information here
                })
            );
            navigate("/");
        }
    }

    useEffect(() => {
        validateAndDisableButton();
    }, []);

    function validateAndDisableButton() {
        const signInButtonJElement = $(signInButtonRef.current!);
        if (!idRef.current?.value || !pwRef.current?.value) {
            signInButtonJElement.attr("disabled", "true");
        } else {
            signInButtonJElement.removeAttr("disabled");
        }
    }

    function onInputChange() {
        validateAndDisableButton();
    }

    return (
        <Form
            className="mx-auto"
            style={{minWidth: "240px", maxWidth: "560px"}}
        >
            <Form.Group className="mb-3" controlId="formId">
                <Form.Label>아이디</Form.Label>
                <Form.Control
                    type="text"
                    placeholder="Enter ID"
                    ref={idRef}
                    onChange={onInputChange}
                />
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
                    onChange={onInputChange}
                />
                <Form.Text>여기도 비어 있으면 로그인 안 시켜줍니다.</Form.Text>
            </Form.Group>
            <Button
                variant="primary"
                type="button"
                onClick={() =>
                    doSigningIn(idRef.current?.value, idRef.current?.value)
                }
                ref={signInButtonRef}
            >
                로그인
            </Button>
        </Form>
    );
}

async function sendSignInRequest(requestData: SignInRequestBody) {
    // TODO: ajax to back-end server for signing in
    const dummyData = true;

    const result = dummyData;
    return result;
}

async function getUserInfoFromServer(userId: string) {
    // TODO: ajax to back-end server for user info

    const dummyData: UserResponseBody = {
        userId: "dummyId",
        userName: "dummyName",
        role: "user",
        email: "dummy@sample.com",
        regDate: "2017-03-24"
    };

    const result = dummyData;
    return result;
}

export default SignIn;

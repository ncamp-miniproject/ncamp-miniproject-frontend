import {useEffect, useRef} from "react";
import {Button, Form} from "react-bootstrap";
import {SignInRequestBody} from "../../network/apispec/user/signInSpec";
import {UserResponseBody} from "../../network/apispec/user/userSpec";
import {useAppDispatch, useAppSelector} from "../../store/hook";
import {setLoginUser} from "../../store/slice/loginUser";
import {useNavigate} from "react-router-dom";
import $ from "jquery";
import axios from "axios";
import {ACCESS_TOKEN, REFRESH_TOKEN} from "../../common/constants";
import {Role} from "../../domain/user";

function SignIn() {
    const navigate = useNavigate();

    const idRef = useRef<HTMLInputElement>(null);
    const pwRef = useRef<HTMLInputElement>(null);
    const signInButtonRef = useRef<HTMLButtonElement>(null);

    const dispatch = useAppDispatch();

    const apiUrl = useAppSelector((state) => state.metadata.apiUrl);

    async function doSigningIn(
        userId: string | undefined,
        password: string | undefined
    ) {
        if (!userId || !password) {
            // TODO: do some business logic when it comes to empty input
            alert("아이디와 패스워드를 입력하시오");
            return;
        }

        if (apiUrl) {
            axios
                .post(`${apiUrl}/api/auth`, {userId, password})
                .then((response) => {
                    const data = response.data as {
                        accessToken: string;
                        refreshToken: string;
                        userId: string;
                        role: Role;
                    };
                    localStorage.setItem(ACCESS_TOKEN, data.accessToken);
                    localStorage.setItem(REFRESH_TOKEN, data.refreshToken);
                    dispatch(
                        setLoginUser({
                            userId: data.userId,
                            role: data.role
                        })
                    );
                    navigate("/");
                })
                .catch((error) => {
                    console.error(error);
                    alert("로그인 실패");
                    navigate("/");
                });
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
                    doSigningIn(idRef.current?.value, pwRef.current?.value)
                }
                ref={signInButtonRef}
            >
                로그인
            </Button>
        </Form>
    );
}

export default SignIn;

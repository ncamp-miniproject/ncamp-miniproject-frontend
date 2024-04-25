import {Button, Container, Nav, Navbar} from "react-bootstrap";
import {useAppSelector} from "../../store/hook";
import {Role} from "../../domain/user";
import {useNavigate} from "react-router-dom";

const displayMode = new Map<Role, JSX.Element>();

displayMode.set(Role.USER, <NavbarMenuForUser />);
displayMode.set(Role.SELLER, <NavbarMenuForSeller />);
displayMode.set(Role.ADMIN, <NavbarMenuForAdmin />);

function NavHeader() {
    const loginUser = useAppSelector((state) => state.loginUser.value);

    const roleSpecificComponent =
        loginUser && loginUser.role ? displayMode.get(loginUser.role) : null;

    return (
        <Navbar expand="lg" className="bg-body-tertiary">
            <Container>
                <Navbar.Brand href="/">Model 2 MVC Shop</Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="me-auto">
                        <NavbarMenuForCommon />
                        {loginUser && <NavbarMenuForCommonLoginUser />}
                        {roleSpecificComponent}
                    </Nav>
                    {loginUser ? (
                        <NavbarAccountMenuForLoginUser />
                    ) : (
                        <NavbarAccountMenuForNonLoginUser />
                    )}
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
}

function NavbarMenuForCommon() {
    return (
        <>
            <Nav.Link href="/products">상품검색</Nav.Link>
        </>
    );
}

function NavbarMenuForCommonLoginUser() {
    const loginUser = useAppSelector((state) => state.loginUser).value;
    return (
        <>
            <Nav.Link href={`/users/${loginUser?.userId}`}>
                개인정보조회
            </Nav.Link>
        </>
    );
}

function NavbarMenuForAdmin() {
    return (
        <>
            <Nav.Link href="/users">회원정보조회</Nav.Link>
            <Nav.Link href="/purchases">판매조회</Nav.Link>
        </>
    );
}

function NavbarMenuForUser() {
    return (
        <>
            <Nav.Link href="/purchases">구매이력조회</Nav.Link>
            <Nav.Link href="/cart">장바구니</Nav.Link>
        </>
    );
}

function NavbarMenuForSeller() {
    return (
        <>
            <Nav.Link href="/products/register/form">판매상품등록</Nav.Link>
            <Nav.Link href="#">판매상품관리</Nav.Link>
        </>
    );
}

function NavbarAccountMenuForLoginUser() {
    return (
        <Nav className="ml-auto">
            <Button variant="outline-danger">로그아웃</Button>
        </Nav>
    );
}

function NavbarAccountMenuForNonLoginUser() {
    const navigate = useNavigate();
    return (
        <Nav className="ml-auto" style={{gap: "12px"}}>
            <Button
                variant="outline-success"
                onClick={() => navigate("/sign-up")}
            >
                회원가입
            </Button>
            <Button
                variant="outline-primary"
                onClick={() => navigate("/sign-in")}
            >
                로그인
            </Button>
        </Nav>
    );
}

export default NavHeader;

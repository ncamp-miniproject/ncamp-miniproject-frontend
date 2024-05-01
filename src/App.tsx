import {Route, Routes} from "react-router-dom";
import "./App.css";
import NavHeader from "./component/fragment/NavHeader";
import "bootstrap/dist/css/bootstrap.min.css";
import Home from "./component/page/Home";
import NotFound from "./component/page/NotFound";
import SignIn from "./component/page/SignIn";
import {useEffect} from "react";
import axios from "axios";
import SignUp from "./component/page/SignUp";
import {useAppDispatch, useAppSelector} from "./store/hook";
import ProductList from "./component/page/product/ProductList";
import {setLoginUser} from "./store/slice/loginUser";
import {Role} from "./domain/user";
import UserList from "./component/page/user/UserList";
import UserInfo from "./component/page/user/UserInfo";
import ProductInfo from "./component/page/product/ProductInfo";
import PurchaseList from "./component/page/purchase/PurchaseList";
import PurchaseInfo from "./component/page/purchase/PurchaseInfo";
import CartList from "./component/page/cart/CartList";
import PurchaseForm from "./component/page/purchase/PurchaseForm";
import DaumAddressWindow from "./component/fragment/DaumAddressWindow";
import AlertPurchaseResult from "./component/page/purchase/AlertPurchaseResult";
import ProductRegister from "./component/page/product/ProductRegister";
import SaleList from "./component/page/product/SaleList";
import {ACCESS_TOKEN, REFRESH_TOKEN} from "./common/constants";
import httpRequest from "./network/httpRequest";

function App() {
    const dispatch = useAppDispatch();

    useEffect(() => {
        console.log("App.tsx");
        console.log(localStorage.getItem(ACCESS_TOKEN));
        console.log(localStorage.getItem(REFRESH_TOKEN));

        // TODO: authenticate by sending request to the back-end server
        const accessToken = localStorage.getItem(ACCESS_TOKEN);
        httpRequest({
            url: "/api/users/self/token",
            callback: (response) => {
                const data = response.data as {
                    userId: string;
                    role: Role;
                };
                dispatch(
                    setLoginUser({
                        userId: data.userId,
                        role: data.role
                    })
                );
            },
            params: {
                token: accessToken ? accessToken : ""
            },
            errorCallback: (error) => {
                console.error(error);
                dispatch(setLoginUser(null));
            }
        });
    }, []);

    return (
        <>
            <NavHeader />
            <main style={{padding: "24px 36px"}}>
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/sign-in" element={<SignIn />} />
                    <Route path="/sign-up" element={<SignUp />} />
                    <Route
                        path="/products/register/form"
                        element={<ProductRegister />}
                    />
                    <Route path="/products/:prodNo" element={<ProductInfo />} />
                    <Route path="/products" element={<ProductList />} />
                    <Route path="/sale/:seller" element={<SaleList />} />
                    <Route path="/users/:userId" element={<UserInfo />} />
                    <Route path="/users" element={<UserList />} />
                    <Route
                        path="/purchases/purchase-form"
                        element={<PurchaseForm />}
                    />
                    <Route path="/purchases" element={<PurchaseList />} />
                    <Route
                        path="/purchases/:tranNo"
                        element={<PurchaseInfo />}
                    />
                    <Route
                        path="/purchases/purchase-result/alert"
                        element={<AlertPurchaseResult />}
                    />
                    <Route
                        path="/external/daum-address"
                        element={<DaumAddressWindow />}
                    />

                    <Route path="/cart" element={<CartList />} />
                    <Route path="*" element={<NotFound />} />
                </Routes>
            </main>
        </>
    );
}

export default App;

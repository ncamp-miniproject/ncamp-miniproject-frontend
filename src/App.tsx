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
import {Metadata, setMetadata} from "./store/slice/metadata";
import {useAppDispatch} from "./store/hook";
import ProductList from "./component/page/product/ProductList";
import {setLoginUser} from "./store/slice/loginUser";
import {Role} from "./domain/user";
import UserList from "./component/page/user/UserList";
import UserInfo from "./component/page/user/UserInfo";

function App() {
    const dispatch = useAppDispatch();

    useEffect(() => {
        console.log("App.tsx");

        dispatch(setLoginUser({userId: "user08", role: Role.ADMIN}));

        axios.get("/metadata.json").then((response) => {
            const metadata = response.data as Metadata;
            dispatch(setMetadata(metadata));
        });

        // TODO: authenticate by sending request to the back-end server
    }, []);

    return (
        <>
            <NavHeader />
            <main style={{padding: "24px 36px"}}>
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/sign-in" element={<SignIn />} />
                    <Route path="/sign-up" element={<SignUp />} />
                    <Route path="/products" element={<ProductList />} />
                    <Route path="/users/:userId" element={<UserInfo />} />
                    <Route path="/users" element={<UserList />} />
                    <Route path="*" element={<NotFound />} />
                </Routes>
            </main>
        </>
    );
}

export default App;

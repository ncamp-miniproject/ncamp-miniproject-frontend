import {Route, Routes} from "react-router-dom";
import "./App.css";
import NavHeader from "./component/fragment/NavHeader";
import "bootstrap/dist/css/bootstrap.min.css";
import Home from "./component/page/Home";
import NotFound from "./component/page/NotFound";
import SignIn from "./component/page/SignIn";
import {useEffect} from "react";
import axios from "axios";

function App() {
    useEffect(() => {
        // TODO: authenticate by sending request to the back-end server
    }, []);

    return (
        <>
            <NavHeader />
            <main style={{padding: "24px 36px"}}>
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/sign-in" element={<SignIn />} />
                    <Route path="*" element={<NotFound />} />
                </Routes>
            </main>
        </>
    );
}

export default App;

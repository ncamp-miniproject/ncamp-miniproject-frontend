import {Route, Routes} from "react-router-dom";
import "./App.css";
import NavHeader from "./component/fragment/NavHeader";
import "bootstrap/dist/css/bootstrap.min.css";
import Home from "./component/page/Home";
import NotFound from "./component/page/NotFound";

function App() {
    return (
        <>
            <NavHeader />
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="*" element={<NotFound />} />
            </Routes>
        </>
    );
}

export default App;

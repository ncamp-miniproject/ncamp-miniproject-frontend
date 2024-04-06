import { Route, Routes } from "react-router-dom";
import "./App.css";
import NavHeader from "./component/fragment/NavHeader";
import "bootstrap/dist/css/bootstrap.min.css";
import Home from "./component/page/Home";

function App() {

    return (
        <>
            <NavHeader/>
            <Routes>
                <Route path="/" element={<Home/>}/>
            </Routes>
        </>
    );
}

export default App;

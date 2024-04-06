import "../../css/NotFound.css";

function NotFound() {
    return (
        <div className="content-container">
            <header className="page-header">
                <h1>404 Not Found</h1>
            </header>
            <p>경로에 해당하는 리소스가 없습니다.</p>
        </div>
    );
}

export default NotFound;

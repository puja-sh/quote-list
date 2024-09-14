import './App.css';
import { AuthProvider } from "./context/AuthContext";
import { Route, BrowserRouter, Routes, useLocation } from "react-router-dom";
import { PrivateRoute } from "./utils/PrivateRoute";
import Home from "./component/feed/Home";
import Login from "./component/login/Login";
import Create from "./component/create/Create";
import Navbar from "./component/navbar/Navbar";

function App() {
    return (
        <div className='App'>
            <AuthProvider>
                <BrowserRouter>
                    <Layout />
                    <Routes>
                        <Route path="/" element={ <Home/> }/>
                        <Route path="/home" element={ <Home/> }/>
                        <Route path="/login" element={ <Login/> }/>
                        <Route path="/create" element={ <PrivateRoute element={ <Create/> }/> }/>
                    </Routes>
                </BrowserRouter>
            </AuthProvider>
        </div>

    );
}

const Layout = () => {
    const location = useLocation();

    if (location.pathname === '/login') {
        return null;
    }

    return <Navbar />;
};

export default App;

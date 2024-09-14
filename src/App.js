import './App.css';
import { AuthProvider } from "./context/AuthContext";
import { Route, BrowserRouter, Routes } from "react-router-dom";
import { PrivateRoute } from "./utils/PrivateRoute";
import Home from "./component/feed/Home";
import Login from "./component/login/Login";
import Create from "./component/create/Create";

function App() {
    return (
        <div className='App'>
            <AuthProvider>
                <BrowserRouter>
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

export default App;

import { Navigate, Route } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export const PrivateRoute = ({ element: Element }) => {
    const { isAuthenticated } = useAuth();

    return isAuthenticated ? (
        Element
    ) : (
        <Navigate to="/login"/>
    )
};

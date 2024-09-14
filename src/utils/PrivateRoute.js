import { Navigate, Route } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export const PrivateRoute = ({ component: Component, ...rest }) => {
    const { isAuthenticated } = useAuth();

    return (
        <Route
            {...rest}
            render={props =>
                isAuthenticated ? (
                    <Component {...props} />
                ) : (
                    <Navigate to="/login" />
                )
            }
        />
    );
};

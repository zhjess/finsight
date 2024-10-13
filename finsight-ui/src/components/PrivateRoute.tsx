import { useAuth } from "@/components/AuthProvider";
import React from "react";
import { Navigate, Outlet } from "react-router-dom";

const PrivateRoute = () => {
    const user = useAuth();
    if (!user || !user.token) {
        return <Navigate to="/login" />;
    }
    return <Outlet />;
};

export default PrivateRoute;
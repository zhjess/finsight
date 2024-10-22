import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const RedirectToLogin: React.FC = () => {
    const navigate = useNavigate();

    useEffect(() => {
        navigate("/login")
    });
    return (
        null
    );
};

export default RedirectToLogin;
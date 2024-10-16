import { Box } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

interface NavBarRenderProps {
    children: React.ReactNode;
}

const NavBarRender: React.FC<NavBarRenderProps> = ({ children }) => {
    const location = useLocation();
    const [isLoginPage, setIsLoginPage] = useState(false);

    useEffect(() => {
        location.pathname === "/login" 
        ? setIsLoginPage(true)
        : setIsLoginPage(false)}
    , [location]);

    return (
        <Box>{!isLoginPage && children}</Box>
  )
}

export default NavBarRender;
import DashBox from "@/components/DashBox";
import { Link, Typography, useTheme } from "@mui/material";
import React from "react";

const LoginExpired = () => {
    const { palette } = useTheme();
    return (
        <>
            <Typography color={palette.grey[100]}>Login expired, please sign in again <Link href="/login">here</Link></Typography>
            
        </>
    )
}

export default LoginExpired;
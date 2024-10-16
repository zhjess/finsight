import { useState } from 'react';
import { Link, useLocation } from "react-router-dom";
import TroubleshootIcon from '@mui/icons-material/Troubleshoot';
import { Box, Button, Typography, useTheme } from '@mui/material';
import FlexBetween from './FlexBetween';
import { useAuth } from './AuthProvider';

const NavBar = () => {
    const { palette } = useTheme();
    const location = useLocation();
    
    const [selected, setSelected] = useState(location.pathname.slice(1));
    const auth = useAuth();

    const handleLogout = () => {
        auth?.logoutAction();
    };

    return (
        <FlexBetween mb="0.25rem" p="0.5rem 0rem" color={palette.grey[300]}>
            <FlexBetween gap="0.75rem">
                <TroubleshootIcon sx={ {fontSize: "28px"} }/>
                <Typography variant="h4" fontSize="16px">
                    finsight
                </Typography>
            </FlexBetween>
            <FlexBetween gap="2rem">
                <Box sx={{ "&:hover": {color: palette.primary[100]} }}>
                    <Link 
                        to="/dashboard"
                        onClick={() => setSelected("dashboard")}
                        style={{
                            textDecoration: "inherit",
                            color: selected === "dashboard" ? "inherit" : palette.grey[700],
                        }}
                    >
                            dashboard
                    </Link>
                </Box>
                <Box sx={{ "&:hover": {color: palette.primary[100]} }}>
                    <Link 
                        to="/predictions"
                        onClick={() => setSelected("predictions")}
                        style={{
                            textDecoration: "inherit",
                            color: selected === "predictions" ? "inherit" : palette.grey[700]
                        }}
                    >
                        predictions
                    </Link>
                </Box>
                <Box sx={{ "&:hover": {color: palette.primary[100]} }}>
                    <Link 
                        to="/manage"
                        onClick={() => setSelected("manage")}
                        style={{
                            textDecoration: "inherit",
                            color: selected === "manage" ? "inherit" : palette.grey[700]
                        }}
                    >
                        manage data
                    </Link>
                </Box>
                <Box sx={{ "&:hover": {color: palette.primary[100]} }}>  
                    <Button 
                        onClick={() => handleLogout()}
                        style={{
                            textDecoration: "inherit",
                            color: selected === "logout" ? "inherit" : palette.grey[700]
                        }}
                    >
                        log out
                    </Button>
                </Box>
            </FlexBetween>
        </FlexBetween>
    )
};

export default NavBar;
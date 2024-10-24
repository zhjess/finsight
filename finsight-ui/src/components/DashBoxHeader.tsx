import React from "react"
import FlexBetween from "./FlexBetween"
import { Box, Typography, useTheme } from "@mui/material"

type DashBoxHeaderProps = {
    icon?: React.ReactNode;
    title: string;
    subtitle?: string;
    sideText?: string;
}

const DashBoxHeader: React.FC<DashBoxHeaderProps> = ({ icon, title, subtitle, sideText }) => {
    const { palette } = useTheme();
    return (
        <FlexBetween
            color={palette.grey[400]}
            margin="1.5rem 1rem 0rem 1rem"
        >
            <FlexBetween>
                {icon}
                <Box width="100%">
                    <Typography variant="h4" mb="-0.1rem">
                        {title}
                    </Typography>
                    <Typography variant="h6">
                        {subtitle}
                    </Typography>
                </Box>
            </FlexBetween>
            <Typography variant="h5" fontWeight="bold" color={palette.secondary[400]}>
                {sideText}
            </Typography>
        </FlexBetween>
    );
};

export default DashBoxHeader
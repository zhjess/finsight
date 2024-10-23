import { Box } from "@mui/material";
import React from "react";

interface ProgressBarChartProps {
    width: string;
    bgColorPrimary: string;
    bgColorSecondary: string;
}

const ProgressBarChart: React.FC<ProgressBarChartProps> = ({ width, bgColorPrimary, bgColorSecondary }) => {
    return (
        <Box>
            <Box
                height="15px"
                margin="1.25rem 1rem 0.4rem 1rem"
                bgcolor={bgColorPrimary}
                borderRadius="1rem"
            >
                <Box
                    height="15px"
                    bgcolor={bgColorSecondary}
                    borderRadius="1rem"
                    width={width}
                />
            </Box>
        </Box>
    );
};

export default ProgressBarChart;
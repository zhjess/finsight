import { Box, Typography } from "@mui/material";
import React from "react";

interface LegendProps {
    items: { name: string, color: string}[];
}

const Legend: React.FC<LegendProps> = ({ items }) => {
    return (
        <Box display="flex" alignItems="center" justifyContent="center" paddingTop="0.2rem">
            {items.map((item) => (
                <Box key={item.name} display="flex" alignItems="center" marginRight="1rem">
                    <Box
                        bgcolor={item.color}
                        width={10}
                        height={10}
                        borderRadius="2px"
                        mr={1}
                    />
                    <Typography variant="h5" fontSize="smaller">{item.name}</Typography>
                </Box>
            ))}
        </Box>
    );
};

export default Legend;
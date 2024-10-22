import { Button, Typography, useTheme } from "@mui/material";
import React from "react";

interface PageNumberNavProps {
    currentPage: number;
    totalPages: number;
    handlePreviousPage: () => void;
    handleNextPage: () => void;
}

const PageNumberNav: React.FC<PageNumberNavProps> = ({ currentPage, totalPages, handlePreviousPage, handleNextPage }) => {
    const { palette } = useTheme();

    return (
        <>
            <Button
            variant="contained"
            size="small"
            onClick={handlePreviousPage}
            disabled={currentPage === 1}
            sx={{ backgroundColor: palette.primary[700], color: palette.primary[100] }}
        >
            Prev
        </Button>
            <Typography color={palette.grey[100]} margin="0 2rem"> Page {currentPage} of {totalPages} </Typography>
        <Button
            variant="contained"
            size="small"
            onClick={handleNextPage}
            disabled={currentPage === totalPages}
            sx={{ backgroundColor: palette.primary[700], color: palette.primary[100] }}
        >
            NEXT
        </Button>
        </>
    );
};

export default PageNumberNav;
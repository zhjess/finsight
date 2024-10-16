import { Button, useTheme } from "@mui/material";
import React from "react";

interface AddButtonProps {
 handler: () => void;
}

const AddButton: React.FC<AddButtonProps> = ({ handler }) => {
    const { palette } = useTheme();

    return (
        <Button
            onClick={handler}
            sx={{
                color: palette.grey[100],
                backgroundColor: palette.grey[700],
                boxShadow: "0.1rem 0.1rem 0.1rem 0.1rem rgba(0,0,0,.4)",
                margin: "1.5rem 1rem 0 0",
                padding: "0",
                "&:hover": { backgroundColor: palette.primary[800] }
            }}
        >
            +
        </Button>
    );
};

export default AddButton;
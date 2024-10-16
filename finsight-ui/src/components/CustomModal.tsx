import React, { useEffect, useRef } from "react";
import { Dialog, DialogActions, DialogContent, DialogTitle, Button, Box, useTheme } from "@mui/material";

interface CustomModalProps {
    open: boolean;
    title: string;
    content: React.ReactNode;
    onSave: () => void;
    onClose: () => void;
    onDelete?: () => void;
}

const CustomModal: React.FC<CustomModalProps> = ({ open, title, content, onSave, onClose, onDelete }) => {
    const { palette } = useTheme();
    const dialogRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (open && dialogRef.current) {
            dialogRef.current.setAttribute("inert", "");
        } else if (dialogRef.current) {
            dialogRef.current.removeAttribute("inert");
        }
    }, [open]);

    return (
        <Dialog open={open} onClose={onClose} fullWidth={true} maxWidth="sm" ref={dialogRef} aria-labelledby="modal-title" aria-modal="true">
            <DialogTitle id="modal-title">{title}</DialogTitle>
            <DialogContent>{content}</DialogContent>
            <DialogActions>
                <Box margin="0 0 1rem 2rem">
                    {onDelete && (
                        <Button
                            onClick={onDelete}
                            variant="outlined"
                            sx={{
                                color: "#ce3c3c",
                                borderColor: "#ce3c3c",
                                "&:hover": { backgroundColor: "#ce3c3c", color: "white" }
                            }}
                        >
                            <b>Delete Product</b>
                        </Button>
                    )}
                </Box>
                <Box sx={{ flexGrow: 1 }} />
                <Box margin="0 2rem 1rem 0">
                    <Button
                        onClick={onClose}
                        variant="outlined"
                        sx={{
                            color: palette.primary[600],
                            borderColor: palette.primary[600],
                            width: "5rem"
                        }}
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={onSave}
                        variant="contained"
                        disableElevation
                        sx={{
                            color: "white",
                            borderColor: palette.primary[600],
                            marginLeft: "1rem",
                            width: "5rem",
                            "&:hover": { backgroundColor: palette.primary[600], color: "white" }
                        }}
                    >
                        <b>Save</b>
                    </Button>
                </Box>
            </DialogActions>
        </Dialog>
    );
};

export default CustomModal;

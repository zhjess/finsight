
import { Box } from "@mui/material";
import { styled } from "@mui/system";

const DashBox = styled(Box)(({ theme }) => ({
    backgroundColor: theme.palette.background.light,
    borderRadius: "0.5rem",
    boxShadow: "0.15rem 0.2rem 0.15rem 0.1rem rgba(0, 0 , 0, 0.8)",
    overflow: "hidden"
}));

export default DashBox;
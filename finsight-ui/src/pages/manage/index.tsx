import { Box, useMediaQuery } from "@mui/material";
import Transactions from "./RevenueTransactions";
import Expenses from "./ExpenseTransactions";
import Products from "./Products";

// const gridTemplateLargeScreens = `
//     "a b c"
// `;

// const gridTemplateSmallScreens = `
//     "a"
//     "b"
//     "c"
// `;

const Manage = () => {
    const isAboveMediumScreens = useMediaQuery("(min-width: 1200px)");
    return (
        // <Box width="100%" height="90vh" display="grid" gap="1.5rem"
        //     sx={
        //         isAboveMediumScreens ? {
        //             gridTemplateColumns: "repeat(3, minmax(370px, 1fr))",
        //             gridTemplateRows: "repeat(10, minmax(60px, 1fr))",
        //             gridTemplateAreas: gridTemplateLargeScreens,
        //         } : {
        //             gridAutoColumns: "1fr",
        //             gridAutoRows: "80px",
        //             gridTemplateAreas: gridTemplateSmallScreens,
        //         }
        //     }
        // >
        <Box display="flex" gap="1.5rem" width="100%"
            sx={
                isAboveMediumScreens ? {
                    justifyContent: "space-between",
                    flexDirection:"row"
                } : {
                    justifyContent: "space-between",
                    flexDirection:"column"
                }
            }
        >
            <Box flex="1"><Transactions /></Box>
            <Box flex="1"><Expenses /></Box>
            <Box flex="1"><Products /></Box>
        </Box>
    );
};

export default Manage;
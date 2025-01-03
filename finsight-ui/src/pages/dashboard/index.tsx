import { Box, useMediaQuery } from "@mui/material";
import Row1 from "./Row1";
import Row2 from "./Row2";
import Row3 from "./Row3";

const gridTemplateLargeScreens = `
    "a b c"
    "a b c"
    "a b c"
    "a b f"
    "d e f"
    "d e f"
    "d h i"
    "g h i"
    "g h j"
    "g h j"
`;

const gridTemplateSmallScreens = `
    "a"
    "a"
    "a"
    "a"
    "b"
    "b"
    "b"
    "c"
    "c"
    "c"
    "d"
    "d"
    "d"
    "e"
    "e"
    "f"
    "f"
    "f"
    "g"
    "g"
    "g"
    "h"
    "h"
    "h"
    "h"
    "i"
    "i"
    "j"
    "j"
`;

const kpiYear = "2023";

const Dashboard = () => {
    const isAboveMediumScreens = useMediaQuery("(min-width: 1200px)");
    return (
        <Box width="100%" height="90vh" display="grid" gap="1.5rem"
            sx={
                isAboveMediumScreens ? {
                    gridTemplateColumns: "repeat(3, minmax(370px, 1fr))",
                    gridTemplateRows: "repeat(10, minmax(60px, 1fr))",
                    gridTemplateAreas: gridTemplateLargeScreens,
                } : {
                    gridAutoColumns: "1fr",
                    gridAutoRows: "100px",
                    gridTemplateAreas: gridTemplateSmallScreens,
                }
            }
        >
            <Row1 kpiYear={kpiYear} />
            <Row2 kpiYear={kpiYear} />
            <Row3 kpiYear={kpiYear} />
        </Box>
    );
};

export default Dashboard;
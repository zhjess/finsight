import DashBox from "@/components/DashBox";
import DashBoxHeader from "@/components/DashBoxHeader";
import FlexBetween from "@/components/FlexBetween";
import { Box, Button } from "@mui/material";
import React from "react";

const Expenses = () => {
    return (
        <DashBox>
            <FlexBetween>
                <DashBoxHeader title="Expenses" sideText=""/>
                <Button sx={{"margin": "1.5rem 0.5rem 0 0"}}>Edit</Button>
            </FlexBetween>
            
        </DashBox>
    )
};

export default Expenses;
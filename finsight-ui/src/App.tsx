import { createTheme } from "@mui/material/styles";
import { Box, CssBaseline, ThemeProvider } from "@mui/material";
import { useMemo } from "react";
import { themeSettings } from "./theme";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import NavBar from "@/components/NavBar";
import Dashboard from "@/pages/dashboard";

function App() {

  const theme = useMemo(() => createTheme(themeSettings), [])

    return (
    	<>
			<BrowserRouter>
				<ThemeProvider theme={theme}>
					<CssBaseline />
					<Box width="100%" padding="1rem 2rem 4rem 2rem">
						<NavBar />
						<Routes>
							<Route path="/" element={<Dashboard />}/>
							<Route path="/predictions" element={<div>hi</div>}/>
						</Routes>
					</Box>
				</ThemeProvider>
			</BrowserRouter>
    	</>
    );
}

export default App;

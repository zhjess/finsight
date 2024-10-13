import { createTheme } from "@mui/material/styles";
import { Box, CssBaseline, ThemeProvider } from "@mui/material";
import { useMemo } from "react";
import { themeSettings } from "./theme";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import NavBar from "@/components/NavBar";
import Dashboard from "@/pages/dashboard";
import Predictions from "@/pages/predictions";
import Login from "./pages/login";
import AuthProvider from "./components/AuthProvider";
import PrivateRoute from "./components/PrivateRoute";

const API = "http://localhost:3000"

function App() {

  	const theme = useMemo(() => createTheme(themeSettings), [])

    return (
    	<>
			<BrowserRouter>
				<AuthProvider>
					<ThemeProvider theme={theme}>
						<CssBaseline />
						<Box width="100%" padding="1rem 2rem 4rem 2rem">
							<NavBar />
							<Routes>
								<Route path="/login" element={<Login />} />
								<Route path="/" element={<PrivateRoute />} >
									<Route path="dashboard" element={<Dashboard />}/>
									<Route path="predictions" element={<Predictions />}/>
								</Route>
								<Route path="*" element={<h3 style={{ color: "white" }}>Page not found!</h3>} />
							</Routes>
						</Box>
					</ThemeProvider>
				</AuthProvider>	
			</BrowserRouter>
    	</>
    );
}

export default App;

import DashBox from "@/components/DashBox";
import { useAuth } from "@/components/AuthProvider";
import { Box, Button, Card, FormControl, FormLabel, TextField, Typography, useTheme } from "@mui/material";
import React from "react";

const Login = () => {
    const { palette } = useTheme();

    const [emailError, setEmailError] = React.useState(false);
    const [emailErrorMessage, setEmailErrorMessage] = React.useState("");
    const [passwordError, setPasswordError] = React.useState(false);
    const [passwordErrorMessage, setPasswordErrorMessage] = React.useState("");
    
    const auth = useAuth();

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (emailError || passwordError) {
            return;
        };
        
        const data = new FormData(event.currentTarget);
        const credentials = {
            email: data.get("email") as string,
            password: data.get("password") as string,
        };

        console.log("🚀 ~ handleSubmit ~ credentials:", credentials);

        try {
            await auth?.loginAction(credentials);
        } catch (err) {
            console.error(err);
        }
    };

    const validateInputs = () => {
        const email = document.getElementById("email") as HTMLInputElement;
        const password = document.getElementById("password") as HTMLInputElement;

        let isValid = true;

        if (!email.value || !/\S+@\S+\.\S+/.test(email.value)) {
            setEmailError(true);
            setEmailErrorMessage("Please enter a valid email address.");
            isValid = false;
        } else {
            setEmailError(false);
            setEmailErrorMessage("");
        }

        if (!password.value) {
            setPasswordError(true);
            setPasswordErrorMessage("Please enter a valid password.");
            isValid = false;
        } else {
            setPasswordError(false);
            setPasswordErrorMessage("");
        }

        return isValid;
    };

    return (
        <DashBox maxWidth="500px" height="60vh" p="3rem" margin="auto">
            <Box width="100%" mb="1.5rem">
                <Typography variant="h3">Sign in</Typography>
            </Box>
            <Box
                sx={{
                    "& .MuiInputBase-input": {
                        color: "white",
                        background: palette.grey[800]
                    }
                }}
            >
                <Card sx={{ backgroundColor: "inherit" }}>
                    <Box
                        component="form"
                        onSubmit={handleSubmit}
                        noValidate
                        sx={{
                            display: "flex",
                            flexDirection: "column",
                            width: "100%",
                            gap: 2,
                        }}
                    >
                        <FormControl>
                            <FormLabel htmlFor="email" sx={{ color: palette.grey[300] }}>Email</FormLabel>
                            <TextField
                                error={emailError}
                                helperText={emailErrorMessage}
                                id="email"
                                type="email"
                                name="email"
                                placeholder="your@email.com"
                                autoComplete="email"
                                autoFocus
                                required
                                fullWidth
                                variant="outlined"
                                color={emailError ? "error" : "primary"}
                                sx={{ ariaLabel: "email", backgroundColor: "inherit" }}
                            />
                        </FormControl>
                        <FormControl>
                            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                                <FormLabel htmlFor="password" sx={{ color: palette.grey[300] }}>Password</FormLabel>
                            </Box>
                            <TextField
                                error={passwordError}
                                helperText={passwordErrorMessage}
                                name="password"
                                placeholder="••••••"
                                type="password"
                                id="password"
                                autoComplete="current-password"
                                autoFocus
                                required
                                fullWidth
                                variant="outlined"
                                color={passwordError ? "error" : "primary"}
                                sx= {{ backgroundColor: "inherit" }}
                            />
                        </FormControl>
                        {auth?.errorMessage ?
                            <Typography color="error.main" variant="body2" height="1rem">{auth.errorMessage}</Typography>
                            : <Typography height="1rem"></Typography>
                        }
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            onClick={validateInputs}
                            sx={{
                                color: palette.primary[100],
                                backgroundColor: palette.primary[800],
                                marginTop: "1rem"
                            }}
                        >
                            Sign in
                        </Button>
                    </Box>
                </Card>
            </Box>
        </DashBox>
    );
};

export default Login;
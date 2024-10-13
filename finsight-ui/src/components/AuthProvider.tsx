import { useLoginMutation } from "@/state/api";
import { LoginRequest } from "@/state/types";
import React, { useContext, createContext, useState } from "react";
import { useNavigate } from "react-router-dom";

interface AuthProviderProps {
    children: React.ReactNode;
};

interface AuthContextType {
    token: string | null;
    loginAction: (credentials: LoginRequest) => Promise<void>;
    logoutAction: () => void;
    errorMessage: string | null;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const [token, setToken] = useState(localStorage.getItem("jwtToken"));
    const [login] = useLoginMutation();
    const navigate = useNavigate();
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const loginAction = async (credentials: LoginRequest) => {
        try {
            const response = await login(credentials).unwrap();
            console.log("🚀 ~ loginAction ~ response:", response)

            if (response.token) {
                setToken(response.token);
                console.log("🚀 ~ loginAction ~ response.token:", response.token);
                localStorage.setItem("jwtToken", response.token);
                setErrorMessage(null);
                navigate("/dashboard");
            } else {
                throw new Error("No token returned");
            }   
        } catch (err) {
            console.error(err);
            setErrorMessage("Invalid email or password");
        }
    };

    const logoutAction = () => {
        localStorage.removeItem("jwtToken");
        setToken(null);
        console.log("Logged out");
        navigate("/login");
    };

    return (
        <AuthContext.Provider value={{ token, loginAction, logoutAction, errorMessage }}>
            { children }
        </AuthContext.Provider>
    );
};

export default AuthProvider;

export const useAuth = () => {
    return useContext(AuthContext);
};
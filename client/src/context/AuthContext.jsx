import { createContext, useContext, useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {

    const [auth, setAuth] = useState({
        token: null,
        id: null,
        user: null,
        role: null,
    });

    const [verifyEmailInfo, setVerifyEmailInfo] = useState({
        email: null,
        otp: null,
    });

    useEffect(() => {
        const storedToken = localStorage.getItem("token");
        if (storedToken) {
            const decoded = jwtDecode(storedToken);
            setAuth({
                token: storedToken,
                id: decoded.id,
                user: { id: decoded.id, email: decoded.email, username: decoded.username },
                role: decoded.role,
            });
        }
    }, []);


    const handleEmailVerificationToken = (token) => {
        const decoded = jwtDecode(token);
        localStorage.setItem("emailverify", token);
        setVerifyEmailInfo({
            email: decoded.email,
            otp: decoded.otp,
        });
    };

    const login = (token) => {
        const decoded = jwtDecode(token);
        localStorage.setItem("token", token);
        setAuth({
            token,
            id: decoded.id,
            user: { id: decoded.id, email: decoded.email, username: decoded.username },
            role: decoded.role,
        });
    };

    const logout = (navigate) => {
        localStorage.clear();
        setAuth({ token: null, id: null, user: null, role: null });
        setVerifyEmailInfo({ email: null, otp: null });
        navigate("/", { replace: true });
    };

    return (
        <AuthContext.Provider value={{
            auth,
            verifyEmailInfo,
            handleEmailVerificationToken,
            login,
            logout,
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
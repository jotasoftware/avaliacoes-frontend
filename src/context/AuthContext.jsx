import React, { createContext, useState, useEffect, useContext } from "react";
import { login as apiLogin, register as apiRegister, edit as apiEdit, recover as apiRecover, editPassword as apiEditPassword } from '../services/authService';
import { onAuthStateChanged, signOut, setPersistence, browserLocalPersistence } from "firebase/auth";
import { auth } from "../config/firebaseConfig";

export const AuthContext = createContext(null);

const MAX_INACTIVITY = 1000 * 60 * 60 * 48;

export const AuthProvider = ({ children }) => {
    const [loadingRecover, setLoadingRecover] = useState(false);
    const [userName, setUserName] = useState(null);
    
    const [user, setUser] = useState(null);
    const [loadingAuth, setLoadingAuth] = useState(true);

    useEffect(() => {
        setPersistence(auth, browserLocalPersistence); //persistencia explicita
    }, []);

    const updateActivity = () => {
        const lastActivity = localStorage.getItem("lastActivity");
      
        if (!lastActivity || Date.now() - lastActivity > MAX_INACTIVITY) {
          localStorage.removeItem("lastActivity");
          setUser(null);
          window.location.href = "/login";
          return;
        }
      
        localStorage.setItem("lastActivity", Date.now());
    };
    
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
            if (!firebaseUser) {
                setUser(null);
                setLoadingAuth(false);
                return;
            }
        
            const lastActivity = localStorage.getItem("lastActivity");

            if (!lastActivity) {
                localStorage.setItem("lastActivity", Date.now());
                setUser(firebaseUser);
                setLoadingAuth(false);
                return;
            }

            if (Date.now() - lastActivity > MAX_INACTIVITY) {
                signOut(auth);
                localStorage.removeItem("lastActivity");
                setUser(null);
            } else {
                setUser(firebaseUser);
                localStorage.setItem("lastActivity", Date.now());
            }
        
            setLoadingAuth(false);
        });
    
        return unsubscribe;
    }, []);

    const login = async (credentials) => {
        try{
            const user = await apiLogin(credentials);
            setUser(user);
            localStorage.setItem("lastActivity", Date.now());
        }catch(error){
            throw error;
        }
    };

    const register = async (data) => {
        try {
            const payloadParaAPI = {
                name: data.name,
                email: data.email, 
                password: data.password, 
            };
            await apiRegister(payloadParaAPI);
        } catch (error) {
            throw error;
        }
    };

    // const recover = async (email) => {
    //     setLoadingRecover(true)
    //     try {
    //         const response = await apiRecover(email);
    //         setLoadingRecover(false)
    //         return response.message
    //     } catch (error) {
    //         throw error;
    //     }
    // };

    // const edit = async (credentials) => {
    //     setLoadingRecover(true)
    //     try {
    //         const response = await apiEdit(credentials, tokenAuth);
    //         return response
    //     } catch (error) {
    //         throw error;
    //     }finally{
    //         setLoadingRecover(false)
    //     }
    // };

    // const editPassword = async (credentials) => {
    //     try {
    //         const response = await apiEditPassword(credentials);
    //         return response
    //     } catch (error) {
    //         throw error;
    //     }
    // };

    const logout = async () => {
        await signOut(auth);
        localStorage.removeItem("lastActivity");
        setUser(null);
    };

    const value = {loadingAuth, login, logout, register, userName, setUserName, loadingRecover, user, updateActivity};

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth deve ser usado dentro de um AuthProvider');
    }
    return context;
};
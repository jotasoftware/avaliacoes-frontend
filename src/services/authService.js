import { createUserWithEmailAndPassword, updateProfile, signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../config/firebaseConfig";
import api from "../config/apiClient";

const getAuthConfig = (token) => {
  return { headers: { Authorization: `Bearer ${token}` } };
}

export const login = async ({ email, password }) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  } catch (error) {
    throw new Error(error.message);
  }
};
  

export const register = async ({ name, email, password }) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    await updateProfile(user, {
      displayName: name
    });
    console.log("Usuário registrado:", user.displayName, user.email);
  } catch (error) {
    console.error("Erro ao registrar usuário:", error.message);
    throw error;
  }
};

export const recover = async (email) => {
  try{
    const payloadParaAPI = {
      email: email.recoverEmail,
    };
    const response = await api.post(API_CONFIG.auth.recover, payloadParaAPI);
    return response.data;
  }catch(error){
    console.error("Erro no serviço de registro:", error.response?.data || error.message);
    throw error;
  }
};

export const edit = async (credentials, token) => {
  try{
    const payloadParaAPI = {
      name: credentials.nome,
      oldPassword: credentials.senhaAtual,
      newPassword: credentials.senhaNova
    };
    const config = getAuthConfig(token);
    const response = await api.patch(API_CONFIG.auth.edit, payloadParaAPI);
    return response.data;
  }catch(error){
    console.error("Erro no serviço de registro:", error.response?.data || error.message);
    throw error;
  }
};

export const editPassword = async (credentials) => {
  try{
    const payloadParaAPI = {
      token: credentials.token,
      newPassword: credentials.senhaNova,
    };
    const response = await api.post(API_CONFIG.auth.editPassword, payloadParaAPI);
    return response.data;
  }catch(error){
    console.error("Erro no serviço de registro:", error.response?.data || error.message);
    throw error;
  }
};
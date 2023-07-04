import React, { createContext, useState, ReactNode } from "react";
import axios from "axios";
import * as SecureStore from "expo-secure-store";
import { showMessage } from "react-native-flash-message";

import { endpoints } from "../constants/APIs";

export interface AuthContextType {
  isAuthed: boolean;
  userId: string;
  setIsAuthed: (isAuthed: boolean) => void;
  register: (email: string, password: string, done: () => void) => void;
  login: (username: string, password: string, done: () => void) => void;
  checkValid: () => void;
}

export const AuthContext = createContext<AuthContextType>({
  isAuthed: false,
  userId: "",
  setIsAuthed: (isAuthed: boolean) => null,
  register: (email: string, password: string, done: () => void) => null,
  login: (username: string, password: string, done: () => void) => null,
  checkValid: () => null,
});

const AuthProvider = (props: { children: ReactNode }) => {
  const [isAuthed, setIsAuthed] = useState(false);
  const [userId, setUserId] = useState("");
  SecureStore.getItemAsync("token").then(async (value) => {
    if (value) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${value}`;
      setUserId(await SecureStore.getItemAsync("userId") ?? "")
      setIsAuthed(true);
    }
    checkValid();
  });

  const register = (email: string, password: string, done: () => void) => {
    axios
      .post(endpoints.register, { email, password })
      .then(async (res) => {
        console.log(res.data);
        showMessage({
          message: res.data.success,
          type: "success",
        });
      })
      .catch((error) => {
        console.log(error);
        showMessage({
          message: `${
            error.response.data.error ?? "Some errors happened!"
          }`,
          type: "warning",
        });
      })
      .finally(() => done());
  };

  const login = (username: string, password: string, done: () => void) => {
    axios
      .post(endpoints.login, { username, password })
      .then(async (res) => {
        const token = res.data.jwt;
        const userId = res.data.userId;
        if (!token) {
          console.log("[error] authentication failed");
          return;
        }
        setIsAuthed(true);
        setUserId(userId);
        axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
        await SecureStore.setItemAsync("token", token);
        await SecureStore.setItemAsync("userId", userId);
      })
      .catch((error) => {
        console.log(error);
        showMessage({
          message: `${
            error.response.data.error ?? "Some errors happened!"
          }`,
          type: "warning",
        });
      })
      .finally(() => done());
  };

  const checkValid = () => {
    axios
      .post(endpoints.checkValid, {})
      .catch(async (error) => {
        axios.defaults.headers.common["Authorization"] = null;
        await SecureStore.deleteItemAsync("token");
        await SecureStore.deleteItemAsync("userId");
        setIsAuthed(false);
        setUserId("");
      });
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthed,
        userId,
        setIsAuthed,
        register,
        login,
        checkValid,
      }}
    >
      {props.children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;

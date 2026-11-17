
import { createContext, useEffect, useState } from "react";
import * as SecureStore from "expo-secure-store";

import { apiRequest } from "../services/api";

export const AuthContext = createContext();

export default function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  // Check whether a saved login token is still valid
  useEffect(() => {
    async function checkLogin() {
      try {
        const token = await SecureStore.getItemAsync("userToken");

        if (token) {
          const result = await apiRequest(
            "/api/auth/me",
            "GET",
            null,
            token
          );

          setUser(result.user);
        }
      } catch (error) {
        if (error.status === 401) {
          await SecureStore.deleteItemAsync("userToken");
        }

        setUser(null);
      } finally {
        setIsCheckingAuth(false);
      }
    }

    checkLogin();
  }, []);

  // Save the user and token after successful login
  async function login(userData, token) {
    await SecureStore.setItemAsync("userToken", token);
    setUser(userData);
  }

  // Update the user's profile on the backend
  async function updateProfile(profileData) {
    const token = await SecureStore.getItemAsync("userToken");

    if (!token) {
      throw new Error("Please log in again.");
    }

    const result = await apiRequest(
      "/api/auth/me",
      "PATCH",
      profileData,
      token
    );

    setUser(result.user);

    return result.user;
  }

  // Log out from this device
  async function logout() {
    await SecureStore.deleteItemAsync("userToken");
    setUser(null);
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isCheckingAuth,
        login,
        updateProfile,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

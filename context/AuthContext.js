
import { createContext, useEffect, useState } from "react";
import * as SecureStore from "expo-secure-store";

import { apiRequest } from "../services/api";
import {
  connectSocket,
  disconnectSocket,
} from "../services/socket";

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

          // Connect Socket.IO after restoring the session
          connectSocket(token);
        }
      } catch (error) {
        if (error.status === 401) {
          await SecureStore.deleteItemAsync("userToken");
        }

        disconnectSocket();
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

    // Connect Socket.IO after login
    connectSocket(token);
  }

  // Update the user's name and About information
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

  // Upload and update the user's profile picture
  async function updateProfilePicture(imageBase64, mimeType) {
    const token = await SecureStore.getItemAsync("userToken");

    if (!token) {
      throw new Error("Please log in again.");
    }

    const result = await apiRequest(
      "/api/auth/profile-picture",
      "PATCH",
      {
        imageBase64,
        mimeType,
      },
      token
    );

    // Update global user data
    setUser(result.user);

    return result.user;
  }

  // Log out from this device
  async function logout() {
    disconnectSocket();

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
        updateProfilePicture,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

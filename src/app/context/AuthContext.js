"use client";
import axios from "axios";
import { useRouter } from "next/navigation";
import { createContext, useState, useEffect } from "react";
import { isAdminFromToken } from "../utils/tokenUtils";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");

    if (token && storedUser) {
      try {
        const userData = JSON.parse(storedUser);

        if (isAdminFromToken(token)) {
          setUser(userData);
        } else {
          console.warn("Token verification failed: User is not admin");
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          setUser(null);
        }
      } catch (err) {
        console.error("Error verifying user:", err);
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setUser(null);
      }
    }

    setIsLoading(false);
  }, []);

  useEffect(() => {
    const id = axios.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status !== 401) return Promise.reject(error);
        const auth =
          error.config?.headers?.Authorization ??
          error.config?.headers?.authorization;
        if (typeof auth !== "string" || !auth.startsWith("Bearer ")) {
          return Promise.reject(error);
        }
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setUser(null);
        router.push("/login");
        return Promise.reject(error);
      }
    );
    return () => axios.interceptors.response.eject(id);
  }, [router]);

  const login = (userData, token) => {
    if (isAdminFromToken(token)) {
      localStorage.setItem("user", JSON.stringify(userData));
      localStorage.setItem("token", token);
      setUser(userData);
    } else {
      console.error("Login failed: Invalid userType in token");
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    router.push("/");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};
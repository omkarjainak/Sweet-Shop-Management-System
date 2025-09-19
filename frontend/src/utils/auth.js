// src/utils/auth.js
import { jwtDecode } from "jwt-decode"; // Use named import

export const getToken = () => localStorage.getItem("token");

export const getUserRole = () => {
  const token = getToken();
  if (!token) return null;

  try {
    const decoded = jwtDecode(token); // Use jwtDecode instead of jwt_decode
    return decoded.role;
  } catch {
    return null;
  }
};

export const isLoggedIn = () => !!getToken();

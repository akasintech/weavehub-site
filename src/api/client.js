import axios from "axios";
import { API_BASE_URL } from "./endpoints";

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
  timeout: 15000,
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Graceful error extraction
    const message =
      error?.response?.data?.message ||
      error?.response?.data?.error ||
      (error?.code === "ECONNABORTED"
        ? "Request timed out. Please check your connection."
        : error?.message || "Failed to communicate with the WeaveHub server.");

    const customError = new Error(message);
    customError.status = error?.response?.status;
    customError.data = error?.response?.data;
    return Promise.reject(customError);
  }
);

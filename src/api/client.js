import axios from "axios";
import { API_BASE_URL } from "./endpoints";

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    Accept: "application/json",
  },
  // Generous because the API host can take a while to wake from idle.
  timeout: 30000,
});

function friendlyMessage(error) {
  const data = error?.response?.data;
  if (typeof data?.message === "string" && data.message) return data.message;
  if (typeof data?.error === "string" && data.error) return data.error;
  if (error?.code === "ECONNABORTED") return "Request timed out. Please check your connection.";
  if (error?.response?.status >= 500) return "WeaveHub is having trouble right now. Please try again shortly.";
  if (!error?.response) return "We couldn't reach WeaveHub. Please check your connection.";
  return error?.message || "Failed to communicate with the WeaveHub server.";
}

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Keep cancellation distinguishable so callers can ignore it silently.
    if (axios.isCancel(error)) {
      const canceled = new Error("Request canceled");
      canceled.name = "AbortError";
      return Promise.reject(canceled);
    }

    const customError = new Error(friendlyMessage(error));
    customError.status = error?.response?.status;
    customError.data = error?.response?.data;
    return Promise.reject(customError);
  }
);

import axios from "axios";

const apiClient = axios.create({
  baseURL: "http://localhost:5000",
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
  timeout: 10000,
});

// 🔍 request debug
apiClient.interceptors.request.use((config) => {
  console.log("🚀 API Request:", config.baseURL + config.url);
  console.log("📦 Payload:", config.data);
  return config;
});

// 🔍 response debug
apiClient.interceptors.response.use(
  (response) => {
    console.log("✅ API Response:", response.data);
    return response;
  },
  (error) => {
    console.error("❌ API Error:", error.message);
    console.error("❌ Response:", error.response?.data);
    return Promise.reject(error);
  }
);

// helper for storing token in headers
export function setAuthToken(token: string | null) {
  if (token) {
    apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    console.log('[Auth] Token set');
  } else {
    delete apiClient.defaults.headers.common['Authorization'];
    console.log('[Auth] Token cleared');
  }
}

export default apiClient;

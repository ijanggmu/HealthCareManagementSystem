import axios from 'axios';
import { toast } from "@/components/ui/use-toast"

const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // This is important for sending cookies with requests
});

// Response interceptor for API calls
axiosInstance.interceptors.response.use(
  (response) => response, // Return the response unchanged if successful
  (error) => {
    // Handle the error
    const errorMessage = error.response?.data?.error || "An unexpected error occurred";
    
    toast({
      title: "Error",
      description: errorMessage,
      variant: "destructive",
    });

    return Promise.reject(error);
  }
);

export default axiosInstance;
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
    const errorMessages = error.response?.data?.errors || [{ detail: "An unexpected error occurred" }];
    errorMessages.forEach((errorMessage: any) => {
    toast({
      title: "Error",
      description: errorMessage.detail,
      variant: "destructive",
    });
  });

    return Promise.reject(error);
  }
);

export default axiosInstance;
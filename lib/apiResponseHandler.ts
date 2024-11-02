import { toast } from "@/components/ui/use-toast";

interface SuccessApiResponse<T> {
  meta: {
    api: {
      apiVersion: string;
      buildVersion: string;
    };
    pagination?: {
      totalItems: number;
      totalPages: number;
      currentPage: number;
      pageSize: number;
    };
  };
  data: T;
}

interface ErrorApiResponse {
  meta: {
    api: {
      apiVersion: string;
      buildVersion: string;
    };
  };
  errors: {
    title: string;
    detail: string;
    code: number;
  }[];
}

export const handleApiResponse = async <T>(promise: Promise<any>): Promise<SuccessApiResponse<T> | null> => {
  try {
    const response = await promise;
    return response.data as SuccessApiResponse<T>;
  } catch (error: unknown) {
    let errorMessages = [{'detail': "An unexpected error occurred"}];
    if (error instanceof Error && 'response' in error) {
      const apiError = error.response as ErrorApiResponse;
      errorMessages = apiError?.errors || errorMessages;
    }
    errorMessages.forEach((errorMessage) => {
    toast({
      title: "Error",
      description: errorMessage.detail,
      variant: "destructive",
    });
  });
    return null; // Return null or handle the error as needed
  }
};
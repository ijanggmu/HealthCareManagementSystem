import axiosInstance from '../../lib/axiosInstance';

interface CarePlan {
  id: number;
  name: string;
  client: string;
  startDate: string;
  endDate: string;
}
interface GetAllStaffParams {
    pageNumber: number;
    pageSize: number;
    query: string;
    filters: string;
    sorts: string;
  }
// Get all care plans
export const getAllCarePlans = async (params: GetAllStaffParams) => {
  const response = await axiosInstance.post('CarePlan/GetAllCarePlan',params);
  return response.data.data; // Assuming the response contains the care plan list
};

// Add new care plan
export const addCarePlan = async (carePlan: Omit<CarePlan, 'id'>) => {
  const response = await axiosInstance.post('CarePlan/CreateCarePlan', carePlan);
  return response.data; // Assuming the response contains the created care plan data
};

// Update existing care plan
export const updateCarePlan = async (carePlanId: number, carePlan: Partial<CarePlan>) => {
  const response = await axiosInstance.put(`CarePlan/UpdateCarePlan/${carePlanId}`, carePlan);
  return response.data; // Assuming the response contains the updated care plan data
};

// Delete care plan
export const deleteCarePlan = async (carePlanId: number) => {
  const response = await axiosInstance.delete(`CarePlan/DeleteCarePlan/${carePlanId}`);
  return response.data; // Assuming the response contains a success message or the deleted care plan data
};
import axiosInstance from '../../../lib/axiosInstance'; // Adjust the import path as necessary

interface Staff {
  firstName: string;
  lastName: string;
  userName: string;
  password: string;
  confirmPassword: string;
  email: string;
  phoneNumber: string;
}

// Define the parameters for getting all staff
interface GetAllStaffParams {
  pageNumber: number;
  pageSize: number;
  query: string;
  filters: string;
  sorts: string;
}

// Get all staff with pagination, filtering, and sorting
export const getAllStaff = async (params: GetAllStaffParams) => {
  const response = await axiosInstance.post('Staff/GetAllStaff', params);
  return response.data.data; // Assuming the response contains the staff list
};

// Add new staff
export const addStaff = async (staff: Staff) => {
  const response = await axiosInstance.post('Staff/CreateNewStaff', staff);
  return response.data; // Assuming the response contains the created staff data
};

// Update existing staff
export const updateStaff = async (staffId: string, staff: Partial<Staff>) => {
  const response = await axiosInstance.put(`Staff/UpdateStaffDetails/${staffId}`, staff);
  return response.data; // Assuming the response contains the updated staff data
};

// Delete staff
export const deleteStaff = async (staffId: string) => {
  const response = await axiosInstance.delete(`Staff/DeleteStaff/${staffId}`);
  return response.data; // Assuming the response contains a success message or the deleted staff data
};
import axiosInstance from '../../../lib/axiosInstance';

export interface Role {
  id: string;
  name: string;
  description: string;
  roleType: string;
}
export interface PaginationRequestModel {
  pageNumber: number;
  pageSize: number;
  query: string;
  filters: string;
  sorts: string;
}
// Get all Roles
export const getAllRoles = async (params: PaginationRequestModel) => {
  const response = await axiosInstance.post('Role/GetAllRoles', params);
  return response.data.data; // Assuming the response contains the Role list
};

// Add new Role
export const addRole = async (role: Omit<Role, 'id'>) => {
  const response = await axiosInstance.post('Role/CreateNewRole', role);
  return response.data; // Assuming the response contains the created Role data
};

// Update existing Role
export const updateRole = async (roleId: string, role: Partial<Role>) => {
  const response = await axiosInstance.put(`Role/UpdateRoleDetail/${roleId}`, role);
  return response.data; // Assuming the response contains the updated Role data
};

// Delete Role
export const deleteRole = async (roleId: string) => {
  const response = await axiosInstance.delete(`Role/DeleteRole/${roleId}`);
  return response.data; // Assuming the response contains a success message or the deleted Role data
};
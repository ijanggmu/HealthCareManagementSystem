import axiosInstance from '../../../lib/axiosInstance';

interface Client {
  id: number;
  name: string;
  email: string;
  phone: string;
}
interface GetAllStaffParams {
    pageNumber: number;
    pageSize: number;
    query: string;
    filters: string;
    sorts: string;
  }
// Get all clients
export const getAllClients = async (params:GetAllStaffParams) => {
  const response = await axiosInstance.post('Client/GetAllClient',params);
  return response.data.data; // Assuming the response contains the client list
};

// Add new client
export const addClient = async (client: Omit<Client, 'id'>) => {
  const response = await axiosInstance.post('Client/CreateNewClient', client);
  return response.data; // Assuming the response contains the created client data
};

// Update existing client
export const updateClient = async (clientId: number, client: Partial<Client>) => {
  const response = await axiosInstance.put(`Client/UpdateClientDetail/${clientId}`, client);
  return response.data; // Assuming the response contains the updated client data
};

// Delete client
export const deleteClient = async (clientId: number) => {
  const response = await axiosInstance.delete(`Client/DeleteClient/${clientId}`);
  return response.data; // Assuming the response contains a success message or the deleted client data
};
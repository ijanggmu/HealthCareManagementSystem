import axiosInstance from '../../../lib/axiosInstance';

interface Incident {
  id: number;
  description: string;
  client: string;
  date: string;
  status: string;
}
interface GetAllStaffParams {
    pageNumber: number;
    pageSize: number;
    query: string;
    filters: string;
    sorts: string;
  }
// Get all incidents
export const getAllIncidents = async (params: GetAllStaffParams) => {
  const response = await axiosInstance.post('/api/Incidents/GetAllIncidents',params);
  return response.data; // Assuming the response contains the incident list
};

// Add new incident
export const addIncident = async (incident: Omit<Incident, 'id'>) => {
  const response = await axiosInstance.post('/api/Incidents/CreateNewIncident', incident);
  return response.data; // Assuming the response contains the created incident data
};

// Update existing incident
export const updateIncident = async (incidentId: number, incident: Partial<Incident>) => {
  const response = await axiosInstance.put(`/api/Incidents/UpdateIncidentDetails/${incidentId}`, incident);
  return response.data; // Assuming the response contains the updated incident data
};

// Delete incident
export const deleteIncident = async (incidentId: number) => {
  const response = await axiosInstance.delete(`/api/Incidents/DeleteIncident/${incidentId}`);
  return response.data; // Assuming the response contains a success message or the deleted incident data
};
import axiosInstance from '../../../lib/axiosInstance'; 
// Adjust the import path as necessary
export interface DashboardData {
  staffCount: number;
  clientCount: number;
  carePlanCount: number;
  todaysTotalSchedule: number;
}

export const getDashboardData = async () => {
  const response = await axiosInstance.get('CmsDashboard/GetCmsDashboard');
  return response.data.data; // Assuming the response contains the staff list
};

import axiosInstance from '../../lib/axiosInstance'; // Adjust the import path as necessary


export const navbarData = async () => {
  const response = await axiosInstance.get('MenuPermission/GetMenu');
  return response.data.data; // Assuming the response contains the staff list
};

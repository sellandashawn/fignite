import axios from "axios";
import { API_BASE_URL } from "./url";

const getAuthToken = () => {
  const token = localStorage.getItem("token");
  return `${token}`;
};

// Add a new category
export const addCategory = async (data) =>
  axios.post(`${API_BASE_URL}/category/`, data, {
    headers: {
      Authorization: `Bearer ${getAuthToken()}`,
      "Content-Type": "application/json",
    },
  });

// Get all categories
export const getCategories = async () => {
  const response = await axios.get(`${API_BASE_URL}/category/`);
  return response.data;
};

// Get categories by type (event, sports)
// Get categories by type
export const getCategoriesByType = async (type) => {
  const response = await axios.get(`${API_BASE_URL}/category/type/${type}`);
  return response.data;
};

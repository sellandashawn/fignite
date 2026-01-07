import axios from "axios";
import { API_BASE_URL } from "./url";

const getAuthToken = () => {
  const token = localStorage.getItem("token");
  return `${token}`;
};

// Create a new sport
export const createSport = async (data) =>
  axios.post(`${API_BASE_URL}/sports/createSport`, data, {
    headers: {
      Authorization: `Bearer ${getAuthToken()}`,
      "Content-Type": "multipart/form-data",
    },
  });

// Get all sports
export const getAllSports = async () => {
  const response = await axios.get(`${API_BASE_URL}/sports`);
  return response.data;
};

// Get sports by category name
export const getSportsByCategory = async (categoryName) => {
  const response = await axios.get(
    `${API_BASE_URL}/sports/category/${categoryName}`
  );
  return response.data;
};

// Get sport by ID
export const getSportById = async (id) => {
  const response = await axios.get(`${API_BASE_URL}/sports/${id}`);
  return response.data;
};

// Delete sport
export const deleteSport = async (id) =>
  axios.delete(`${API_BASE_URL}/sports/${id}`, {
    headers: {
      Authorization: `Bearer ${getAuthToken()}`,
    },
  });

// Update sport
export const updateSport = async (id, data) =>
  axios.put(`${API_BASE_URL}/sports/${id}`, data, {
    headers: {
      Authorization: `Bearer ${getAuthToken()}`,
      "Content-Type": "multipart/form-data",
    },
  });

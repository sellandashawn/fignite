import axios from "axios";
import { API_BASE_URL } from "./url";

const getAuthToken = () => {
  const token = localStorage.getItem("token");
  return `${token}`;
};

export const addCategory = async (data) =>
  axios.post(`${API_BASE_URL}/category/`, data, {
    headers: {
      Authorization: `Bearer ${getAuthToken()}`,
      "Content-Type": "application/json",
    },
  });

export const getCategories = async () => {
  const response = await axios.get(`${API_BASE_URL}/category/`);
  return response.data;
};

import axios from "axios";
import { API_BASE_URL } from "./url";

const getAuthToken = () => {
  const token = localStorage.getItem("token");
  return `${token}`;
};

export const createEvent = async (data) =>
  axios.post(`${API_BASE_URL}/events/createEvent`, data, {
    headers: {
      Authorization: `Bearer ${getAuthToken()}`,
      'Content-Type': 'multipart/form-data',

    },
  });

export const getAllEvents = async () => {
  const response = await axios.get(`${API_BASE_URL}/events`);
  return response.data;
};


export const getEventById = async (id) => {
  const response = await axios.get(`${API_BASE_URL}/events/${id}`);
  return response.data;
};

export const deleteEvent = async (id) =>
  axios.delete(`${API_BASE_URL}/events/${id}`, {
    headers: {
      Authorization: `Bearer ${getAuthToken()}`,
    },
  });

export const updateEvent = async (id, data) =>
  axios.put(`${API_BASE_URL}/events/${id}`, data, {
    headers: {
      Authorization: `Bearer ${getAuthToken()}`,
    },
  });
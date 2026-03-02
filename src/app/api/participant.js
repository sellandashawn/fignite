import axios from "axios";
import { API_BASE_URL } from "./url";

const getAuthToken = () => {
  const token = localStorage.getItem("token");
  return `${token}`;
};

export const registerParticipantWithPayment = async (eventId, data) =>
  axios.post(
    `${API_BASE_URL}/tickets/${eventId}/register-with-payment`,
    { data },
    {
      headers: {
        "Content-Type": "application/json",
        ...(getAuthToken() ? { Authorization: `Bearer ${getAuthToken()}` } : {}),
      },
    }
  );


export const getEventParticipants = async (eventId = null) => {
  const url = eventId
    ? `${API_BASE_URL}/tickets/participants?eventId=${eventId}`
    : `${API_BASE_URL}/tickets/participants`;

  return axios.get(url, {
    headers: {
      Authorization: `Bearer ${getAuthToken()}`,
    },
  });
};

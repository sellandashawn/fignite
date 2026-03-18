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
        ...(getAuthToken()
          ? { Authorization: `Bearer ${getAuthToken()}` }
          : {}),
      },
    },
  );

export const getEventParticipants = async (eventId = null, sportId = null) => {
  let url = `${API_BASE_URL}/tickets/participants`;
  const params = new URLSearchParams();
  if (eventId) params.append("eventId", eventId);
  if (sportId) params.append("sportId", sportId);
  const qs = params.toString();
  if (qs) url += `?${qs}`;

  return axios.get(url, {
    headers: {
      Authorization: `Bearer ${getAuthToken()}`,
    },
  });
};

export const getEntityParticipants = async (entityId, isSport) => {
  if (!entityId) {
    throw new Error("entityId is required");
  }
  if (isSport) {
    return getEventParticipants(null, entityId);
  }
  return getEventParticipants(entityId, null);
};

export const scanTicketByQR = async (qrData, eventId = null) => {
  const payload = { qrData };
  if (eventId) payload.eventId = eventId;
  return axios.post(`${API_BASE_URL}/tickets/scan-qr`, payload, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getAuthToken()}`,
    },
  });
};

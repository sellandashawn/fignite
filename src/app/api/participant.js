import axios from "axios";
import { API_BASE_URL } from "./url";

const getAuthToken = () => {
    const token = localStorage.getItem("token");
    return `${token}`;
};

export const registerParticipantWithPayment = async (eventId, data) =>
    axios.post(`${API_BASE_URL}/tickets/${eventId}/register-with-payment`, { eventId, data }, {
        headers: {
            Authorization: `Bearer ${getAuthToken()}`,
            'Content-Type': 'application/json',

        },
    });

export const getEventParticipants = async (eventId) =>
    axios.post(`${API_BASE_URL}/tickets/${eventId}/participants`, { eventId }, {
        headers: {
            Authorization: `Bearer ${getAuthToken()}`,
        },
    });

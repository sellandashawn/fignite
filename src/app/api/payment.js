import axios from "axios";
import { API_BASE_URL } from "./url";

const getAuthToken = () => {
    const token = localStorage.getItem("token");
    return `${token}`;
};

export const getPaymentsByEvent = async (eventId) =>
    axios.get(`${API_BASE_URL}/payment/events/${eventId}/payments`, {
        headers: {
            Authorization: `Bearer ${getAuthToken()}`,
        },
    });

export const getAllPayments = async () =>
    axios.get(`${API_BASE_URL}/payment/payments`, {
        headers: {
            Authorization: `Bearer ${getAuthToken()}`,
        },
    });
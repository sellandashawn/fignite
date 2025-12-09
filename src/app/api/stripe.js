import axios from "axios";
import { API_BASE_URL } from "./url";

const getAuthToken = () => {
    const token = localStorage.getItem("token");
    return `${token}`;
};

export const createCheckout = async (data) =>
    axios.post(`${API_BASE_URL}/stripe/create-checkout-session`,data);

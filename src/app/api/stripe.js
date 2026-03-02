import axios from "axios";
import { API_BASE_URL } from "./url";

export const createCheckout = async (data) =>
  axios.post(`${API_BASE_URL}/payhere/create-checkout`, data);


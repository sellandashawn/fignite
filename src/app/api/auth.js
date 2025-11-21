import axios from "axios";
import { API_BASE_URL } from "./url";


export const signup = async ({ email, password }) => axios.post(`${API_BASE_URL}/auth/register`, { email, password });
export const signin = async ({ email, password }) => axios.post(`${API_BASE_URL}/auth/signin`, { email, password });
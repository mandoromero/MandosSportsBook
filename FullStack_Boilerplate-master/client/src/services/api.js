import axios from "axios";

const API = axios.create({
    baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000",
});

export const getMessage = async () => {
    const response = await API.get("/api/message");
    return response.data;
};
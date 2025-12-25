import axios from "axios";

export const api = axios.create({
  baseURL:"https://quickpdf-backend.onrender.com/api",
});


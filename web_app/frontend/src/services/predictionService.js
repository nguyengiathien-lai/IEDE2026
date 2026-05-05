// import axios from "axios";

// const API_BASE_URL = "http://127.0.0.1:8000";

// export const fetchOptions = async () => {
//   const response = await axios.get(`${API_BASE_URL}/options`);
//   return response.data;
// };

// export const predictDemand = async (payload) => {
//   const response = await axios.post(`${API_BASE_URL}/predict`, payload);
//   return response.data;
// };

import axios from "axios";

const API_BASE_URL = "http://127.0.0.1:8000";

export const fetchOptions = async () => {
  const response = await axios.get(`${API_BASE_URL}/options`);
  return response.data;
};

export const predictDemand = async (payload) => {
  const response = await axios.post(`${API_BASE_URL}/predict`, payload);
  return response.data;
};


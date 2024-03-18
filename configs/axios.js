import axios from "axios";

// Set config defaults when creating the instance
 const axiosClient = axios.create({
  baseURL: 'http://localhost:4000'
});

// Alter defaults after instance has been created
// instance.defaults.headers.common['Authorization'] = AUTH_TOKEN;

export default axiosClient;
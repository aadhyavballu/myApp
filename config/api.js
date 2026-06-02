import axios from "axios";
import { Platform } from "react-native";

const BASE_URL = Platform.OS === "web"
  ? "http://localhost:5000"
  : "http://10.80.29.166:5000";

const api = axios.create({ baseURL: BASE_URL });

export default api;

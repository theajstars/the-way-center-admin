import axios from "axios";
import { Endpoints } from "./Endpoints";
import Cookies from "js-cookie";

const baseURL = "https://api.thewaycenter.net";

const FetchData = async ({ method, route, data }) => {
  const token = Cookies.get("token");
  return axios.request({
    method,
    url: `${baseURL}${route}`,
    headers: {
      Authorization: `Bearer ${token ?? ""}`,
      "Content-Type": "application/json",
    },
    maxBodyLength: Infinity,
    data: data,
  });
};

const UploadFile = async ({ formData }) => {
  const token = Cookies.get("token");
  return axios.request({
    method: "POST",
    url: `${baseURL}${Endpoints.UploadFile}`,
    headers: {
      Authorization: `Bearer ${token ?? ""}`,
      "Content-Type": "multipart/form-data",
    },
    maxBodyLength: Infinity,
    data: formData,
  });
};

export { FetchData, UploadFile };

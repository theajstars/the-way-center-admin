import axios from "axios";
import { Endpoints } from "./Endpoints";

const baseURL = "https://api.thewaycenter.net";
const FetchData = async ({ method, route, data, isUpload }) => {
  return axios.request({
    method,
    url: `${baseURL}${route}`,
    headers: {
      Authorization: `Bearer atajiboyeo@gmail.com`,
      "Content-Type": "application/json",
    },
    maxBodyLength: Infinity,
    data: data,
  });
};
const UploadFile = async ({ formData }) => {
  return axios.request({
    method: "POST",
    url: `${baseURL}${Endpoints.UploadFile}`,
    headers: {
      Authorization: `Bearer atajiboyeo@gmail.com`,
      "Content-Type": "multipart/form-data",
    },
    maxBodyLength: Infinity,
    data: formData,
  });
};

export { FetchData, UploadFile };

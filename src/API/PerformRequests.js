import { Endpoints } from "./Endpoints";
import { FetchData } from "./FetchData";

const CreateNewSurrogate = async (surrogate) => {
  return FetchData({
    method: "POST",
    route: Endpoints.CreateSurrogate,
    data: surrogate,
  });
};
const PerformRequest = {
  CreateNewSurrogate,
};

export { PerformRequest };

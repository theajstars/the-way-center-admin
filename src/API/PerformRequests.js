import { Endpoints } from "./Endpoints";
import { FetchData } from "./FetchData";

const CreateNewSurrogate = async (surrogate) => {
  return FetchData({
    method: "POST",
    route: Endpoints.CreateSurrogate,
    data: surrogate,
  });
};
const CreateNewParent = async (parent) => {
  return FetchData({
    method: "POST",
    route: Endpoints.CreateParent,
    data: parent,
  });
};
const PerformRequest = {
  CreateNewSurrogate,
  CreateNewParent,
};

export { PerformRequest };

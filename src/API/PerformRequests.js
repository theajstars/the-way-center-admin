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
const GetAllParents = async (params) => {
  const { isPaired, orderBy, parentID } = params;
  return FetchData({
    method: "GET",
    route: params
      ? `${Endpoints.FetchParent}?isPaired=${isPaired ?? ""}&parentID=${
          parentID ?? ""
        }&orderBy=${orderBy ?? ""}`
      : Endpoints.FetchParent,
  });
};
const GetAllSurrogates = async (params) => {
  const { isPaired, orderBy, surrogateID } = params;
  return FetchData({
    method: "GET",
    route: params
      ? `${Endpoints.FetchSurrogate}?isPaired=${isPaired ?? ""}&surrogateID=${
          surrogateID ?? ""
        }&orderBy=${orderBy ?? ""}`
      : Endpoints.FetchSurrogate,
  });
};

const UpdateSurrogate = async (surrogate) => {
  return FetchData({
    method: "POST",
    route: Endpoints.UpdateSurrogate,
    data: surrogate,
  });
};
const UpdateParent = async (parent) => {
  return FetchData({
    method: "POST",
    route: Endpoints.UpdateParent,
    data: parent,
  });
};

const CreatePairing = async (pairingForm) => {
  return FetchData({
    method: "POST",
    route: Endpoints.CreatePairing,
    data: pairingForm,
  });
};

const GetCountries = async () => {
  return FetchData({
    method: "GET",
    route: Endpoints.GetCountries,
  });
};
const GetMetrics = async () => {
  return FetchData({
    method: "GET",
    route: Endpoints.GetMetrics,
  });
};

const PerformRequest = {
  CreateNewSurrogate,
  CreateNewParent,
  GetAllParents,
  GetAllSurrogates,
  GetCountries,
  GetMetrics,
  UpdateSurrogate,
  UpdateParent,
  CreatePairing,
};

export { PerformRequest };

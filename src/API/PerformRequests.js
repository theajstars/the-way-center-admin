import { Endpoints } from "./Endpoints";
import { FetchData } from "./FetchData";
const RequestOTP = async ({ email }) => {
  return FetchData({
    method: "POST",
    route: Endpoints.RequestOTP,
    data: { email },
  });
};
const Login = async ({ email, password }) => {
  return FetchData({
    method: "POST",
    route: Endpoints.Login,
    data: { email, password, account: "Console" },
  });
};
const GetProfile = async () => {
  return FetchData({
    method: "GET",
    route: Endpoints.Profile,
  });
};
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

const UpdatePairing = async ({ pairingID, status }) => {
  return FetchData({
    method: "POST",
    route: Endpoints.UpdatePairing,
    data: { pairID: pairingID, status },
  });
};

const CreatePairing = async (pairingForm) => {
  return FetchData({
    method: "POST",
    route: Endpoints.CreatePairing,
    data: pairingForm,
  });
};
const GetPairing = async ({ surrogateID, parentID, limit, page }) => {
  return FetchData({
    method: "GET",
    route: `${Endpoints.GetPairingDetails}?surrogateID=${
      surrogateID ?? ""
    }&parentID=${parentID ?? ""}&limit=${limit ?? ""}&page=${page ?? ""}`,
  });
};
const GetPairingRequests = async ({ limit, page }) => {
  return FetchData({
    method: "GET",
    route: `${Endpoints.GetPairingRequests}?limit=${limit ?? ""}&page=${
      page ?? ""
    }`,
  });
};
const CreateReport = async (report) => {
  return FetchData({
    method: "POST",
    route: Endpoints.CreateReport,
    data: report,
  });
};
const AddReportFile = async (report) => {
  return FetchData({
    method: "POST",
    route: Endpoints.AddReportFile,
    data: report,
  });
};
const SendReportNotification = async (parent) => {
  return FetchData({
    method: "POST",
    route: Endpoints.SendReportNotification,
    data: parent,
  });
};
const GetReports = async ({ page, limit, parentID, surrogateID }) => {
  return FetchData({
    method: "GET",
    route: `${Endpoints.GetReports}?page=${page ?? ""}&limit=${
      limit ?? ""
    }&parentID=${parentID ?? ""}&surrogateID=${surrogateID ?? ""}`,
  });
};

const GetCountries = async () => {
  return FetchData({
    method: "GET",
    route: Endpoints.GetCountries,
  });
};
const GetRelationships = async () => {
  return FetchData({
    method: "GET",
    route: Endpoints.GetRelationships,
  });
};
const GetTribes = async () => {
  return FetchData({
    method: "GET",
    route: Endpoints.GetTribes,
  });
};
const GetReligions = async () => {
  return FetchData({
    method: "GET",
    route: Endpoints.GetReligions,
  });
};
const GetMetrics = async () => {
  return FetchData({
    method: "GET",
    route: Endpoints.GetMetrics,
  });
};

const GetMessageList = async () => {
  return FetchData({
    method: "GET",
    route: Endpoints.GetMessageList,
  });
};
const CreateMessageReference = async (parent) => {
  return FetchData({
    method: "POST",
    route: Endpoints.CreateMessageReference,
    data: parent,
  });
};
const SendMessage = async (message) => {
  return FetchData({
    method: "POST",
    route: Endpoints.SendMessage,
    data: message,
  });
};
const GetCurrentMessages = async (reference) => {
  return FetchData({
    method: "GET",
    route: `${Endpoints.GetCurrentMessages}?reference=${reference}`,
  });
};

const PerformRequest = {
  RequestOTP,
  Login,
  CreateNewSurrogate,
  CreateNewParent,
  GetAllParents,
  GetAllSurrogates,
  GetCountries,
  GetMetrics,
  UpdateSurrogate,
  UpdateParent,
  CreatePairing,
  GetPairing,
  CreateReport,
  GetReports,
  AddReportFile,
  SendReportNotification,
  CreateMessageReference,
  SendMessage,
  GetMessageList,
  GetCurrentMessages,
  GetRelationships,
  GetTribes,
  GetReligions,
  UpdatePairing,
  GetPairingRequests,
  GetProfile,
};

export { PerformRequest };

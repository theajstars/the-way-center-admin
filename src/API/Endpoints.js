const Endpoints = {
  RequestOTP: "/auth/request-otp",
  Login: "/auth/login",
  Profile: "/auth/profile",

  UploadFile: "/misc/file-upload",
  GetCountries: "/misc/country",
  GetMetrics: "/console/metrics",

  AddTeamMember: "/console/team/add",

  CreateSurrogate: "/surrogate/add",
  CreateParent: "/parent/add",

  FetchSurrogate: "/surrogate/details",
  FetchParent: "/parent/details",

  UpdateParent: "/parent/update",
  UpdateSurrogate: "/surrogate/update",

  CreatePairing: "/pair/create",

  AddReportFile: "/report/files/add",
  CreateReport: "/report/create",
  SendReportNotification: "/report/send-notification",
  GetReports: "/report/details",

  GetMessageList: "/message/list",
  SendMessage: "/message/send",
  CreateMessageReference: "/message/create",
  GetCurrentMessages: "/message/logs",
};

export { Endpoints };

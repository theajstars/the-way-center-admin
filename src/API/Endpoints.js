const Endpoints = {
  RequestOTP: "/auth/request-otp",
  Login: "/auth/login",
  Profile: "/auth/profile",

  UploadFile: "/misc/file-upload",
  GetCountries: "/misc/country",
  GetMetrics: "/console/metrics",
  GetRelationships: "/misc/relationship",
  GetTribes: "/misc/tribe",
  GetReligions: "/misc/religion",

  AddTeamMember: "/console/team/add",

  CreateSurrogate: "/surrogate/add",
  CreateParent: "/parent/add",

  FetchSurrogate: "/surrogate/details",
  FetchParent: "/parent/details",

  UpdateParent: "/parent/update",
  UpdateSurrogate: "/surrogate/update",

  CreatePairing: "/pair/create",
  GetPairingDetails: "/pair/details",
  UpdatePairing: "/pair/update",
  GetPairingRequests: "/pair/requests",

  AddReportFile: "/report/files/add",
  CreateReport: "/report/create",
  SendReportNotification: "/report/send-notification",
  GetReports: "/report/details",

  GetMessageList: "/message/list",
  SendMessage: "/message/send",
  CreateMessageReference: "/message/create",
  GetCurrentMessages: "/message/logs",

  CreateTeamMember: "/console/team/add",
  GetTeamDetails: "/console/team/details",
  UpdateTeamMember: "/console/team/update",

  GetNotificationCount: "/notification/console",
};

export { Endpoints };

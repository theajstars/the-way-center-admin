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
};

export { Endpoints };

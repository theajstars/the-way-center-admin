import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { ToastProvider } from "react-toast-notifications";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <ToastProvider autoDismiss={true} autoDismissTimeout={3000}>
    <App />
  </ToastProvider>
);

import { useState } from "react";

export default function AccountManagement() {
  const [vacancyCount, setVacancyCount] = useState(21);
  return (
    <div className="flex-column">
      <span className="px-16 fw-500 poppins">Account Management</span>
      <div className="flex-row account-management-row">
        <div className="flex-row account-management-item">
          <span className="account-management-icon flex-row">
            <i className="far fa-envelope-open"></i>
          </span>
          <span className="flex-column">
            <span className="px-12 fw-500 poppins">Send a Message to TWC</span>
            <span className="poppins px-12 fw-500 purple-default-text">
              Messages
            </span>
          </span>
        </div>
        <div className="flex-row account-management-item">
          <span className="account-management-icon flex-row">
            <i className="far fa-user-circle"></i>
          </span>
          <span className="flex-column">
            <span className="px-12 fw-500 poppins">Update Profile</span>
            <span className="poppins px-12 fw-500 purple-default-text">
              {vacancyCount} Vacancy
            </span>
          </span>
        </div>
        <div className="flex-row account-management-item">
          <span className="account-management-icon flex-row">
            <i className="far fa-file-chart-pie"></i>
          </span>
          <span className="flex-column">
            <span className="px-12 fw-500 poppins">Request A Report</span>
            <span className="poppins px-12 fw-500 purple-default-text">
              {vacancyCount} Vacancy
            </span>
          </span>
        </div>
      </div>
    </div>
  );
}

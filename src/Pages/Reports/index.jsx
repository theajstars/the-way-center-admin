import { useRef, useState, useEffect, useContext } from "react";
import { Grid, Modal, Pagination, Typography } from "@mui/material";
import {
  ReportCategories,
  SurrogateRecords,
  SurrogateReports,
} from "../../Assets/Data";
import { DefaultContext } from "../Dashboard";
import AishaAvatar from "../../Assets/IMG/AishaAvatar.svg";

export default function Reports() {
  const ContextConsumer = useContext(DefaultContext);
  const [SurrogateRecordsToDisplay, setSurrogateRecordsToDisplay] = useState(
    SurrogateRecords.slice(0, 4)
  );
  const { Reports: reports } = ContextConsumer;

  const [surrogateReportModalDetails, setSurrogateReportModalDetails] =
    useState({ state: false, content: null });

  const screenWidth = window.innerWidth;
  console.log(ContextConsumer);
  const getReportCategory = (category) => {
    const f = ReportCategories.filter((c) => c.value === category);
    if (f.length === 0) {
      return "Medical";
    } else {
      return f[0].name;
    }
  };
  return (
    <div className="home-page">
      <Typography className="poppins fw-500" variant="h5">
        ADMIN DASHBOARD
      </Typography>

      <Modal
        open={surrogateReportModalDetails.state}
        onClose={(e, reason) => {
          if (reason === "backdropClick") {
            setSurrogateReportModalDetails({
              ...surrogateReportModalDetails,
              state: false,
            });
          }
        }}
        className="default-modal-container flex-row"
      >
        <div className="default-modal-content surrogate-report-modal flex-column">
          <div className="flex-row align-center">
            <div className="flex-column">
              <span className="cinzel px-19 capitalize">
                {surrogateReportModalDetails.content?.parent.firstname}&nbsp;
                {surrogateReportModalDetails.content?.parent.lastname}
              </span>
              <span className="cinzel px-19 surrogate-report-title">
                {surrogateReportModalDetails.content?.title}
              </span>
            </div>
            &nbsp; &nbsp; &nbsp;
            <img
              src={surrogateReportModalDetails.content?.parent.image}
              alt=""
              className="surrogate-report-avatar"
            />
          </div>
          <br />
          <span className="fw-700 cinzel px-19">FULL REPORT</span>

          <br />
          <span className="fw-600 poppins px-19 underline">
            {getReportCategory(
              surrogateReportModalDetails.content?.reportCategory
            )}{" "}
            Report
          </span>
          <br />
          <div className="flex-row align-center">
            <span className="fw-400 poppins px-16">Surrogate: &nbsp;</span>
            <span className="fw-700 poppins px-16">
              {surrogateReportModalDetails.content?.surrogate.firstname}&nbsp;
              {surrogateReportModalDetails.content?.surrogate.lastname}
            </span>
          </div>
          <br />
          <div className="flex-row align-center">
            <span className="fw-400 poppins px-16">
              Health Practitioner: &nbsp;
            </span>
            <span className="fw-700 poppins px-16">
              {surrogateReportModalDetails.content?.healthPractitioner}
            </span>
          </div>
          <br />
          <span className="px-15 gray-secondary-text poppins full-surrogate-report-body modal-scrollbar">
            {surrogateReportModalDetails.content?.details}
          </span>
          <div className="flex-row surrogate-report-modal-footer">
            <span
              className="close-surrogate-report poppins flex-row pointer"
              onClick={() => {
                setSurrogateReportModalDetails({
                  ...surrogateReportModalDetails,
                  state: false,
                });
              }}
            >
              Exit
            </span>
          </div>
        </div>
      </Modal>
      <br />
      <div className="flex-row space-between align-center">
        <span className="poppins fw-500 px-18 surrogate-reports-head">
          Surrogate Reports
        </span>
      </div>
      <div className="surrogate-reports flex-row space-between">
        {/* {SurrogateReports.slice(0, getSurrogateOverviewCount()).map( */}
        <Grid container spacing={2}>
          {reports.map((report, index) => {
            return (
              <Grid item xs={12} sm={12} md={6} lg={4} xl={4} key={report.id}>
                <div className="surrogate-report flex-column">
                  <div className="flex-row surrogate-report-top space-between">
                    <div className="flex-column">
                      <span className="cinzel px-14 gray-secondary-text surrogate-report-type">
                        {report.parent.firstname} {report.parent.lastname}
                      </span>
                      <span className="cinzel px-16 surrogate-report-title">
                        {getReportCategory(report.reportCategory)} Report
                      </span>
                    </div>
                    <img
                      src={report.parent.image}
                      alt=""
                      className="surrogate-report-avatar"
                    />
                  </div>
                  <span className="surrogate-report-body poppins px-14 fw-300">
                    {report.details.length > 120
                      ? `${report.details.substring(0, 120)}...`
                      : report.details}
                  </span>
                  <div className="flex-row space-between">
                    <span className="flex-column">
                      <span
                        className={`surrogate-report-verdict flex-row poppins fw-500 px-13 surrogate-report-satisfactory`}
                        // className={`surrogate-report-verdict flex-row poppins fw-500 px-13 surrogate-report-${report.verdict.toLowerCase()}`}
                      >
                        Satisfactory
                        {/* {report.verdict} */}
                      </span>
                      <small className="px-10 fw-500 poppins">
                        Doctor’s Overall Remark
                      </small>
                    </span>

                    <span
                      className="px-14 poppins fw-500 pointer"
                      onClick={() => {
                        setSurrogateReportModalDetails({
                          state: true,
                          content: report,
                        });
                      }}
                    >
                      <u>View Full Report</u>
                    </span>
                  </div>
                </div>
              </Grid>
            );
          })}
        </Grid>
      </div>
      <Pagination />
    </div>
  );
}

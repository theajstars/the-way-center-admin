import { useRef, useState, useEffect, useContext } from "react";
import {
  Button,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Modal,
  Pagination,
  Select,
  Alert,
  Typography,
} from "@mui/material";
import {
  ReportCategories,
  SurrogateRecords,
  SurrogateReports,
} from "../../Assets/Data";
import { DefaultContext } from "../Dashboard";
import AishaAvatar from "../../Assets/IMG/AishaAvatar.svg";
import { PerformRequest } from "../../API/PerformRequests";
import SurrogateReportCreate from "../SurrogateReportCreate";

export default function Reports() {
  const ConsumerContext = useContext(DefaultContext);
  const [reports, setReports] = useState([]);
  const [isReportsLoading, setReportsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(4);
  const [totalPages, setTotalPages] = useState(1);

  const [parentID, setParentID] = useState("");
  const [surrogateID, setSurrogateID] = useState("");

  const getReports = async () => {
    setReportsLoading(true);
    const r = await PerformRequest.GetReports({
      page: currentPage,
      limit: pageSize,
    }).catch(() => {
      setReportsLoading(false);
    });
    setReportsLoading(false);
    console.log("Reports", r);
    if (r.data.status === "success") {
      setReports(r.data.data ?? []);
      setTotalPages(r.data.totalPages);
    }
  };
  const FilterReports = async () => {
    setReportsLoading(true);
    const r = await PerformRequest.GetReports({
      page: currentPage,
      limit: pageSize,
      parentID: parentID,
      surrogateID: surrogateID,
    }).catch(() => {
      setReportsLoading(false);
    });
    setReportsLoading(false);
    console.log("Reports", r);
    if (r.data.status === "success") {
      setReports(r.data.data ?? []);
      setTotalPages(r.data.totalPages);
    }
  };

  const [surrogateReportModalDetails, setSurrogateReportModalDetails] =
    useState({ state: false, content: null });

  const screenWidth = window.innerWidth;
  const getReportCategory = (category) => {
    const f = ReportCategories.filter((c) => c.value === category);
    if (f.length === 0) {
      return "Medical";
    } else {
      return f[0].name;
    }
  };

  useEffect(() => {
    FilterReports();
  }, [currentPage]);
  const defaultFullInputProps = {
    variant: "standard",
    spellCheck: false,
    className: "modal-input-full px-14",
  };
  const defaultHalfInputProps = {
    variant: "outlined",
    className: "filter-input px-14",
    spellCheck: false,
    size: "small",
  };
  const [showCreateReport, setShowCreateReport] = useState(false);

  const showSurrogateReportModal = (value) => {
    setShowCreateReport(value);
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
            <span className="fw-700 poppins px-16 capitalize">
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
          <div className="flex-row align-center">
            <span className="fw-400 poppins px-16">Health Center: &nbsp;</span>
            <span className="fw-700 poppins px-16">
              {surrogateReportModalDetails.content?.healthCenter}
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
      {showCreateReport && (
        <SurrogateReportCreate
          showSurrogateReportModal={showSurrogateReportModal}
          surrogate={undefined}
        />
      )}
      <div className="flex-row space-between align-center reports-top">
        <span className="poppins fw-500 px-18 surrogate-reports-head">
          Surrogate Reports
        </span>
        <div className="flex-row align-center">
          <Button
            variant="outlined"
            onClick={() => {
              showSurrogateReportModal(true);
            }}
          >
            Create Report
          </Button>
          &nbsp; &nbsp;
          <Button
            variant="contained"
            onClick={getReports}
            disabled={isReportsLoading}
          >
            {isReportsLoading ? (
              <>
                Refreshing <i className="far fa-spinner-third fa-spin" />
              </>
            ) : (
              <>Refresh</>
            )}
          </Button>
        </div>
      </div>
      <div className="flex-row align-center space-between filter-container">
        <div className="flex-row filter-inputs align-center">
          <FormControl variant="standard" {...defaultHalfInputProps}>
            <InputLabel id="demo-simple-select-standard-label">
              Parents Name
            </InputLabel>
            <Select
              labelId="demo-simple-select-standard-label"
              id="demo-simple-select-standard"
              value={parentID}
              onChange={(e) => {
                setParentID(e.target.value);
              }}
              label="Parents Name"
            >
              {ConsumerContext.Parents.map((parent, index) => {
                return (
                  <MenuItem value={parent.id} key={parent.id}>
                    {parent.primary.firstname} {parent.primary.lastname}
                  </MenuItem>
                );
              })}
            </Select>
          </FormControl>
          <FormControl variant="standard" {...defaultHalfInputProps}>
            <InputLabel id="demo-simple-select-standard-label">
              Surrogates Name
            </InputLabel>
            <Select
              labelId="demo-simple-select-standard-label"
              id="demo-simple-select-standard"
              value={surrogateID}
              onChange={(e) => {
                setSurrogateID(e.target.value);
              }}
              label="Surrogates Name"
            >
              {ConsumerContext.Surrogates.map((surrogate, index) => {
                return (
                  <MenuItem value={surrogate.id} key={surrogate.id}>
                    {surrogate.primary.firstname} {surrogate.primary.lastname}
                  </MenuItem>
                );
              })}
            </Select>
          </FormControl>
        </div>
        <div className="flex-row filter-buttons align-center">
          <Button variant="contained" onClick={FilterReports}>
            Filter &nbsp; <i className="far fa-search" />
          </Button>
          &nbsp;&nbsp;&nbsp;
          <Button
            variant="contained"
            disabled={parentID.length === 0 && surrogateID.length === 0}
            onClick={() => {
              setSurrogateID("");
              setParentID("");
            }}
          >
            Clear &nbsp; <i className="far fa-times" />
          </Button>
        </div>
      </div>
      <div className="flex-row align-center justify-center width-100">
        {reports.length === 0 && (
          <Alert severity="info">No reports found!</Alert>
        )}
      </div>
      <div className="surrogate-reports flex-row space-between">
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
      <br />
      <div className="flex-row width-100 align-center justify-center">
        <Pagination
          disabled={isReportsLoading}
          count={totalPages}
          onChange={(e, value) => {
            setCurrentPage(value);
          }}
        />
      </div>
    </div>
  );
}

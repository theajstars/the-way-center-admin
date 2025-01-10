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
import { useToasts } from "react-toast-notifications";
import {
  ReportCategories,
  SurrogateRecords,
  SurrogateReports,
} from "../../Assets/Data";
import { DefaultContext } from "../Dashboard";
import AishaAvatar from "../../Assets/IMG/AishaAvatar.svg";
import { PerformRequest } from "../../API/PerformRequests";
import SurrogateReportCreate from "../SurrogateReportCreate";
import { UploadFile } from "../../API/FetchData";

export default function Reports() {
  const { addToast } = useToasts();
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
  const fileIsLarge = () => {
    addToast("Max File Size: 1.5MB", { appearance: "error" });
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

  const [showAttachMedia, setShowAttachMedia] = useState(false);

  const [isUploadFile, setUploadFile] = useState(false);

  const reportFileUploadRef = useRef();
  const [reportFile, setReportFile] = useState(undefined);
  const [reportFileType, setReportFileType] = useState("");
  const [reportErrors, setReportErrors] = useState({
    reportFile: false,
    reportType: false,
  });
  const UpdateFileErrors = async () => {
    setReportErrors({
      reportFile: reportFile === undefined,
      reportType: reportFileType.length === 0,
    });
  };
  useEffect(() => {
    AttachMedia();
  }, [reportErrors]);
  const AttachMedia = async () => {
    if (isUploadFile) {
      const errors = Object.values(reportErrors).filter((e) => e === true);
      if (errors.length > 0) {
        setUploadFile(false);

        addToast("Please fill the form correctly", { appearance: "error" });
      } else {
        let reportFileFormData = new FormData();
        reportFileFormData.append(
          "file",
          reportFile,
          reportFile.name.toLowerCase().split(" ").join().replaceAll(",", "")
        );
        const fileUpload = await UploadFile({ formData: reportFileFormData });
        console.log(fileUpload.data.fileUrl);
        console.log(surrogateReportModalDetails);
        const data = {
          reportID: surrogateReportModalDetails.content.id,
          reportType: reportFileType,
          file: fileUpload.data.fileUrl,
        };
        const createMedia = await PerformRequest.AddReportFile(data).catch(
          () => {
            setUploadFile(false);
          }
        );
        console.log(createMedia);

        setUploadFile(false);
        const { message: responseMessage } = createMedia.data;
        if (createMedia.data.status === "failed") {
          addToast(responseMessage, { appearance: "error" });
        } else {
          addToast(responseMessage, { appearance: "success" });
          window.location.reload();
        }
      }
    }
  };
  return (
    <div className="home-page">
      <Typography className="poppins fw-500" variant="h5">
        ADMIN DASHBOARD
      </Typography>
      <input
        type="file"
        accept=".pdf, .jpg,  .png"
        ref={reportFileUploadRef}
        className="modal-image-hide"
        onChange={(e) => {
          console.log(e.target.files);
          const image = e.target.files[0];
          if (image.size > 1547220) {
            fileIsLarge();
          } else {
            setReportFile(image);
          }
        }}
      />
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
            &nbsp; &nbsp; &nbsp;
            <Button
              variant="outlined"
              onClick={() => {
                setShowAttachMedia(true);
              }}
            >
              Create Media
            </Button>
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
      {showAttachMedia && (
        <Modal
          open={showAttachMedia}
          onClose={(e, reason) => {
            if (reason === "backdropClick") {
              setShowAttachMedia(false);
            }
          }}
          className="default-modal-container flex-row"
        >
          {/* <div className="modal-form-container flex-column align-center width-100"> */}
          <div className="default-modal-content modal-scrollbar surrogate-report-modal flex-column align-center">
            <br />
            <div className="modal-form flex-column align-center width-100">
              <br />
              <span className="fw-600 poppins px-24">Report File</span>
              <br />
              <div className="flex-row space-between modal-input-row width-100">
                <FormControl
                  variant="standard"
                  {...defaultFullInputProps}
                  disabled={false}
                  // style={{ width: "100%" }}
                >
                  <InputLabel id="demo-simple-select-standard-label">
                    Select Report Type
                  </InputLabel>
                  <Select
                    labelId="demo-simple-select-standard-label"
                    id="demo-simple-select-standard"
                    value={reportFileType}
                    error={reportErrors.reportType}
                    onChange={(e) => {
                      setReportFileType(e.target.value);
                    }}
                    label="Select Report Type"
                  >
                    {ReportCategories.map((report, index) => {
                      return (
                        <MenuItem value={report.name} key={report.name}>
                          {report.name}
                        </MenuItem>
                      );
                    })}
                  </Select>
                </FormControl>
              </div>
              <br />
              <span className="flex-column align-center width-100">
                <div className="flex-column modal-form-file-container">
                  <span className="px-13 poppins fw-500">
                    &nbsp; &nbsp; Upload Document
                  </span>
                  <div
                    className="flex-row modal-form-file width-100"
                    style={{
                      borderColor: reportErrors.reportFile ? "red" : "#9a9ab0",
                    }}
                  >
                    <div className="px-13 poppins fw-500">
                      {reportFile ? (
                        reportFile.name
                      ) : (
                        <span>No File Selected</span>
                      )}
                    </div>
                    <span
                      className="px-13 poppins fw-500 modal-form-file-btn flex-row pointer"
                      onClick={() => {
                        reportFileUploadRef.current.click();
                      }}
                    >
                      Upload File
                    </span>
                  </div>
                  <span className="px-13 poppins fw-500 modal-form-file-about">
                    &nbsp; &nbsp; Acceptable format :PDF/JPG/PNG
                  </span>
                </div>
              </span>
            </div>
            <div className="flex-column modal-form-right space-between align-center">
              <br />
              <div className="width-100 flex-column align-center">
                <span
                  className="purple-btn-default px-16 poppins pointer width-100 uppercase modal-form-submit surrogate-form-btn"
                  onClick={() => {
                    setShowAttachMedia(false);
                  }}
                >
                  Cancel &nbsp; <i className="far fa-long-arrow-alt-left" />
                </span>
                <br />
                <Button
                  disabled={isUploadFile}
                  className="purple-btn-default px-16 poppins pointer width-100 uppercase modal-form-submit surrogate-form-btn"
                  onClick={() => {
                    UpdateFileErrors();
                    setUploadFile(true);
                  }}
                >
                  Upload Report &nbsp;{" "}
                  {isUploadFile ? (
                    <i className="far fa-spinner-third fa-spin" />
                  ) : (
                    <i className="far fa-long-arrow-alt-right" />
                  )}
                </Button>
              </div>
            </div>
          </div>
        </Modal>
      )}
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

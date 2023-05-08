import { useState, useRef, useContext } from "react";

import { useNavigate } from "react-router-dom";

import { Typography, Modal, Button } from "@mui/material";
import { motion } from "framer-motion";
import { useKeenSlider } from "keen-slider/react";
import "keen-slider/keen-slider.min.css";

import {
  initialParent,
  initialSurrogate,
  RecentParents,
  SurrogateRecords,
  SurrogateReports,
} from "../../Assets/Data";

import AishaAvatar from "../../Assets/IMG/AishaAvatar.svg";
import PurpleFlower from "../../Assets/IMG/PurpleFlower.svg";
import YoutubeEmbed from "../YoutubeEmbed";
import AccountManagement from "../AccountManagement";
import Footer from "../Footer";
import DashboardOverview from "../DashboardOverview";
import SurrogateUpdate from "../SurrogateUpdate";
import SurrogateProfileView from "../SurrogateProfileView";
import ParentProfileView from "../ParentProfileView";
import { DefaultContext } from "../Dashboard";

export default function Home() {
  const navigate = useNavigate();
  const ContextConsumer = useContext(DefaultContext);
  console.log(ContextConsumer);
  const ModifySurrogatesRef = useRef();
  const [SurrogateRecordsToDisplay, setSurrogateRecordsToDisplay] = useState(
    SurrogateRecords.slice(0, 4)
  );
  const ModifySurrogateRecordsToDisplay = () => {
    if (SurrogateRecordsToDisplay.length === SurrogateRecords.length) {
      setSurrogateRecordsToDisplay(SurrogateRecords.slice(0, 4));
    } else {
      setSurrogateRecordsToDisplay(SurrogateRecords);
    }
  };

  const [surrogateReportModalDetails, setSurrogateReportModalDetails] =
    useState({ state: false, content: null });

  const screenWidth = window.innerWidth;
  console.log(screenWidth);

  const [currentSlide, setCurrentSlide] = useState(0);
  const [loaded, setLoaded] = useState(false);
  const [sliderRef, instanceRef] = useKeenSlider({
    initial: 0,
    loop: true,
    slides: {
      perView: screenWidth > 1400 ? 3 : screenWidth > 900 ? 2 : 1,
      spacing: 15,
    },
    slideChanged(slider) {
      setCurrentSlide(slider.track.details.rel);
    },
    created() {
      setLoaded(true);
    },
  });
  const getSurrogateOverviewCount = () => {
    if (screenWidth > 1450) {
      return 3;
    } else {
      return 2;
    }
  };

  const [isViewSurrogate, setViewSurrogate] = useState(false);
  const [isViewParent, setViewParent] = useState(false);

  const [surrogate, setCurrentSurrogate] = useState(initialSurrogate);
  const showViewSurrogateModal = (value) => {
    setViewSurrogate(value);
  };
  const [parent, setCurrentParent] = useState(initialParent);
  const showViewParentModal = (value) => {
    setViewParent(value);
  };
  return (
    <div className="home-page">
      <Typography className="poppins fw-500" variant="h5">
        ADMIN DASHBOARD
      </Typography>
      <br />
      <br />
      <div className="home-container flex-row">
        <div className="home-container-right flex-column">
          <DashboardOverview />
          <div className="recent-blocks flex-row">
            <div className="recent-block flex-column">
              <span className="px-16 cinzel">RECENT PARENTS</span>
              {isViewParent && (
                <ParentProfileView
                  showViewParentModal={showViewParentModal}
                  parent={parent}
                />
              )}
              <br />
              <div className="flex-column">
                {ContextConsumer.Parents.map((parent, index) => {
                  return (
                    <>
                      <span
                        key={parent.primary.email}
                        onClick={() => {
                          setCurrentParent(parent);
                          showViewParentModal(true);
                        }}
                        className="poppins fw-500 px-18 capitalize underline pointer recent-block-text"
                      >
                        {parent.primary.firstname} {parent.primary.lastname}
                      </span>
                    </>
                  );
                })}
              </div>
              <div className="flex-row width-100 justify-end align-center">
                <span
                  className="px-16 fw-500 underline pointer poppins"
                  onClick={() => {
                    navigate("/dashboard/parents");
                  }}
                >
                  View All Parents
                </span>
              </div>
            </div>
            <div className="recent-block flex-column">
              <span className="px-16 cinzel">RECENT SURROGATES</span>
              <br />
              {isViewSurrogate && (
                <SurrogateProfileView
                  showViewSurrogateModal={showViewSurrogateModal}
                  surrogate={surrogate}
                />
              )}
              <div className="flex-column">
                {ContextConsumer.Surrogates.map((surrogate, index) => {
                  return (
                    <>
                      <span
                        key={surrogate.primary.email}
                        onClick={() => {
                          setCurrentSurrogate(surrogate);
                          showViewSurrogateModal(true);
                        }}
                        className="poppins fw-500 px-18 capitalize underline pointer recent-block-text"
                      >
                        {surrogate.primary.firstname}{" "}
                        {surrogate.primary.lastname}
                      </span>
                    </>
                  );
                })}
              </div>
              <div className="flex-row width-100 justify-end align-center">
                <span
                  className="px-16 fw-500 underline pointer poppins"
                  onClick={() => {
                    navigate("/dashboard/surrogates");
                  }}
                >
                  View All Surrogates
                </span>
              </div>
            </div>
          </div>

          <div className="flex-row space-between align-center">
            <span className="poppins fw-500 px-18 surrogate-reports-head">
              Your Surrogate Reports
              {/* Your Surrogate Reports from TWC */}
            </span>
            <span className="poppins fw-500 px-16 purple-default-text view-more-reports">
              View More
            </span>
          </div>
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
                  <span className="cinzel px-16 gray-secondary-text surrogate-report-type">
                    {surrogateReportModalDetails.content?.type}
                  </span>
                  <span className="cinzel px-19 surrogate-report-title">
                    {surrogateReportModalDetails.content?.title}
                  </span>
                </div>
                &nbsp; &nbsp; &nbsp;
                <img
                  src={AishaAvatar}
                  alt=""
                  className="surrogate-report-avatar"
                />
              </div>
              <br />
              <br />
              <span className="fw-700 cinzel px-19">FULL REPORT</span>
              <br />
              <br />
              <span className="px-15 gray-secondary-text poppins full-surrogate-report-body modal-scrollbar">
                {surrogateReportModalDetails.content?.body}
                <br />
                <br />
                {surrogateReportModalDetails.content?.body}
                <br />
                <br />
                {surrogateReportModalDetails.content?.body}
                <br />
                <br />
                {surrogateReportModalDetails.content?.body}
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
          <div className="surrogate-reports flex-row space-between">
            {SurrogateReports.slice(0, getSurrogateOverviewCount()).map(
              (report, index) => {
                return (
                  <div className="surrogate-report flex-column" key={index}>
                    <div className="flex-row surrogate-report-top space-between">
                      <div className="flex-column">
                        <span className="cinzel px-14 gray-secondary-text surrogate-report-type">
                          {report.type}
                        </span>
                        <span className="cinzel px-16 surrogate-report-title">
                          {report.title}
                        </span>
                      </div>
                      <img
                        src={AishaAvatar}
                        alt=""
                        className="surrogate-report-avatar"
                      />
                    </div>
                    <span className="surrogate-report-body poppins px-14 fw-300">
                      {report.body.length > 120
                        ? `${report.body.substring(0, 120)}...`
                        : report.body}
                    </span>
                    <div className="flex-row space-between">
                      <span className="flex-column">
                        <span
                          className={`surrogate-report-verdict flex-row poppins fw-500 px-13 surrogate-report-${report.verdict.toLowerCase()}`}
                        >
                          {report.verdict}
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
                );
              }
            )}
          </div>
          {/* <>
            <span className="poppins fw-500 px-18">Your Surrogate Media</span>
            <div ref={sliderRef} className="keen-slider">
              <div className="keen-slider__slide surrogate-media-item">
                <YoutubeEmbed embedId={"CuSxk_DNau8"} />
              </div>
              <div className="keen-slider__slide surrogate-media-item">
                <YoutubeEmbed embedId={"CuSxk_DNau8"} />
              </div>
              <div className="keen-slider__slide surrogate-media-item">
                <YoutubeEmbed embedId={"CuSxk_DNau8"} />
              </div>
              <div className="keen-slider__slide surrogate-media-item">
                <YoutubeEmbed embedId={"CuSxk_DNau8"} />
              </div>
            </div>
            <br />
            {loaded && instanceRef.current && (
              <center>
                <span
                  className="px-30 pointer surrogate-media-arrow"
                  onClick={(e) =>
                    e.stopPropagation() || instanceRef.current?.prev()
                  }
                  disabled={currentSlide === 0}
                >
                  <i className="fas fa-long-arrow-alt-left"></i>
                </span>

                <span
                  className="px-30 pointer surrogate-media-arrow"
                  onClick={(e) =>
                    e.stopPropagation() || instanceRef.current?.next()
                  }
                  disabled={
                    currentSlide ===
                    instanceRef.current.track.details.slides.length - 1
                  }
                >
                  <i className="fas fa-long-arrow-alt-right"></i>
                </span>
              </center>
            )}
            <AccountManagement />
          </> */}
        </div>
      </div>
    </div>
  );
}

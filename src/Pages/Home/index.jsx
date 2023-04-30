import { useState, useRef } from "react";

import { useNavigate } from "react-router-dom";

import { Typography, Modal } from "@mui/material";
import { motion } from "framer-motion";
import { useKeenSlider } from "keen-slider/react";
import "keen-slider/keen-slider.min.css";

import {
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

export default function Home() {
  const navigate = useNavigate();
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

  const showViewSurrogateModal = (value) => {
    setViewSurrogate(value);
  };
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
        {/* <div className="home-container-left flex-column">
          <img src={AishaAvatar} alt="" className="home-avatar" />
          <span className="home-username fw-500 cinzel px-23">
            Aisha Immanuel
          </span>
          <span className="home-usertag poppins px-16 fw-500">
            My Surrogate
          </span>
          <hr className="home-divider" />
          <motion.div
            initial={false}
            animate={{
              maxHeight:
                SurrogateRecords.length === SurrogateRecordsToDisplay.length
                  ? "100%"
                  : "fit-content",
            }}
            className="surrogate-record-overview flex-column"
          >
            <span className="fw-500 black-default-text poppins px-19">
              Surrogate Record
            </span>
            {SurrogateRecordsToDisplay.map((record, index) => {
              return (
                <div
                  className="flex-row surrogate-record-overview-item"
                  key={index}
                >
                  <div className="flex-row surrogate-record-overview-icon">
                    <img
                      src={PurpleFlower}
                      className="surrogate-record-overview-image"
                      alt=""
                    />
                  </div>
                  &nbsp; &nbsp; &nbsp;
                  <span className="surrogate-record-overview-text flex-column">
                    <span className="fw-500 poppins px-15 ">
                      {record.title}{" "}
                      <span className="fw-600">{record.important}</span>
                    </span>
                    <span className="poppins fw-400 gray-primary-text px-14">
                      {record.time} ago
                    </span>
                  </span>
                </div>
              );
            })}
          </motion.div>
          <span
            className="more-surrogates black-default-text px-20 flex-row"
            onClick={ModifySurrogateRecordsToDisplay}
            ref={ModifySurrogatesRef}
          >
            <motion.span
              initial={false}
              animate={{
                rotate:
                  SurrogateRecords.length === SurrogateRecordsToDisplay.length
                    ? "0deg"
                    : "180deg",
              }}
            >
              <i className={`far fa-long-arrow-alt-up`}></i>
            </motion.span>
          </span>
        </div> */}

        <div className="home-container-right flex-column">
          <DashboardOverview />
          <div className="recent-blocks flex-row">
            <div className="recent-block flex-column">
              <span className="px-16 cinzel">RECENT PARENTS</span>
              {isViewParent && (
                <ParentProfileView showViewParentModal={showViewParentModal} />
              )}
              <br />
              <div className="flex-column">
                {RecentParents.map((parent, index) => {
                  return (
                    <>
                      <span
                        key={index}
                        onClick={() => {
                          showViewParentModal(true);
                        }}
                        className="poppins fw-500 px-18 uppercase underline pointer recent-block-text"
                      >
                        {parent.name}
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
                />
              )}
              <div className="flex-column">
                {RecentParents.map((parent, index) => {
                  return (
                    <>
                      <span
                        key={index}
                        onClick={() => {
                          showViewSurrogateModal(true);
                        }}
                        className="poppins fw-500 px-18 uppercase underline pointer recent-block-text"
                      >
                        {parent.name}
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

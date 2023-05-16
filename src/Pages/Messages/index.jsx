import { useEffect, useState, useContext, useRef } from "react";
import {
  Typography,
  Card,
  CardContent,
  Button,
  CardActions,
} from "@mui/material";
import {
  InboxMessages,
  ParentMessages,
  SampleMessages,
} from "../../Assets/Data";
import { motion } from "framer-motion";
import { PerformRequest } from "../../API/PerformRequests";
import { DefaultContext } from "../Dashboard";
import { getFullDate } from "../../App";
import { useToasts } from "react-toast-notifications";
import { UploadFile } from "../../API/FetchData";

export default function Messages() {
  const ContextConsumer = useContext(DefaultContext);
  const { addToast, removeAllToasts } = useToasts();
  const fileUploadRef = useRef();
  const fileIsLarge = () => {
    addToast("Max File Size: 1.5MB", { appearance: "error" });
  };

  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [messages, setMessages] = useState([]);
  const [messageText, setMessageText] = useState("");

  const [currentParent, setCurrentParent] = useState(undefined);
  const [currentReference, setCurrentReference] = useState(undefined);

  const [searchString, setSearchString] = useState("");
  const [currentMessages, setCurrentMessages] = useState([]);
  const [messageSending, setMessageSending] = useState(false);
  const [messagesLoading, setMessagesLoading] = useState(false);

  const getMessageList = async () => {
    const r = await PerformRequest.GetMessageList().catch(() => {});
    console.log(r);
    setMessages(r.data.data ?? []);
  };
  const getParentMessages = async () => {
    setMessagesLoading(true);
    const r = await PerformRequest.CreateMessageReference({
      parentID: currentParent.id,
    }).catch(() => {
      setMessagesLoading(false);
    });
    if (r.data.message === "Message has been created for this parent") {
      const ref = r.data.data.reference;
      setCurrentReference(ref);
      const m = await PerformRequest.GetCurrentMessages(ref).catch(() => {
        setMessagesLoading(false);
        removeAllToasts();
        addToast("An error occured!", { appearance: "error" });
      });
      setMessagesLoading(false);
      console.log(m);
      setCurrentMessages(m.data.data ?? []);
    }
    console.log(r);
  };
  useEffect(() => {
    console.log(messages);
  }, [messages]);
  useEffect(() => {
    if (currentParent) {
      getParentMessages();
    }
  }, [currentParent]);
  useEffect(() => {
    getMessageList();
  }, []);

  const AddMessageFile = async (file) => {
    setMessageSending(true);
    let fileFormData = new FormData();
    fileFormData.append(
      "file",
      file,
      file.name.toLowerCase().split(" ").join().replaceAll(",", "")
    );
    const uploadMessageFile = await UploadFile({
      formData: fileFormData,
    }).catch(() => {
      setMessageSending(false);
      addToast("An error occured!", { appearance: "error" });
    });
    if (uploadMessageFile.data.status === "success") {
      const { fileUrl } = uploadMessageFile.data;
      const r = await PerformRequest.SendMessageFile({
        reference: currentReference,
        media: fileUrl,
      }).catch(() => {
        setMessageSending(false);
        addToast("An error occured!", { appearance: "error" });
      });
      setMessageSending(false);
      console.log(r);
      const m = await PerformRequest.GetCurrentMessages(currentReference).catch(
        () => {
          removeAllToasts();
          addToast("An error occured!", { appearance: "error" });
        }
      );

      setCurrentMessages(m.data.data ?? []);
    } else {
      setMessageSending(false);
      addToast("An error occured!", { appearance: "error" });
    }
    console.log(uploadMessageFile);
  };
  const SendMessage = async () => {
    if (messageText.length === 0) {
      addToast("Please enter a message", { appearance: "warning" });
    } else {
      setMessageSending(true);
      const r = await PerformRequest.SendMessage({
        post: messageText,
        reference: currentReference,
      }).catch(() => {
        setMessageSending(false);
        addToast("An error occured!", { appearance: "error" });
      });
      setMessageSending(false);
      if (r.data.status === "success") {
        setMessageText("");
        const m = await PerformRequest.GetCurrentMessages(
          currentReference
        ).catch(() => {
          removeAllToasts();
          addToast("An error occured!", { appearance: "error" });
        });

        setCurrentMessages(m.data.data ?? []);
      }
      console.log(r);
    }
  };

  return (
    <>
      <input
        type="file"
        accept=".jpg, .png, .pdf"
        ref={fileUploadRef}
        className="modal-image-hide"
        onChange={(e) => {
          console.log(e.target.files);
          const file = e.target.files[0];
          if (file.size > 1547220) {
            fileIsLarge();
          } else {
            AddMessageFile(file);
          }
        }}
      />

      <div className="home-page">
        <Typography className="poppins fw-500" variant="h5">
          ADMIN DASHBOARD
        </Typography>
        <br />
        <br />
        <span
          className="toggle-messages px-18 pointer"
          onClick={() => {
            setSidebarOpen(!isSidebarOpen);
          }}
        >
          <i className="far fa-users" />
        </span>
        <div className="messages-page-container flex-row">
          <>
            <motion.div
              className="messages-sidebar large-messages-sidebar flex-column"
              initial={false}
              animate={{
                left: isSidebarOpen ? "0px" : "-500px",
              }}
            >
              <div className="messages-search-container align-center flex-row">
                <span className="messages-search-icon px-15">
                  <i className="far fa-search" />
                </span>
                <input
                  type="search"
                  placeholder="Search"
                  spellCheck={false}
                  value={searchString}
                  onChange={(e) => setSearchString(e.target.value)}
                  className="messages-search poppins px-15"
                />
              </div>

              <div className="sidebar-section flex-column width-100">
                <span className="px-20 poppins fw-600">Parents</span>

                {ContextConsumer.Parents.map((parent) => {
                  return (
                    <div
                      className="sidebar-item flex-row align-center space-between width-100"
                      onClick={() => {
                        setCurrentParent(parent);
                        setSidebarOpen(false);
                      }}
                    >
                      <div className="sidebar-item-left flex-row align-center width-100">
                        <img
                          src={parent.primary.image}
                          alt=""
                          className="sidebar-item-image"
                        />
                        <div className="flex-column sidebar-item-details">
                          <span className="px-15 fw-500 poppins capitalize">
                            {parent.primary.firstname}&nbsp;
                            {parent.primary.lastname}
                          </span>
                          <span className="px-12 poppins">&nbsp;</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </motion.div>

            {currentParent && (
              <div className="chat-section large-chat-section flex-column">
                <div className="chat-section-top width-100 flex-column">
                  <div className="flex-row chat-header align-center space-between">
                    <div className="chat-header-left flex-row align-center">
                      <img
                        src={currentParent.primary.image}
                        alt=""
                        className="chat-section-avatar"
                      />
                      <div className="flex-column">
                        <span className="poppins px-16 fw-500">
                          {currentParent.primary.firstname}{" "}
                          {currentParent.primary.lastname}
                        </span>
                      </div>
                    </div>
                    <span className="chat-menu-btn flex-row align-center justify-center pointer px-16 purple-default-text">
                      <i className="fas fa-ellipsis-v" />
                    </span>
                  </div>
                  <div className="chat-messages flex-column width-100">
                    {messagesLoading ? (
                      <>
                        <center>
                          <span className="px-25">
                            <i className="far fa-spinner-third fa-spin"></i>
                          </span>
                        </center>
                      </>
                    ) : (
                      <>
                        {currentMessages.map((message, index) => {
                          return (
                            <>
                              {message.sender.fullname === "The Way Center" ? (
                                <SentMessage
                                  time={message.createdOn}
                                  message={message.post}
                                  isMedia={message.media.length > 0}
                                  media={message.media}
                                />
                              ) : (
                                <ReceivedMessage
                                  time={message.createdOn}
                                  message={message.post}
                                  isMedia={message.media.length > 0}
                                  media={message.media}
                                />
                              )}
                            </>
                          );
                        })}
                      </>
                    )}
                  </div>
                </div>
                <div className="chat-messages-bottom flex-row align-center width-100 space-between">
                  <div className="send-message-container flex-row align-center">
                    <input
                      type="text"
                      placeholder="Type your message here..."
                      spellCheck={false}
                      value={messageText}
                      onChange={(e) => setMessageText(e.target.value)}
                      className="send-message-input poppins px-15"
                      onKeyDown={(e) => {
                        // Check if key is enter key
                        if (e.keyCode === 13) {
                          SendMessage();
                        }
                      }}
                    />
                    <span
                      className="px-20 pointer"
                      onClick={() => {
                        fileUploadRef.current.click();
                      }}
                    >
                      <i className="far fa-paperclip" />
                    </span>
                  </div>
                  <button
                    className="send-message-btn uppercase poppins white-text px-15"
                    onClick={SendMessage}
                    disabled={messageSending}
                    style={{
                      opacity: messageSending ? "0.5" : "1",
                    }}
                  >
                    {messageSending ? (
                      <i className="far fa-spinner-third fa-spin" />
                    ) : (
                      <>Send Message</>
                    )}
                  </button>
                </div>
              </div>
            )}
          </>
        </div>
      </div>
    </>
  );
}
function ReceivedMessage({ time, message, isMedia, media }) {
  function mightDownload() {
    if (isMedia) {
      const a = document.createElement("a");
      a.href = media;
      a.target = "_BLANK";
      a.click();
    }
  }
  return (
    <div className="flex-column">
      <div className="flex-row received-message-container">
        <div className="message-badge received-message-badge"></div>
        <span className="message-text poppins px-15 received-message-text">
          {isMedia ? (
            <div
              className="flex-row align-center pointer"
              onClick={mightDownload}
            >
              <i className="far fa-cloud-download" /> &nbsp; Dowload
            </div>
          ) : (
            <>{message}</>
          )}
        </span>
      </div>
      <span className="px-13 poppins gray-secondary-text message-time received-message-time">
        {getFullDate(time)}
      </span>
    </div>
  );
}
function SentMessage({ time, message, isMedia, media }) {
  function mightDownload() {
    if (isMedia) {
      const a = document.createElement("a");
      a.href = media;
      a.target = "_BLANK";
      a.click();
    }
  }
  return (
    <div className="flex-column align-end">
      <div className="flex-row sent-message-container">
        <span className="message-text poppins px-15 sent-message-text white-text">
          {isMedia ? (
            <div
              className="flex-row align-center pointer"
              onClick={mightDownload}
            >
              <i className="far fa-cloud-download" /> &nbsp; Dowload
            </div>
          ) : (
            <>{message}</>
          )}
        </span>
        <div className="message-badge sent-message-badge"></div>
      </div>

      <span className="px-13 poppins gray-secondary-text message-time sent-message-time">
        {getFullDate(time)}
      </span>
    </div>
  );
}

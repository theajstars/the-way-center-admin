import { Typography } from "@mui/material";
import { useState } from "react";
import {
  InboxMessages,
  ParentMessages,
  SampleMessages,
} from "../../Assets/Data";
import { motion } from "framer-motion";

export default function Messages() {
  const isSmallScreen = window.innerWidth <= 1050;

  const [currentSmallView, setCurrentSmallView] = useState("sidebar");
  const [currentUser, setCurrentUser] = useState({ name: "", image: "" });
  const [searchString, setSearchString] = useState("");
  return (
    <>
      <span
        className="toggle-messages px-18 pointer"
        onClick={() => {
          setCurrentSmallView("sidebar");
          // setCurrentSmallView(
          //   currentSmallView === "sidebar" ? "chat-section" : "sidebar"
          // );
        }}
      >
        <i className="far fa-users" />
      </span>
      <div className="home-page">
        <Typography className="poppins fw-500" variant="h5">
          ADMIN DASHBOARD
        </Typography>
        <br />
        <br />
        <div className="messages-page-container flex-row">
          {isSmallScreen ? (
            <>
              <motion.div
                initial={false}
                animate={{
                  display: currentSmallView === "sidebar" ? "flex" : "none",
                }}
                className="messages-sidebar small-messages-sidebar flex-column"
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
                  <span className="px-20 poppins fw-600">Inbox</span>
                  <div
                    className="sidebar-item flex-row align-center space-between width-100"
                    onClick={() => {
                      setCurrentSmallView("chat-section");
                      setCurrentUser({
                        name: "Aliena Thomas",
                        image:
                          "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS_CQ3IrjZcisW-FO12jxRtSA9shZYuykqA2w&usqp=CAU",
                      });
                    }}
                  >
                    <div className="sidebar-item-left flex-row align-center">
                      <img
                        src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS_CQ3IrjZcisW-FO12jxRtSA9shZYuykqA2w&usqp=CAU"
                        alt=""
                        className="sidebar-item-image"
                      />
                      <div className="flex-column sidebar-item-details">
                        <span className="px-15 fw-500 poppins">
                          Aliena Thomas
                        </span>
                        <span className="px-12 poppins">
                          What is the status report with...
                        </span>
                      </div>
                    </div>
                    <div className="flex-row align-center">
                      <span className="px-13 poppins gray-secondary-text">
                        Today, <br /> 12: 43pm
                      </span>
                      <span className="sidebar-item-badge poppins px-13 flex-row align-center justify-center">
                        4
                      </span>
                    </div>
                  </div>
                  {InboxMessages.map((inboxMessage) => {
                    return (
                      <div
                        className="sidebar-item flex-row align-center space-between width-100"
                        onClick={() => {
                          setCurrentSmallView("chat-section");
                          setCurrentUser(inboxMessage);
                        }}
                      >
                        <div className="sidebar-item-left flex-row align-center">
                          <img
                            src={inboxMessage.image}
                            alt=""
                            className="sidebar-item-image"
                          />
                          <div className="flex-column sidebar-item-details">
                            <span className="px-15 fw-500 poppins">
                              {inboxMessage.name}
                            </span>
                            <span className="px-12 poppins">
                              {inboxMessage.message}
                            </span>
                          </div>
                        </div>
                        <div className="flex-row align-center">
                          <span className="px-13 poppins gray-secondary-text">
                            Today, <br /> 12: 43pm
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
                <div className="sidebar-section flex-column width-100">
                  <span className="px-20 poppins fw-600">Parents</span>

                  {ParentMessages.map((inboxMessage) => {
                    return (
                      <div
                        className="sidebar-item flex-row align-center space-between width-100"
                        onClick={() => {
                          setCurrentSmallView("chat-section");
                          setCurrentUser(inboxMessage);
                        }}
                      >
                        <div className="sidebar-item-left flex-row align-center">
                          <img
                            src={inboxMessage.image}
                            alt=""
                            className="sidebar-item-image"
                          />
                          <div className="flex-column sidebar-item-details">
                            <span className="px-15 fw-500 poppins">
                              {inboxMessage.name}
                            </span>
                            <span className="px-12 poppins">&nbsp;</span>
                          </div>
                        </div>
                        <div className="flex-row align-center">
                          <span className="px-13 poppins gray-secondary-text">
                            Today, <br /> 12: 43pm
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </motion.div>

              <motion.div
                initial={false}
                animate={{
                  display:
                    currentSmallView === "chat-section" ? "flex" : "none",
                }}
                className="chat-section small-chat-section flex-column"
              >
                <div className="chat-section-top width-100 flex-column">
                  <div className="flex-row chat-header align-center space-between">
                    <div className="chat-header-left flex-row align-center">
                      <img
                        src="https://www.w3schools.com/howto/img_avatar2.png"
                        alt=""
                        className="chat-section-avatar"
                      />
                      <div className="flex-column">
                        <span className="poppins px-16 fw-500">
                          Shola Thomas
                        </span>
                        <span className="poppins px-12 gray-secondary-text">
                          Online - Last seen, 2:02pm
                        </span>
                      </div>
                    </div>
                    <span className="chat-menu-btn flex-row align-center justify-center pointer px-16 purple-default-text">
                      <i className="fas fa-ellipsis-v" />
                    </span>
                  </div>
                  <div className="chat-messages flex-column width-100">
                    {SampleMessages.map((message, index) => {
                      return (
                        <>
                          {message.type === "sent" ? (
                            <SentMessage
                              time={message.date}
                              message={message.text}
                            />
                          ) : (
                            <ReceivedMessage
                              time={message.date}
                              message={message.text}
                            />
                          )}
                        </>
                      );
                    })}
                  </div>
                </div>
                <div className="chat-messages-bottom flex-row align-center width-100 space-between">
                  <div className="send-message-container flex-row align-center">
                    <input
                      type="text"
                      placeholder="Type your message here..."
                      spellCheck={false}
                      className="send-message-input poppins px-15"
                    />
                    <span className="px-20 pointer">
                      <i className="far fa-paperclip" />
                    </span>
                  </div>
                  <button className="send-message-btn uppercase poppins white-text px-15">
                    Send Message
                  </button>
                </div>
              </motion.div>
            </>
          ) : (
            <>
              <div className="messages-sidebar large-messages-sidebar flex-column">
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
                  <span className="px-20 poppins fw-600">Inbox</span>
                  <div className="sidebar-item flex-row align-center space-between width-100">
                    <div className="sidebar-item-left flex-row align-center">
                      <img
                        src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS_CQ3IrjZcisW-FO12jxRtSA9shZYuykqA2w&usqp=CAU"
                        alt=""
                        className="sidebar-item-image"
                      />
                      <div className="flex-column sidebar-item-details">
                        <span className="px-15 fw-500 poppins">
                          Aliena Thomas
                        </span>
                        <span className="px-12 poppins">
                          What is the status report with...
                        </span>
                      </div>
                    </div>
                    <div className="flex-row align-center">
                      <span className="px-13 poppins gray-secondary-text">
                        Today, <br /> 12: 43pm
                      </span>
                      <span className="sidebar-item-badge poppins px-13 flex-row align-center justify-center">
                        4
                      </span>
                    </div>
                  </div>
                  {InboxMessages.map((inboxMessage) => {
                    return (
                      <div className="sidebar-item flex-row align-center space-between width-100">
                        <div className="sidebar-item-left flex-row align-center">
                          <img
                            src={inboxMessage.image}
                            alt=""
                            className="sidebar-item-image"
                          />
                          <div className="flex-column sidebar-item-details">
                            <span className="px-15 fw-500 poppins">
                              {inboxMessage.name}
                            </span>
                            <span className="px-12 poppins">
                              {inboxMessage.message}
                            </span>
                          </div>
                        </div>
                        <div className="flex-row align-center">
                          <span className="px-13 poppins gray-secondary-text">
                            Today, <br /> 12: 43pm
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
                <div className="sidebar-section flex-column width-100">
                  <span className="px-20 poppins fw-600">Parents</span>

                  {ParentMessages.map((inboxMessage) => {
                    return (
                      <div className="sidebar-item flex-row align-center space-between width-100">
                        <div className="sidebar-item-left flex-row align-center">
                          <img
                            src={inboxMessage.image}
                            alt=""
                            className="sidebar-item-image"
                          />
                          <div className="flex-column sidebar-item-details">
                            <span className="px-15 fw-500 poppins">
                              {inboxMessage.name}
                            </span>
                            <span className="px-12 poppins">&nbsp;</span>
                          </div>
                        </div>
                        <div className="flex-row align-center">
                          <span className="px-13 poppins gray-secondary-text">
                            Today, <br /> 12: 43pm
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="chat-section large-chat-section flex-column">
                <div className="chat-section-top width-100 flex-column">
                  <div className="flex-row chat-header align-center space-between">
                    <div className="chat-header-left flex-row align-center">
                      <img
                        src="https://www.w3schools.com/howto/img_avatar2.png"
                        alt=""
                        className="chat-section-avatar"
                      />
                      <div className="flex-column">
                        <span className="poppins px-16 fw-500">
                          Shola Thomas
                        </span>
                        <span className="poppins px-12 gray-secondary-text">
                          Online - Last seen, 2:02pm
                        </span>
                      </div>
                    </div>
                    <span className="chat-menu-btn flex-row align-center justify-center pointer px-16 purple-default-text">
                      <i className="fas fa-ellipsis-v" />
                    </span>
                  </div>
                  <div className="chat-messages flex-column width-100">
                    {SampleMessages.map((message, index) => {
                      return (
                        <>
                          {message.type === "sent" ? (
                            <SentMessage
                              time={message.date}
                              message={message.text}
                            />
                          ) : (
                            <ReceivedMessage
                              time={message.date}
                              message={message.text}
                            />
                          )}
                        </>
                      );
                    })}
                  </div>
                </div>
                <div className="chat-messages-bottom flex-row align-center width-100 space-between">
                  <div className="send-message-container flex-row align-center">
                    <input
                      type="text"
                      placeholder="Type your message here..."
                      spellCheck={false}
                      className="send-message-input poppins px-15"
                    />
                    <span className="px-20 pointer">
                      <i className="far fa-paperclip" />
                    </span>
                  </div>
                  <button className="send-message-btn uppercase poppins white-text px-15">
                    Send Message
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}
function ReceivedMessage({ time, message }) {
  return (
    <div className="flex-column">
      <div className="flex-row received-message-container">
        <div className="message-badge received-message-badge"></div>
        <span className="message-text poppins px-15 received-message-text">
          {message}
        </span>
      </div>
      <span className="px-13 poppins gray-secondary-text message-time received-message-time">
        {time}
      </span>
    </div>
  );
}
function SentMessage({ time, message }) {
  return (
    <div className="flex-column align-end">
      <div className="flex-row sent-message-container">
        <span className="message-text poppins px-15 sent-message-text white-text">
          {message}
        </span>
        <div className="message-badge sent-message-badge"></div>
      </div>

      <span className="px-13 poppins gray-secondary-text message-time sent-message-time">
        {time}
      </span>
    </div>
  );
}
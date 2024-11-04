import { useState, useRef, useContext } from "react";

import { useNavigate, useParams } from "react-router-dom";

import {
  Modal,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
} from "@mui/material";
import { PerformRequest } from "../../API/PerformRequests";
import { useToasts } from "react-toast-notifications";

import ImageSelectorPlaceholder from "../../Assets/IMG/ImageSelectorPlaceholder.svg";
import Confirmation from "../Confirmation";

import { DefaultContext } from "../Dashboard";
import { CountriesList, initialParent } from "../../Assets/Data";
import { validatePhone } from "../../Lib/Validate";
import { validateEmail } from "../../App";
import { useEffect } from "react";
import { UploadFile } from "../../API/FetchData";

export default function ParentUpdate({
  showUpdateParentModal,
  // parent = initialParent,
}) {
  const navigate = useNavigate();
  const params = useParams();
  const ContextConsumer = useContext(DefaultContext);
  const [initialPrimaryImage, setInitialPrimaryImage] = useState("");
  const [initialSpouseImage, setInitialSpouseImage] = useState("");
  const { addToast, removeAllToasts } = useToasts();

  const [isParentLoading, setParentLoading] = useState(false);

  const [isModalOpen, setModalOpen] = useState(true);
  const [parentForm, setParentForm] = useState({
    ...initialParent,
    primary: { ...initialParent.primary, image: undefined },
    spouse: { ...initialParent.spouse, image: undefined },
  });
  const getParent = async () => {
    setParentLoading(true);
    const r = await PerformRequest.GetAllParents({
      parentID: params.parentID,
    }).catch(() => {
      setParentLoading(false);
    });
    setParentLoading(false);

    console.log(r);
    if (r.data.status === "success" && r.data.data) {
      console.log("Parent Obtained!");
      setParentForm({
        ...parentForm,
        ...r.data.data[0],
        primary: {
          ...r.data.data[0].primary,
          image: undefined,
        },
        spouse: {
          ...r.data.data[0].spouse,
          image: undefined,
        },
      });
      // setParentForm(r.data.data[0]);
      setInitialPrimaryImage(r.data.data[0].primary.image);
      setInitialSpouseImage(r.data.data[0].spouse.image);
    } else {
      addToast("No parent found... redirecting", { appearance: "error" });
    }
  };
  useEffect(() => {
    getParent();
  }, []);
  const [currentContact, setCurrentContact] = useState("Primary");

  const primaryImageUploadRef = useRef();
  const spouseImageUploadRef = useRef();
  const defaultFullInputProps = {
    variant: "outlined",
    spellCheck: false,
    className: "modal-input-full px-12",
  };
  const defaultHalfInputProps = {
    ...defaultFullInputProps,
    className: "modal-input-half px-12",
  };

  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const getConfirmationModalStatus = (value) => {
    setShowConfirmationModal(value);
    if (!value) {
      showUpdateParentModal(false);
    }
  };
  const fileIsLarge = () => {
    addToast("Max File Size: 1.5MB", { appearance: "error" });
  };
  const [formSubmitting, setFormSubmitting] = useState(false);

  const [formErrors, setFormErrors] = useState({
    firstName: false,
    lastName: false,
    spouseFirstName: false,
    spouseLastName: false,

    primaryEmail: false,
    spouseEmail: false,
    address: false,
    city: false,
    state: false,
    country: false,
    area: false,
    primaryPhone: false,
    spousePhone: false,
  });
  const UpdateFormErrors = () => {
    const isPrimaryPhoneValid = validatePhone(parentForm.primary.phone);
    const isSpousePhoneValid =
      validatePhone(parentForm.spouse.phone) &&
      parentForm.spouse.phone !== parentForm.primary.phone;
    const isPrimaryEmailValid = validateEmail(parentForm.primary.email);
    const isSpouseEmailValid =
      validateEmail(parentForm.spouse.email) &&
      parentForm.spouse.email !== parentForm.primary.email;

    const isLengthError = (param) => {
      if (!param) {
        return true;
      } else {
        return param.length === 0;
      }
    };
    setFormErrors({
      ...formErrors,
      firstName: isLengthError(parentForm.primary.firstname),
      lastName: isLengthError(parentForm.primary.lastname),
      spouseFirstName: isLengthError(parentForm.spouse.firstname),
      spouseLastName: isLengthError(parentForm.spouse.lastname),
      address: isLengthError(parentForm.address),
      city: isLengthError(parentForm.city),
      state: isLengthError(parentForm.state),
      country: isLengthError(parentForm.country),
      area: isLengthError(parentForm.area),
      primaryEmailAddress: !isPrimaryEmailValid,
      spouseEmail: !isSpouseEmailValid,
      primaryPhone: !isPrimaryPhoneValid,
      spousePhone: !isSpousePhoneValid,
    });
  };
  useEffect(() => {
    UpdateProfile();
  }, [formErrors]);
  const UpdateProfile = async () => {
    console.log(formErrors);
    console.log(parentForm);
    if (formSubmitting) {
      const errors = Object.values(formErrors).filter((e) => e === true);
      if (errors.length > 0) {
        setFormSubmitting(false);
        removeAllToasts();
        addToast("Please fill the form correctly", { appearance: "error" });
      } else {
        const { image: primaryImage } = parentForm.primary;
        const { image: spouseImage } = parentForm.spouse;

        if (!spouseImage && !primaryImage) {
          const data = {
            address: parentForm.address,
            city: parentForm.city,
            state: parentForm.state,
            country: parentForm.country,
            area: parentForm.area,
            parentID: parentForm.id,
            status: parentForm.status,
            primary: { ...parentForm.primary, image: initialPrimaryImage },
            spouse: { ...parentForm.spouse, image: initialSpouseImage },
          };
          console.log(data);
          const updateParent = await PerformRequest.UpdateParent(data).catch(
            () => {
              setFormSubmitting(false);
            }
          );
          setFormSubmitting(false);
          if (updateParent.data.status === "failed") {
            addToast("An error occured", { appearance: "error" });
          }
          console.log(updateParent);
          if (updateParent.data.response_code === 200) {
            ContextConsumer.refetchData();
            setShowConfirmationModal(true);
          }
        } else {
          const checkOrUploadImage = async (image, prevImage) => {
            if (!image) {
              return prevImage;
            } else {
              console.log("The Image", image);
              let imageFormData = new FormData();
              imageFormData.append(
                "file",
                image,
                image.name.toLowerCase().split(" ").join().replaceAll(",", "")
              );
              const uploadImage = await UploadFile({
                formData: imageFormData,
              });
              return uploadImage.data.fileUrl;
            }
          };

          const data = {
            address: parentForm.address,
            parentID: parentForm.id,
            status: parentForm.status,
            primary: {
              ...parentForm.primary,
              image: await checkOrUploadImage(
                primaryImage,
                initialPrimaryImage
              ),
            },
            spouse: {
              ...parentForm.spouse,
              image: await checkOrUploadImage(primaryImage, initialSpouseImage),
            },
          };

          console.log(data);
          const updateParent = await PerformRequest.UpdateParent(data).catch(
            () => {
              setFormSubmitting(false);
            }
          );
          console.log(updateParent);
          if (updateParent.data.response_code === 200) {
            ContextConsumer.refetchData();
            setShowConfirmationModal(true);
          }
        }
      }
    }
  };
  return (
    <>
      {showConfirmationModal && (
        <Confirmation
          modalHeaderText="PROFILE UPDATED SUCCESSFULLY"
          modalBodyText="Parent profile has been updated and saved!"
          modalAction={{
            method: () => {
              navigate("/dashboard/parents");
            },
            text: "Parents",
          }}
          modalLink={{
            text: "Back to Dashboard",
            route: "/dashboard",
          }}
          getConfirmationModalStatus={getConfirmationModalStatus}
        />
      )}
      <input
        type="file"
        accept=".jpg, .png"
        ref={primaryImageUploadRef}
        className="modal-image-hide"
        onChange={(e) => {
          console.log(e.target.files);
          const image = e.target.files[0];
          if (image.size > 1547220) {
            fileIsLarge();
          } else {
            setParentForm({
              ...parentForm,
              primary: { ...parentForm.primary, image: image },
            });
          }
        }}
      />
      <input
        type="file"
        accept=".jpg, .png"
        ref={spouseImageUploadRef}
        className="modal-image-hide"
        onChange={(e) => {
          console.log(e.target.files);
          const image = e.target.files[0];
          if (image.size > 1547220) {
            fileIsLarge();
          } else {
            setParentForm({
              ...parentForm,
              spouse: { ...parentForm.spouse, image: image },
            });
          }
        }}
      />

      {/* <Modal
        open={isModalOpen}
        onClose={(e, reason) => {
          if (reason === "backdropClick") {
            setModalOpen(false);
            showUpdateParentModal(false);
          }
        }}
        className="default-modal-container flex-row"
      > */}
      <div className="surrogate-content flex-column">
        <span className="cinzel px-30 uppercase">update parent profile</span>
        <br />

        <div className="modal-form-container flex-column align-center">
          {currentContact === "Primary" ? (
            <>
              <div className="modal-form flex-column">
                <br />
                <span className="fw-600 poppins px-21">Parent Bio-Data</span>
                <br />
                <div className="flex-row space-between modal-input-row">
                  <TextField
                    label="First Name"
                    value={parentForm.primary.firstname ?? ""}
                    error={formErrors.firstName}
                    {...defaultHalfInputProps}
                    onChange={(e) =>
                      setParentForm({
                        ...parentForm,
                        primary: {
                          ...parentForm.primary,
                          firstname: e.target.value,
                        },
                      })
                    }
                  />
                  <TextField
                    label="Last Name"
                    value={parentForm.primary.lastname ?? ""}
                    error={formErrors.lastName}
                    {...defaultHalfInputProps}
                    onChange={(e) =>
                      setParentForm({
                        ...parentForm,
                        primary: {
                          ...parentForm.primary,
                          lastname: e.target.value,
                        },
                      })
                    }
                  />
                </div>
                <div className="flex-row space-between modal-input-row">
                  <TextField
                    label="Email"
                    value={parentForm.primary.email ?? ""}
                    error={formErrors.primaryEmail}
                    {...defaultFullInputProps}
                    onChange={(e) =>
                      setParentForm({
                        ...parentForm,
                        primary: {
                          ...parentForm.primary,
                          email: e.target.value,
                        },
                      })
                    }
                  />
                </div>
                <div className="flex-row space-between modal-input-row">
                  <TextField
                    label="Address"
                    value={parentForm.address ?? ""}
                    error={formErrors.address}
                    {...defaultFullInputProps}
                    onChange={(e) =>
                      setParentForm({
                        ...parentForm,
                        address: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="flex-row space-between modal-input-row">
                  <TextField
                    label="City"
                    value={parentForm.city}
                    error={formErrors.city}
                    {...defaultHalfInputProps}
                    onChange={(e) =>
                      setParentForm({
                        ...parentForm,
                        city: e.target.value,
                      })
                    }
                  />
                  <TextField
                    label="State"
                    value={parentForm.state}
                    error={formErrors.state}
                    {...defaultHalfInputProps}
                    onChange={(e) =>
                      setParentForm({
                        ...parentForm,
                        state: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="flex-row space-between modal-input-row">
                  <FormControl {...defaultHalfInputProps}>
                    <InputLabel
                      variant="standard"
                      htmlFor="uncontrolled-native"
                    >
                      Country
                    </InputLabel>
                    <Select
                      label="Country"
                      placeholder="Select country"
                      value={parentForm.country}
                      error={formErrors.country}
                      onChange={(e) =>
                        setParentForm({
                          ...parentForm,
                          country: e.target.value,
                        })
                      }
                    >
                      {CountriesList.map((country, index) => {
                        return (
                          <MenuItem
                            value={country.name}
                            key={`${country.iso_alpha2}-${country.iso_alpha3}`}
                          >
                            {country.name}
                          </MenuItem>
                        );
                      })}
                    </Select>
                  </FormControl>
                  <TextField
                    label="Area"
                    value={parentForm.area}
                    error={formErrors.area}
                    {...defaultHalfInputProps}
                    onChange={(e) =>
                      setParentForm({
                        ...parentForm,
                        area: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="flex-row space-between modal-input-row">
                  <TextField
                    label="Phone Number"
                    value={parentForm.primary.phone ?? ""}
                    error={formErrors.primaryPhone}
                    {...defaultFullInputProps}
                    onChange={(e) =>
                      setParentForm({
                        ...parentForm,
                        primary: {
                          ...parentForm.primary,
                          phone: e.target.value,
                        },
                      })
                    }
                  />
                </div>

                <div className="flex-row space-between modal-input-row">
                  <FormControl variant="standard" {...defaultHalfInputProps}>
                    <InputLabel id="demo-simple-select-standard-label">
                      Contact Class
                    </InputLabel>
                    <Select
                      labelId="demo-simple-select-standard-label"
                      id="demo-simple-select-standard"
                      label="Contact Class"
                      value={currentContact}
                      onChange={(e) => {
                        setCurrentContact(e.target.value);
                      }}
                    >
                      <MenuItem value={"Primary"} key={"Primary"}>
                        Primary
                      </MenuItem>
                      <MenuItem value={"Spouse"} key={"Spouse"}>
                        Spouse
                      </MenuItem>
                    </Select>
                  </FormControl>
                  <FormControl variant="standard" {...defaultHalfInputProps}>
                    <InputLabel id="demo-simple-select-standard-label">
                      Status
                    </InputLabel>
                    <Select
                      labelId="demo-simple-select-standard-label"
                      id="demo-simple-select-standard"
                      label="Status"
                      value={parentForm.status}
                      onChange={(e) =>
                        setParentForm({
                          ...parentForm,
                          status: e.target.value,
                        })
                      }
                    >
                      <MenuItem value={"active"} key={"active"}>
                        Active
                      </MenuItem>
                      <MenuItem value={"inactive"} key={"inactive"}>
                        Inactive
                      </MenuItem>
                    </Select>
                  </FormControl>
                </div>
              </div>
              <br />
              <br />

              <br />
              <div
                className="flex-column modal-form-file-container"
                style={{
                  width: 300,
                }}
              >
                <span className="px-13 poppins fw-500">
                  &nbsp; &nbsp; Upload Photo
                </span>
                <div className="flex-row modal-form-file ">
                  <div className="px-13 poppins fw-500">
                    {parentForm.primary.image ? (
                      parentForm.primary.image.name
                    ) : (
                      <span>No File Selected</span>
                    )}
                  </div>
                  <span
                    className="px-13 poppins fw-500 modal-form-file-btn flex-row pointer"
                    onClick={() => {
                      primaryImageUploadRef.current.click();
                    }}
                  >
                    Upload File
                  </span>
                </div>
                <span className="px-13 poppins fw-500 modal-form-file-about">
                  &nbsp; &nbsp; Acceptable format :JPG/PNG
                </span>
              </div>

              <br />
            </>
          ) : (
            <>
              <div className="modal-form flex-column">
                <br />
                <span className="fw-600 poppins px-21">Spouse Bio-Data</span>
                <br />
                <div className="flex-row space-between modal-input-row">
                  <TextField
                    label="Spouse First Name"
                    value={parentForm.spouse.firstname ?? ""}
                    error={formErrors.spouseFirstName}
                    {...defaultHalfInputProps}
                    onChange={(e) =>
                      setParentForm({
                        ...parentForm,
                        spouse: {
                          ...parentForm.spouse,
                          firstname: e.target.value,
                        },
                      })
                    }
                  />
                  <TextField
                    label="Spouse Last Name"
                    value={parentForm.spouse.lastname ?? ""}
                    error={formErrors.spouseLastName}
                    {...defaultHalfInputProps}
                    onChange={(e) =>
                      setParentForm({
                        ...parentForm,
                        spouse: {
                          ...parentForm.spouse,
                          lastname: e.target.value,
                        },
                      })
                    }
                  />
                </div>
                <div className="flex-row space-between modal-input-row">
                  <TextField
                    label="Spouse Email"
                    value={parentForm.spouse.email ?? ""}
                    error={formErrors.spouseEmail}
                    {...defaultFullInputProps}
                    onChange={(e) =>
                      setParentForm({
                        ...parentForm,
                        spouse: {
                          ...parentForm.spouse,
                          email: e.target.value,
                        },
                      })
                    }
                  />
                </div>
                <div className="flex-row space-between modal-input-row">
                  <TextField
                    label="Address"
                    value={parentForm.address ?? ""}
                    error={formErrors.address}
                    {...defaultFullInputProps}
                    onChange={(e) =>
                      setParentForm({
                        ...parentForm,
                        address: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="flex-row space-between modal-input-row">
                  <TextField
                    label="Spouse Phone Number"
                    value={parentForm.spouse.phone ?? ""}
                    error={formErrors.spousePhone}
                    {...defaultFullInputProps}
                    onChange={(e) =>
                      setParentForm({
                        ...parentForm,
                        spouse: {
                          ...parentForm.spouse,
                          phone: e.target.value,
                        },
                      })
                    }
                  />
                </div>

                <div className="flex-row space-between modal-input-row">
                  <FormControl variant="standard" {...defaultHalfInputProps}>
                    <InputLabel id="demo-simple-select-standard-label">
                      Contact Class
                    </InputLabel>
                    <Select
                      labelId="demo-simple-select-standard-label"
                      id="demo-simple-select-standard"
                      label="Contact Class"
                      value={currentContact}
                      onChange={(e) => {
                        setCurrentContact(e.target.value);
                      }}
                    >
                      <MenuItem value={"Primary"} key={"Primary"}>
                        Primary
                      </MenuItem>
                      <MenuItem value={"Spouse"} key={"Spouse"}>
                        Spouse
                      </MenuItem>
                    </Select>
                  </FormControl>
                  <FormControl variant="standard" {...defaultHalfInputProps}>
                    <InputLabel id="demo-simple-select-standard-label">
                      Status
                    </InputLabel>
                    <Select
                      labelId="demo-simple-select-standard-label"
                      id="demo-simple-select-standard"
                      label="Status"
                      value={parentForm.status}
                      onChange={(e) =>
                        setParentForm({
                          ...parentForm,
                          status: e.target.value,
                        })
                      }
                    >
                      <MenuItem value={"active"} key={"active"}>
                        Active
                      </MenuItem>
                      <MenuItem value={"inactive"} key={"inactive"}>
                        Inactive
                      </MenuItem>
                    </Select>
                  </FormControl>
                </div>
              </div>
              <br />
              <br />

              <br />

              <div
                className="flex-column modal-form-file-container"
                style={{
                  width: 300,
                }}
              >
                <span className="px-13 poppins fw-500">
                  &nbsp; &nbsp; Upload Photo
                </span>
                <div className="flex-row modal-form-file ">
                  <div className="px-13 poppins fw-500">
                    {parentForm.spouse.image ? (
                      parentForm.spouse.image.name
                    ) : (
                      <span>No File Selected</span>
                    )}
                  </div>
                  <span
                    className="px-13 poppins fw-500 modal-form-file-btn flex-row pointer"
                    onClick={() => {
                      spouseImageUploadRef.current.click();
                    }}
                  >
                    Upload File
                  </span>
                </div>
                <span className="px-13 poppins fw-500 modal-form-file-about">
                  &nbsp; &nbsp; Acceptable format :JPG/PNG
                </span>
              </div>

              <br />
            </>
          )}
          <div className="flex-row width-100 align-center space-between">
            <Button
              variant="outlined"
              style={{
                borderColor: "rgba(162, 89, 255, 0.42)",
                borderWidth: "2px",
                color: "#000",
              }}
              onClick={() => {
                navigate("/dashboard/parents");
              }}
            >
              Cancel
            </Button>
            <button
              className="purple-btn-default px-14 poppins pointer uppercase modal-form-submit"
              onClick={() => {
                UpdateFormErrors();
                setFormSubmitting(true);
              }}
            >
              Update Profile &nbsp;
              {formSubmitting ? (
                <i className="far fa-spinner-third fa-spin" />
              ) : (
                <i className="far fa-long-arrow-alt-right" />
              )}
            </button>
          </div>
        </div>
      </div>
      {/* </Modal> */}
    </>
  );
}

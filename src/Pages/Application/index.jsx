import { Typography } from "@mui/material";
import { useState } from "react";
import {
  AgeRanges,
  EducationLevels,
  HairColours,
  Locations,
  Nationalities,
  SkinColours,
} from "../../Assets/Data";
import AccountManagement from "../AccountManagement";

import CustomSelect from "../CustomSelect";

export default function Application() {
  const [applicationFormData, setApplicationFormData] = useState({
    nationality: undefined,
    educationLevel: undefined,
    ageRange: undefined,
    preferredLocation: undefined,
    hairColour: undefined,
    skinColour: undefined,
  });
  const handleNationalitiesChange = (e) => {
    setApplicationFormData({ ...applicationFormData, nationality: e });
  };
  const handleEducationLevelChange = (e) => {
    setApplicationFormData({ ...applicationFormData, educationLevel: e });
  };
  const handleAgeRangeChange = (e) => {
    setApplicationFormData({ ...applicationFormData, ageRange: e });
  };
  const handleLocationChange = (e) => {
    setApplicationFormData({ ...applicationFormData, preferredLocation: e });
  };
  const handleSkinColourChange = (e) => {
    setApplicationFormData({ ...applicationFormData, skinColour: e });
  };
  const handleHairColourChange = (e) => {
    setApplicationFormData({ ...applicationFormData, hairColour: e });
  };
  return (
    <div className="flex-column application-container">
      <Typography className="poppins fw-500" variant="h5">
        PARENT DASHBOARD
      </Typography>
      <br />
      <span className="px-24 fw-600 poppins">Request A Surrogate</span>
      <small className="px-14 fw-300 poppins">
        Fill in the data for your preferred fit for a surrogate. It will take a
        couple of minutes
      </small>

      <div className="flex-row surrogate-form-container">
        <div className="surrogate-form-left flex-column">
          <span className="fw-600 px-19 poppins">Data Bank</span>
          <span className="px-14 poppins fw-300 surrogate-form-about">
            Kindly be as specific as possible with your request. Our admin will
            be in touch as soon as possible
          </span>

          <br />
          <br />
          <div className="surrogate-form-input flex-column">
            <span className="surrogate-form-label px-13 poppins">
              Preferred Nationality
            </span>

            <CustomSelect
              options={Nationalities}
              value={applicationFormData.nationality}
              placeholder="Select a Country"
              onValueChange={handleNationalitiesChange}
              halfWidth={false}
            />
          </div>
          <div className="surrogate-form-input flex-column">
            <span className="surrogate-form-label px-13 poppins">
              Preferred Education Level
            </span>

            <CustomSelect
              options={EducationLevels}
              value={applicationFormData.educationLevel}
              placeholder="Select Education Level"
              halfWidth={false}
              onValueChange={handleEducationLevelChange}
            />
          </div>
          <div className="flex-row space-between align-center application-select-row">
            <div className="surrogate-form-input flex-column">
              <span className="surrogate-form-label px-13 poppins">
                Preferred Age Range
              </span>

              <CustomSelect
                options={AgeRanges}
                value={applicationFormData.ageRange}
                placeholder="Select Age Range"
                onValueChange={handleAgeRangeChange}
                halfWidth={true}
              />
            </div>
            <div className="surrogate-form-input flex-column">
              <span className="surrogate-form-label px-13 poppins">
                Preferred Location
              </span>

              <CustomSelect
                options={Locations}
                value={applicationFormData.preferredLocation}
                placeholder="Select Location"
                onValueChange={handleLocationChange}
                halfWidth={true}
              />
            </div>
          </div>
          <div className="flex-row space-between align-center application-select-row">
            <div className="surrogate-form-input flex-column">
              <span className="surrogate-form-label px-13 poppins">
                Preferred Skin Colour
              </span>

              <CustomSelect
                options={SkinColours}
                value={applicationFormData.skinColour}
                placeholder="Select Skin Colour"
                onValueChange={handleAgeRangeChange}
                halfWidth={true}
              />
            </div>
            <div className="surrogate-form-input flex-column">
              <span className="surrogate-form-label px-13 poppins">
                Preferred Hair Colour
              </span>

              <CustomSelect
                options={HairColours}
                value={applicationFormData.hairColour}
                placeholder="Select Hair Colour"
                onValueChange={handleLocationChange}
                halfWidth={true}
              />
            </div>
          </div>
          <div className="flex-row space-between align-center application-select-row">
            <div className="surrogate-form-input flex-column">
              <span className="surrogate-form-label px-13 poppins">
                Preferred Skin Colour
              </span>

              <CustomSelect
                options={SkinColours}
                value={applicationFormData.skinColour}
                placeholder="Select Skin Colour"
                onValueChange={handleAgeRangeChange}
                halfWidth={true}
              />
            </div>
            <div className="surrogate-form-input flex-column">
              <span className="surrogate-form-label px-13 poppins">
                Preferred Hair Colour
              </span>

              <CustomSelect
                options={HairColours}
                value={applicationFormData.hairColour}
                placeholder="Select Hair Colour"
                onValueChange={handleLocationChange}
                halfWidth={true}
              />
            </div>
          </div>
        </div>
        <div className="surrogate-form-right flex-column">
          <div className="surrogate-form-input flex-column">
            <span className="surrogate-form-label px-13 poppins">
              Preferred Nationality
            </span>

            <CustomSelect
              options={Nationalities}
              value={applicationFormData.nationality}
              placeholder="Select a Country"
              onValueChange={handleNationalitiesChange}
              halfWidth={false}
            />
          </div>
          <div className="surrogate-form-input flex-column">
            <span className="surrogate-form-label px-13 poppins">
              Preferred Education Level
            </span>

            <CustomSelect
              options={EducationLevels}
              value={applicationFormData.educationLevel}
              placeholder="Select Education Level"
              halfWidth={false}
              onValueChange={handleEducationLevelChange}
            />
          </div>
          <div className="flex-row space-between align-center application-select-row">
            <div className="surrogate-form-input flex-column">
              <span className="surrogate-form-label px-13 poppins">
                Preferred Age Range
              </span>

              <CustomSelect
                options={AgeRanges}
                value={applicationFormData.ageRange}
                placeholder="Select Age Range"
                onValueChange={handleAgeRangeChange}
                halfWidth={true}
              />
            </div>
            <div className="surrogate-form-input flex-column">
              <span className="surrogate-form-label px-13 poppins">
                Preferred Location
              </span>

              <CustomSelect
                options={Locations}
                value={applicationFormData.preferredLocation}
                placeholder="Select Location"
                onValueChange={handleLocationChange}
                halfWidth={true}
              />
            </div>
          </div>
          <div className="flex-row space-between align-center application-select-row">
            <div className="surrogate-form-input flex-column">
              <span className="surrogate-form-label px-13 poppins">
                Preferred Skin Colour
              </span>

              <CustomSelect
                options={SkinColours}
                value={applicationFormData.skinColour}
                placeholder="Select Skin Colour"
                onValueChange={handleAgeRangeChange}
                halfWidth={true}
              />
            </div>
            <div className="surrogate-form-input flex-column">
              <span className="surrogate-form-label px-13 poppins">
                Preferred Hair Colour
              </span>

              <CustomSelect
                options={HairColours}
                value={applicationFormData.hairColour}
                placeholder="Select Hair Colour"
                onValueChange={handleLocationChange}
                halfWidth={true}
              />
            </div>
          </div>
          <div className="flex-row space-between align-center application-select-row">
            <div className="surrogate-form-input flex-column">
              <span className="surrogate-form-label px-13 poppins">
                Preferred Skin Colour
              </span>

              <CustomSelect
                options={SkinColours}
                value={applicationFormData.skinColour}
                placeholder="Select Skin Colour"
                onValueChange={handleAgeRangeChange}
                halfWidth={true}
              />
            </div>
            <div className="surrogate-form-input flex-column">
              <span className="surrogate-form-label px-13 poppins">
                Preferred Hair Colour
              </span>

              <CustomSelect
                options={HairColours}
                value={applicationFormData.hairColour}
                placeholder="Select Hair Colour"
                onValueChange={handleLocationChange}
                halfWidth={true}
              />
            </div>
          </div>
          <span className="submit-application-form flex-row px-15 fw-500 poppins pointer">
            Submit Request
          </span>
        </div>
      </div>
      <AccountManagement />
    </div>
  );
}

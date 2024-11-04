import { useEffect, useState } from "react";
import { motion } from "framer-motion";

export default function CustomSelect({
  options,
  onValueChange,
  value,
  halfWidth,
  placeholder,
}) {
  const defaultValue = { title: "", value: "" };
  const [isSelectOpen, setSelectOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState(value ?? defaultValue);

  useEffect(() => {
    onValueChange(selectedOption);
  }, [selectedOption]);
  return (
    <div
      className={`select-container flex-column ${
        halfWidth ? "select-container-half" : ""
      }`}
    >
      <div
        className="select-input-container flex-row"
        onClick={() => {
          setSelectOpen(!isSelectOpen);
        }}
      >
        <div className="select-input poppins px-12 flex-row">
          {selectedOption.value.length > 0 ? selectedOption.title : placeholder}
        </div>
        <motion.span
          inital={false}
          animate={{
            rotate: isSelectOpen ? "180deg" : "0deg",
          }}
          className="select-input-icon"
        >
          <i className={`far fa-angle-down`}></i>
        </motion.span>
      </div>

      <motion.div
        className={`select-options flex-column ${
          isSelectOpen ? "select-options-open" : ""
        } ${halfWidth ? "select-options-half" : ""}`}
        initial={false}
        animate={{
          height: isSelectOpen ? "fit-content" : "0px",
        }}
      >
        {options.map((option) => {
          return (
            <div
              className={`select-option ${
                selectedOption.value === option.value ? "selected-option" : ""
              }`}
              key={option.value}
              onClick={() => {
                setSelectedOption(option);
              }}
            >
              {option.title}
            </div>
          );
        })}
      </motion.div>
    </div>
  );
}

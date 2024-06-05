import { TextField } from "@mui/material";
import React, { useEffect, useState } from "react";

type StreamingTextInputProps = {
  targetText: string;
  speed: number;
  handleChange?:
    | React.ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement>
    | undefined;
  label?: string;
  placeholder: string;
  width?: string;
};
function StreamingTextInput({
  targetText,
  speed,
  handleChange,
  label,
  placeholder,
  width,
}: StreamingTextInputProps) {
  const [displayedText, setDisplayedText] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    setDisplayedText(""); // Reset displayed text when target text changes
    setCurrentIndex(0); // Reset the current index
  }, [targetText]);

  useEffect(() => {
    if (currentIndex < targetText.length) {
      const intervalId = setInterval(() => {
        setDisplayedText((prev) => prev + targetText[currentIndex]);
        setCurrentIndex((prev) => prev + 1);
      }, speed);
      return () => clearInterval(intervalId);
    }
  }, [currentIndex, targetText, speed]);
  return (
    <TextField
      type="text"
      value={displayedText}
      label={label !== undefined ? label : undefined}
      placeholder={placeholder}
      variant="standard"
      sx={{
        width: width || "100%",
        "& .MuiInputBase-input.Mui-disabled": {
          WebkitTextFillColor: "#000000",
          fontSize: "0.875rem",
        },
      }}
      InputLabelProps={{
        shrink: true,
      }}
      disabled
      onChange={(e) => {
        setDisplayedText(e.target.value);
        if (handleChange !== undefined) handleChange(e);
      }}
      size="small"
      multiline
    />
  );
}

export default StreamingTextInput;

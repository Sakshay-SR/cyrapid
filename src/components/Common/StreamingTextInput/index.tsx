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
  const [text, setText] = useState("");
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      if (index < targetText.length) {
        setText(targetText.slice(0, index + 1));
        setIndex(index + 1);
      } else {
        clearInterval(interval);
      }
    }, speed); // Change this value to adjust the speed of the streaming effect

    return () => clearInterval(interval);
  }, [index, targetText, speed]);

  return (
    <TextField
      type="text"
      value={text}
      label={label !== undefined ? label : undefined}
      placeholder={placeholder}
      variant="standard"
      sx={{
        width: width || "100%",
        "& .MuiInputBase-input.Mui-disabled": {
          WebkitTextFillColor: "#000000",
          fontSize: '0.875rem',
        },
      }}
      InputLabelProps={{
        shrink: true,
      }}
      disabled
      onChange={(e) => {
        setText(e.target.value);
        if (handleChange !== undefined) handleChange(e);
      }}
      size="small"
      multiline
    />
  );
}

export default StreamingTextInput;

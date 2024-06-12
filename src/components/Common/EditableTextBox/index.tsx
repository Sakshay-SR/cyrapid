import { TextField } from "@mui/material";
import React from "react";
import EditIcon from "@mui/icons-material/Edit";
const EditableTextBox = (props: any) => {
  const [edit, setEdit] = React.useState(true);
  return (
    <div className="relative">
      <TextField
        sx={{
          width: "400px",
          "& .MuiInputBase-input.Mui-disabled": {
            WebkitTextFillColor: "#000000",
            fontSize: "0.875rem",
          },
          paddingRight: "20px",
          padding: "1.5rem",
        }}
        fullWidth
        placeholder={props.placeholder}
        variant="standard"
        InputLabelProps={{
          shrink: true,
        }}
        size="small"
        disabled={edit}
        multiline
        value={props.value}
        onChange={props.onChange}
      />
      {!props.disabled && (
        <button
          title="Edit"
          onClick={() => setEdit(!edit)}
          className="absolute top-1 right-1"
        >
          <EditIcon fontSize="small" />
        </button>
      )}
    </div>
  );
};

export default EditableTextBox;

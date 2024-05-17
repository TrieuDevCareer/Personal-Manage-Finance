import React, { useState, useContext, useEffect } from "react";
import Axios from "axios";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import ListItemText from "@mui/material/ListItemText";
import Select from "@mui/material/Select";
import Checkbox from "@mui/material/Checkbox";
import UserContext from "../../context/UserContext.js";
import domain from "../../util/domain.js";
import "./multiDropdown.scss";

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

function MultiDropdown({ personName, data, title, handleChange }) {
  // const [personName, setPersonName] = React.useState([]);

  const { user } = useContext(UserContext);
  // function get
  // useEffect(() => {
  //   if (!user) setPersonName([]);
  //   else getIncomes();
  // }, [user]);

  return (
    <div className="multidrp-container">
      <FormControl sx={{ width: "15rem" }} className="multidrp-form">
        <InputLabel className="multidrp-lable" id="demo-simple-select-standard-label">
          {title}
        </InputLabel>
        <Select
          className="multidrp-select"
          labelId="demo-simple-select-standard-label"
          id="demo-simple-select-standard"
          multiple
          value={personName}
          onChange={handleChange}
          input={<OutlinedInput label="Tag" />}
          renderValue={(selected) => selected.join(", ")}
          MenuProps={MenuProps}
          fullWidth
        >
          {data.length > 0 &&
            data.map((name) => (
              <MenuItem className="menuno" key={name} value={name}>
                <Checkbox checked={personName.indexOf(name) > -1} />
                <ListItemText primary={name} />
              </MenuItem>
            ))}
        </Select>
      </FormControl>
    </div>
  );
}
export default MultiDropdown;

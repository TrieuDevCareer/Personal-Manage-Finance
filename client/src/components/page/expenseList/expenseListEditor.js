import React, { useState, useEffect } from "react";
import Axios from "axios";
import { Box, TextField, Stack, Button, MenuItem } from "@mui/material";
import domain from "../../../util/domain.js";
import LoadingProgess from "../../misc/loadingProgess.js";
import ErrorMessage from "../../misc/ErrorMessage";
import "./expenseListEditor.scss";

const currencies = [
  {
    value: "SO",
    label: "Nguồn sống",
  },
  {
    value: "TD",
    label: "Tự do",
  },
];

function ExpenseListEditor({ getExpenseLists, setExpenseListEditorOpen, editExpenseListData }) {
  const [exelstCode, setExelstCode] = useState("");
  const [exeLstContent, setExeLstContent] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  function closeEditor() {
    setExpenseListEditorOpen(false);
  }

  async function saveExpenseListEditor(e) {
    e.preventDefault();
    setIsLoading(true);
    const oExpenseListData = {
      exelstCode,
      exeLstContent,
    };

    try {
      if (!editExpenseListData) await Axios.post(`${domain}/expenselist/`, oExpenseListData);
      else await Axios.put(`${domain}/expenselist/${editExpenseListData._id}`, oExpenseListData);
    } catch (err) {
      setIsLoading(false);
      if (err.response) {
        if (err.response.data.errorMessage) {
          setMessage(err.response.data.errorMessage);
        }
      }
      return;
    }

    getExpenseLists();
    closeEditor();
  }
  useEffect(() => {
    if (editExpenseListData) {
      setExelstCode(editExpenseListData.exelstCode ? editExpenseListData.exelstCode : "");
      setExeLstContent(editExpenseListData.exeLstContent ? editExpenseListData.exeLstContent : "");
    }
  }, [editExpenseListData]);
  return (
    <div className="popup-container">
      {isLoading && <LoadingProgess />}
      {!isLoading && (
        <Box
          className="popup-form"
          component="form"
          sx={{
            "& > :not(style)": { m: 1, width: "40rem" },
          }}
          noValidate
          autoComplete="off"
          onSubmit={saveExpenseListEditor}
        >
          <ErrorMessage message={message} setMessage={setMessage} />
          <TextField
            className="popup-text"
            id="outlined-select-currency"
            fullWidth
            select
            label="Nguồn quỹ"
            value={exelstCode}
            onChange={(e) => setExelstCode(e.target.value)}
          >
            {currencies.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            className="popup-text"
            fullWidth
            label="Nội dung chi tiêu"
            id="fullWidth"
            type="input"
            value={exeLstContent}
            onChange={(e) => setExeLstContent(e.target.value)}
          />
          <Stack spacing={2} direction="row" justifyContent="right">
            <Button variant="outlined" color="success" type="submit">
              Lưu thay đổi
            </Button>
            <Button variant="outlined" color="error" onClick={() => closeEditor()}>
              Hủy thay đổi
            </Button>
          </Stack>
        </Box>
      )}
    </div>
  );
}
export default ExpenseListEditor;

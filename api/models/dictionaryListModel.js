const mongoose = require("mongoose");
const { randomUUID } = require("crypto");
const ObjectId = mongoose.Schema.Types.ObjectId;

const dictionaryListSchema = new mongoose.Schema(
  {
    dicLstCode: { type: String, require: true },
    dicLstContent: { type: String, require: true },
    user: { type: ObjectId, required: true },
  },
  {
    timestamps: true,
  }
);

const DictionaryList = mongoose.model("dictionaryList", dictionaryListSchema);

module.exports = DictionaryList;

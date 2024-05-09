import mongoose from "mongoose";

const remoteJobSchema = new mongoose.Schema({
  nomPrenom: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  date: {
    type: String, 
    required: true,
  },
  dateSoumission: {
    type: Date,
    default: Date.now,
  },
});

const RemoteJob = mongoose.model("RemoteJob", remoteJobSchema);

export default RemoteJob;
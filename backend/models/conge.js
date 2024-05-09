import mongoose from "mongoose";

const Conge = mongoose.model("Conge",{
  nomPrenom: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  dateDebut: {
    type: String,
    required: true,
  },
  dateFin: {
    type: String,
    required: true,
  },
});


export default Conge;
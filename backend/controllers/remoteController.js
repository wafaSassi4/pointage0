import RemoteJob from "../models/remoteJob.js";
import User from "../models/user.js";
import moment from "moment";

const submitRemoteJob = async (req, res) => {
  try {
    const { nomPrenom, email, dateDebut, dateFin } = req.body;
    if (!nomPrenom || !email || !dateDebut|| !dateFin) {
      return res.status(404).json({ message: "Tous les champs sont requis !" });
    }

    const userLoggedIn = await User.findOne({ email: email });
    if (!userLoggedIn || !userLoggedIn.fullname || userLoggedIn.fullname.trim().toLowerCase() !== nomPrenom.trim().toLowerCase()) {
      return res.status(401).json({ message: "Utilisateur non autorisé ou nom/prénom incorrect." });
    }

    const existingRemoteJob = await RemoteJob.findOne({ email: email, nomPrenom: nomPrenom });
    if (existingRemoteJob) {
      return res.status(409).json({ message: "Une demande d'emploi à distance existe déjà pour cet utilisateur." });
    }

    if (!validateDates(dateDebut, dateFin)) {
      return res
        .status(400)
        .json({ message: "Les dates ne sont pas valides." });
    }

    if (
      moment(dateDebut, "DD/MM/YYYY").isAfter(moment(dateFin, "DD/MM/YYYY"))
    ) {
      return res
        .status(400)
        .json({
          message: "La date de début doit être antérieure à la date de fin.",
        });
    }

    const remoteJob = new RemoteJob({
      nomPrenom,
      email,
      dateDebut,
      dateFin,
    });

    await remoteJob.save();

    res.status(201).json({ message: "Demande d'emploi à distance soumise avec succès." });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Erreur lors de la soumission de la demande d'emploi à distance." });
  }
};

function validateDates(dateDebut, dateFin) {
  return (
    moment(dateDebut, "DD/MM/YYYY", true).isValid() &&
    moment(dateFin, "DD/MM/YYYY", true).isValid()
  );
}

export { submitRemoteJob };

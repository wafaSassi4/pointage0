import RemoteJob from "../models/remoteJob.js";
import User from "../models/user.js";
import moment from "moment";

const remoteController = {
  submitRemoteJob: async (req, res) => {
    try {
      const userLoggedIn = await User.findOne({ email: req.body.email });

      if (!userLoggedIn) {
        return res.status(401).json({ error: "Utilisateur non autorisé." });
      }

      const { email: userLoggedInEmail, fullname: userLoggedInFullName } =
        userLoggedIn;

      const { nomPrenom, email, date } = req.body;

      if (userLoggedInEmail !== email || userLoggedInFullName !== nomPrenom) {
        return res.status(400).json({
          error:
            "L'email ou le nom ne correspond pas à l'utilisateur connecté.",
        });
      }

      const newRemoteJob = new RemoteJob({
        nomPrenom,
        email,
        date,
      });

      await newRemoteJob.save();

      res
        .status(201)
        .json({ message: "Demande d'emploi à distance soumise avec succès" });
    } catch (error) {
      console.error(
        "Erreur lors de la soumission de la demande d'emploi à distance :",
        error
      );
      res.status(500).json({
        message: "Une erreur s'est produite. Veuillez réessayer plus tard.",
      });
    }
  },
};
function validateDates(date) {
  return moment(date, "DD/MM/YYYY", true).isValid();
}

export default remoteController;

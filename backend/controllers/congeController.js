import Conge from "../models/conge.js";
import User from "../models/user.js";
import moment from "moment";

const createConge = async (req, res) => {
  try {
    const { nomPrenom, email, dateDebut, dateFin } = req.body;
    if (!nomPrenom || !email || !dateDebut || !dateFin) {
      return res.status(404).json({ message: "Tous les champs sont requis !" });
    }
    const userLoggedIn = await User.findOne({ email: email });
    // Assurez-vous que userLoggedIn et userLoggedIn.fullname ne sont pas undefined avant de continuer
    if (!userLoggedIn || !userLoggedIn.fullname || userLoggedIn.fullname.trim().toLowerCase() !== nomPrenom.trim().toLowerCase()) {
      return res.status(401).json({ message: "Utilisateur non autorisé ou nom/prénom incorrect." });
    }
    // Vérification de l'existence d'une demande de congé précédente
    const existingConge = await Conge.findOne({ email: email, nomPrenom: nomPrenom });
    if (existingConge) {
      return res.status(409).json({ message: "Une demande de congé existe déjà pour cet utilisateur." });
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

    const conge = new Conge({
      nomPrenom,
      email,
      dateDebut,
      dateFin,
    });

    await conge.save();

    res.status(201).json({ message: "Demande de congé créée avec succès." });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Erreur lors de la création de la demande de congé." });
  }
};

const modifierConge = async (req, res) => {
  try {
    const { email, nomPrenom, NVdateDebut, NVdateFin } = req.body;
    
    // Vérifier si tous les champs nécessaires sont présents
    if (!nomPrenom || !email || !NVdateDebut || !NVdateFin) {
      return res.status(404).json({ message: "Tous les champs sont requis !" });
    }

    // Trouver l'utilisateur connecté pour vérifier son autorisation
    const userLoggedIn = await User.findOne({ email: email });
    if (!userLoggedIn || userLoggedIn.fullname.trim().toLowerCase() !== nomPrenom.trim().toLowerCase()) {
      return res.status(401).json({ message: "Utilisateur non autorisé." });
    }

    // Vérifier la validité des nouvelles dates
    if (!validateDates(NVdateDebut, NVdateFin)) {
      return res.status(400).json({ message: "Les dates ne sont pas valides." });
    }

    // Vérifier que la nouvelle date de début est avant la nouvelle date de fin
    if (moment(NVdateDebut, "DD/MM/YYYY").isAfter(moment(NVdateFin, "DD/MM/YYYY"))) {
      return res.status(400).json({ message: "La date de début doit être antérieure à la date de fin." });
    }

    // Rechercher le congé existant avec le nom, prénom et email
    const congeExistant = await Conge.findOne({
      email: email,
      nomPrenom: nomPrenom,
    });

    // Si aucun congé correspondant n'est trouvé
    if (!congeExistant) {
      return res.status(404).json({ message: "Aucun congé correspondant trouvé." });
    }

    // Si un congé correspondant est trouvé, procéder à la mise à jour des dates
    await Conge.findOneAndUpdate(
      { email: email, nomPrenom: nomPrenom },
      { dateDebut: NVdateDebut, dateFin: NVdateFin }
    );

    res.status(200).json({ message: "Congé modifié avec succès." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erreur lors de la modification du congé." });
  }
};

const supprimerConge = async (req, res) => {
  try {
    const { email, nomPrenom, dateDebut, dateFin } = req.body;

    // Trouver le congé basé sur l'email, nomPrenom, dateDebut, et dateFin
    const conge = await Conge.findOne({
      email: email,
      nomPrenom: nomPrenom,
      dateDebut: dateDebut,
      dateFin: dateFin,
    });

    // Si aucun congé correspondant n'est trouvé
    if (!conge) {
      return res.status(404).json({ message: "Aucun congé correspondant trouvé." });
    }

    // Si un congé correspondant est trouvé, procéder à la suppression
    await Conge.deleteOne({ _id: conge._id });
    res.status(200).json({ message: "Congé supprimé avec succès." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erreur lors de la suppression du congé." });
  }
};




function validateDates(dateDebut, dateFin) {
  return (
    moment(dateDebut, "DD/MM/YYYY", true).isValid() &&
    moment(dateFin, "DD/MM/YYYY", true).isValid()
  );
}

export { createConge, modifierConge,supprimerConge  };

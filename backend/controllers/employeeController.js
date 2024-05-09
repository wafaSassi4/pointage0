import moment from "moment";
import Employee from "../models/Employee.js";
import User from "../models/user.js";

const ERROR_USER_NOT_FOUND = "Utilisateur non trouvé.";
const ERROR_SERVER = "Erreur du serveur.";
const STATUS_USER_NOT_FOUND = 404;
const STATUS_SERVER_ERROR = 500;
const STATUS_CREATED = 201;
// Fonction pour formater l'heure au format "hh:mm:ss"
const formatTime = () => {
  const now = new Date();
  const hours = String(now.getHours()).padStart(2, "0");
  const minutes = String(now.getMinutes()).padStart(2, "0");
  const seconds = String(now.getSeconds()).padStart(2, "0");
  return `${hours}:${minutes}:${seconds}`;
};

// Fonction pour formater la date au format "jj/mm/aaaa"
const formatDate = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${day}/${month}/${year}`;
};

export const createEmployee = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(STATUS_USER_NOT_FOUND)
        .json({ message: ERROR_USER_NOT_FOUND });
    }

    const newEmployee = new Employee({
      entries: [
        {
          name: user.fullname,
          entryTime: moment().format(),
          workMode: "",
        },
      ],
    });

    await newEmployee.save();

    res.status(STATUS_CREATED).json(newEmployee);
  } catch (err) {
    console.error(err.message);
    res.status(STATUS_SERVER_ERROR).json({ message: ERROR_SERVER });
  }
};

const formatTime1 = () => {
  const now = new Date();
  return moment(now).format("HH:mm:ss");
};

// Fonction pour formater la date au format "jj/mm/aaaa"
const formatDate1 = () => {
  const now = new Date();
  return moment(now).format("DD/MM/YYYY");
};

// Endpoint pour créer une nouvelle entrée pour un employé
export const createEntry = async (req, res) => {
  try {
    const { entryTime, workMode, fullname } = req.body;

    if (!entryTime || !workMode || !fullname) {
      return res.status(401).json({
        success: false,
        error: "EntryTime , WorkMode and fullname are required",
      });
    }

    // Obtention de la date actuelle au format "jj/mm/aaaa"
    const currentDate = formatDate1();

    // Recherche de l'entrée existante pour la date actuelle
    let existingEntry = await Employee.findOne({ date: currentDate });

    // Si aucune entrée existante, créez une nouvelle entrée
    if (!existingEntry) {
      existingEntry = await Employee.create({
        date: currentDate,
        entries: [],
      });
    }

    // Création d'une nouvelle entrée avec le travailMode, fullname et la date d'aujourd'hui
    const newEntry = {
      workMode,
      fullname, // Utilize the fullname retrieved here
      entryTime, // Using the current time when creating the entry
      exitTime: "", // The exit time will be updated later
      hoursWorked: "00:00:00", // Initialized to 0
    };

    // Adding the new entry to the existing entry for the current date
    existingEntry.entries.push(newEntry);

    // Saving the employee's modifications in the database
    const UpdatedEmployee = await existingEntry.save();

    // Retrieving the ID of the newly added entry
    const idEntry =
      UpdatedEmployee.entries[UpdatedEmployee.entries.length - 1]._id;

    // Renvoyer une réponse avec les données de l'entrée créée
    res
      .status(STATUS_CREATED)
      .json({ success: true, data: { ...newEntry, _id: idEntry } });
  } catch (err) {
    // Renvoyer une réponse d'erreur en cas de problème
    console.error("Erreur lors de la création de l'entrée :", err);
    res
      .status(STATUS_SERVER_ERROR)
      .json({ success: false, error: ERROR_SERVER });
  }
};

// Endpoint pour récupérer le fullname de l'utilisateur
export const getFullname = async (req, res) => {
  try {
    const { fullname } = req.user;
    res.json({ fullname });
  } catch (error) {
    console.error(
      "Erreur lors de la récupération du fullname de l'utilisateur :",
      error
    );
    res.status(STATUS_SERVER_ERROR).json({ message: ERROR_SERVER });
  }
};
// Contrôleur pour mettre à jour l'heure de sortie et les heures travaillées
export const updateExitTimeAndHoursWorked = async (req, res) => {
  try {
    const { id } = req.params;
    const { exitTime, hoursWorked } = req.body;

    // Validate if exitTime and hoursWorked are provided
    if (exitTime === undefined || hoursWorked === undefined) {
      return res.status(400).json({
        success: false,
        error: "exitTime and hoursWorked are required",
      });
    }

    // Update employee data in the database
    const updatedEntry = await Employee.findOneAndUpdate(
      { "entries._id": id },
      {
        $set: {
          "entries.$.exitTime": exitTime,
          "entries.$.hoursWorked": hoursWorked,
        },
      },
      { new: true } // To return the updated document
    );

    // Check if the entry was updated successfully
    if (!updatedEntry) {
      return res
        .status(404)
        .json({ success: false, error: "No entry found for the provided ID" });
    }

    res.status(200).json({ success: true, data: updatedEntry });
  } catch (err) {
    console.error("Error updating data:", err);
    res
      .status(500)
      .json({ success: false, error: "Server error while updating data" });
  }
};
export const getEmployeesPresentiel = async (req, res) => {
  try {
    // Obtenez la date actuelle au format "JJ/MM/AAAA"
    const currentDate = formatDate(); // Assurez-vous que vous appelez la fonction formatDate correctement
    console.log(currentDate);

    // Trouvez un employé avec la date actuelle
    let existingEntry = await Employee.findOne({ date: currentDate });

    if (!existingEntry) {
      // S'il n'y a pas d'entrée pour la date actuelle, renvoyer un tableau vide
      res.status(200).json([]);
      return;
    }

    // Filtrer les employés ayant le mode de travail "presentiel" pour la date actuelle
    const presentEmployees = existingEntry.entries.filter((entry) => {
      return entry.workMode === "presentiel";
    });

    console.log(presentEmployees);

    res.status(200).json(presentEmployees);
  } catch (error) {
    console.error(
      "Erreur lors de la récupération des employés travaillant en présentiel :",
      error
    );
    res.status(500).json({
      message:
        "Erreur serveur lors de la récupération des employés travaillant en présentiel",
    });
  }
};



export const getEmployeesRemote = async (req, res) => {
  try {
    // Obtenez la date actuelle au format "JJ/MM/AAAA"
    const currentDate = formatDate(); // Assurez-vous que vous appelez la fonction formatDate correctement
    console.log(currentDate);

    // Trouvez un employé avec la date actuelle
    let existingEntry = await Employee.findOne({ date: currentDate });

    if (!existingEntry) {
      // S'il n'y a pas d'entrée pour la date actuelle, renvoyer un tableau vide
      res.status(200).json([]);
      return;
    }

    // Filtrer les employés ayant le mode de travail "presentiel" pour la date actuelle
    const presentEmployees = existingEntry.entries.filter((entry) => {
      return entry.workMode === "remote";
    });

    console.log(presentEmployees);

    res.status(200).json(presentEmployees);
  } catch (error) {
    console.error(
      "Erreur lors de la récupération des employés travaillant en présentiel :",
      error
    );
    res.status(500).json({
      message:
        "Erreur serveur lors de la récupération des employés travaillant en présentiel",
    });
  }
};


const getCurrentDate = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${day}/${month}/${year}`;
};
// Endpoint pour récupérer tous les employés
export const getAllEmployees = async (req, res) => {
  try {
    const employees = await Employee.find();
    res.status(200).json(employees);
  } catch (error) {
    console.error("Erreur lors de la récupération de tous les employés :", error);
    res.status(500).json({ message: "Erreur serveur lors de la récupération de tous les employés" });
  }
};

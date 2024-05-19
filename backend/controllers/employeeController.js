import moment from "moment";
import Employee from "../models/Employee.js";
import User from "../models/user.js";



const ERROR_USER_NOT_FOUND = "Utilisateur non trouvé.";
const ERROR_SERVER = "Erreur du serveur.";
const STATUS_USER_NOT_FOUND = 404;
const STATUS_SERVER_ERROR = 500;
const STATUS_CREATED = 201;


const formatTime = () => moment().format("HH:mm:ss");
const formatDate = () => moment().format("DD/MM/YYYY");

// Fonction pour convertir un temps en format "hh:mm:ss" en secondes
const timeStringToSeconds = (timeString) => {
  const [hours, minutes, seconds] = timeString.split(":").map(Number);
  return hours * 3600 + minutes * 60 + seconds;
};

// Fonction pour convertir un nombre de secondes en format "hh:mm:ss"
const secondsToTimeString = (totalSeconds) => {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
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
          entryTime: formatTime(),
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
const formatDate1 = () => moment().format("DD/MM/YYYY");

// Endpoint pour créer une nouvelle entrée pour un employé
export const createEntry = async (req, res) => {
  try {
    const { entryTime, workMode, fullname } = req.body;

    if (!entryTime || !workMode || !fullname) {
      return res.status(401).json({
        success: false,
        error: "EntryTime, WorkMode, and Fullname are required",
      });
    }

    const currentDate = formatDate1();

    let existingEntry = await Employee.findOne({ date: currentDate });

    if (!existingEntry) {
      existingEntry = await Employee.create({
        date: currentDate,
        entries: [],
      });
    }

    const newEntry = {
      workMode,
      fullname,
      entryTime,
      exitTime: "",
      hoursWorked: "00:00:00",
    };

    existingEntry.entries.push(newEntry);

    const UpdatedEmployee = await existingEntry.save();

    const idEntry = UpdatedEmployee.entries[UpdatedEmployee.entries.length - 1]._id;

    res.status(STATUS_CREATED).json({ success: true, data: { ...newEntry, _id: idEntry } });
  } catch (err) {
    console.error("Erreur lors de la création de l'entrée :", err);
    res.status(STATUS_SERVER_ERROR).json({ success: false, error: ERROR_SERVER });
  }
};


// Endpoint pour récupérer le fullname de l'utilisateur
export const getFullname = async (req, res) => {
  try {
    const { fullname } = req.user;
    res.json({ fullname });
  } catch (error) {
    console.error("Erreur lors de la récupération du fullname de l'utilisateur :", error);
    res.status(STATUS_SERVER_ERROR).json({ message: ERROR_SERVER });
  }
};
// Contrôleur pour mettre à jour l'heure de sortie et les heures travaillées
export const updateExitTimeAndHoursWorked = async (req, res) => {
  try {
    const { id } = req.params;
    const { exitTime, hoursWorked } = req.body;

    if (exitTime === undefined || hoursWorked === undefined) {
      return res.status(400).json({
        success: false,
        error: "exitTime and hoursWorked are required",
      });
    }

    const entry = await Employee.findOne(
      { "entries._id": id });

      // Convertir les temps en secondes
    const lastTimeInSeconds = timeStringToSeconds(entry.entries[0].hoursWorked);
    const entryHoursWorkedInSeconds = timeStringToSeconds(hoursWorked);
    const totalHoursWorkedInSeconds = entryHoursWorkedInSeconds + lastTimeInSeconds;

    // Convertir le total des secondes en format "hh:mm:ss"
    const totalHoursWorked = secondsToTimeString(totalHoursWorkedInSeconds);

    const updatedEntry = await Employee.findOneAndUpdate(
      { "entries._id": id },
      {
        $set: {
          "entries.$.exitTime": exitTime,
          "entries.$.hoursWorked": totalHoursWorked,
        },
      },
      { new: true }
    );

    if (!updatedEntry) {
      return res.status(404).json({ success: false, error: "No entry found for the provided ID" });
    }

    res.status(200).json({ success: true, data: updatedEntry });
  } catch (err) {
    console.error("Error updating data:", err);
    res.status(500).json({ success: false, error: "Server error while updating data" });
  }
}
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

export const getActiveEmployee = async (req, res) => {
  const { fullname } = req.body;
  try {
    const currentDate = formatDate1();

    if(!fullname){
      res.status(404).json({ message: "fullname is required" });
    }

    const employee = await Employee.findOne({
      date: currentDate,
      "entries.fullname": fullname, // Rechercher le nom complet dans les entrées existantes
    });
    console.log("employee", employee)

    if (!employee) {
      console.log("employee not found")
      return res.status(400).json({ message: "Employee not found" });
    }
    console.log("employee exist")
    console.log(employee)
    return res.status(200).json({ entry: employee.entries, message: "Employee exist" });
  } catch (error) {
    console.error("Error finding active employee:", error);
    return res.status(500).json({ messsage: "Internal server error" });
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
    console.error(
      "Erreur lors de la récupération de tous les employés :",
      error
    );
    res
      .status(500)
      .json({
        message: "Erreur serveur lors de la récupération de tous les employés",
      });
  }
};

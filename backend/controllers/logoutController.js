import User from "../models/user.js";

const logout = async (req, res) => {
  try {
    res.status(200).send("Déconnexion réussie");
  } catch (error) {
    console.error("Erreur lors de la déconnexion", error);
    res.status(500).send("Erreur lors de la déconnexion");
  }
};

export { logout };

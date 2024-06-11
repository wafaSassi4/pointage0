import bcryptjs from "bcryptjs";

const hashData = async (data) => {
  try {
    const salt = await bcryptjs.genSalt();
    const hashedData = await bcryptjs.hash(data, salt);

    return hashedData;
  } catch (error) {
    throw new Error(`Error hashing data: ${error.message}`);
  }
};

const InhashData = async (data, prev) => {
  try {
    const InhashedData = await bcryptjs.compare(data, prev);

    return InhashedData;
  } catch (error) {
    throw new Error(`Error comparing data: ${error.message}`);
  }
};
const compareHash = async (data, hash) => {
  // Renommer la fonction pour refléter son objectif
  try {
    const isMatch = await bcryptjs.compare(data, hash);

    return isMatch;
  } catch (error) {
    throw new Error(
      `Erreur lors de la comparaison des données : ${error.message}`
    );
  }
};
export { hashData, InhashData, compareHash };

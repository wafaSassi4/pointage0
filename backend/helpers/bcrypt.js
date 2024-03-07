import bcrypt from "bcrypt";

const hashData = async (data) => {
  try {
    const salt = await bcrypt.genSalt();
    const hashedData = await bcrypt.hash(data, salt);

    return hashedData;
  } catch (error) {
    throw new Error(`Error hashing data: ${error.message}`);
  }
};

const InhashData = async (data, prev) => {
  try {
    const InhashedData = await bcrypt.compare(data,prev);

    return InhashedData;
  } catch (error) {
    throw new Error(`Error comparing data: ${error.message}`);
  }
};

export { hashData, InhashData };
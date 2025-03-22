import bcrypt from "bcrypt";


const saltRounds = 10;

export const generateHash = async (password) => {
    try {
        const salt = await bcrypt.genSalt(saltRounds);
        const hash = await bcrypt.hash(password, salt);
        return hash;
    } catch (err) {
        console.log(err);
        return null;
    }
}

export const compareHash = async (password, hash) => {
    const check = await bcrypt.compare(password, hash);
    if (!check) {
        return false;
    }
    return true;
}
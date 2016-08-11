import bCrypt from "bcrypt-nodejs";

export function isValid(storedPwd, providedPwd){
    return bCrypt.compareSync(providedPwd, storedPwd);
}

export function createHash(password){
    return bCrypt.hashSync(password, bCrypt.genSaltSync(10), null);
}

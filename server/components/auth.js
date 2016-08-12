import bCrypt from "bcrypt-nodejs";

let auth = {
  isValidPassword(storedPwd, providedPwd){
      return bCrypt.compareSync(providedPwd, storedPwd);
  },
  createHash(password){
      return bCrypt.hashSync(password, bCrypt.genSaltSync(10), null);
  }
}

export default auth;

import bcrypt from "bcrypt";

//hash function

const hashpassword = (password) => {
  return new Promise((resolve, reject) => {
    bcrypt.genSalt(10, (err, salt) => {
      if (err) {
        reject(err);
      }
      bcrypt.hash(password, salt, (err, hash) => {
        if (err) {
          reject(err);
        }
        resolve(hash);
      });
    });
  });
};
export default hashpassword


export const comparePassword = (password, hashed)=>{
  return bcrypt.compare(password, hashed);
}

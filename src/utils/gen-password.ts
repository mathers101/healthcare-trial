export const generatePassword = () => {
  // Declare a digits variable
  // which stores all digits
  const digits = "0123456789";
  let OTP = "";
  const len = digits.length; //number of digits being chosen from
  for (let i = 0; i < 8; i++) {
    OTP += digits[Math.floor(Math.random() * len)];
  }
  return OTP;
};

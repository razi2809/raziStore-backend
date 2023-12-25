export const phoneNumberPattern =
  /^\+?(972|0)(\-)?0?(([23489]{1}\d{7})|[5]{1}\d{8})$/;
export const passwordPattern = new RegExp(
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*-])[A-Za-z\d!@#$%^&*-]{6,}$/
);

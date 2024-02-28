export const checkPassword = (value) => {
  return /^[A-Za-z0-9]{6,}$/.test(value) ? true : false;
};

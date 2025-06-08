export const validateEmail = (email) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

export const validatePasswordRules = (password) => ({
  hasMinLength: password.length >= 8,
  hasLetter: /[a-zA-Z]/.test(password),
  hasNumber: /[0-9]/.test(password),
  hasSpecial: /[^A-Za-z0-9]/.test(password),
  startsWithCapital: /^[A-Z]/.test(password),
});

export const getPasswordErrorMessages = (password) => {
  const rules = validatePasswordRules(password);
  const errors = [];

  if (!rules.hasMinLength) errors.push("At least 8 characters");
  if (!rules.hasLetter) errors.push("Contains a letter (a-z or A-Z)");
  if (!rules.hasNumber) errors.push("Contains a number (0-9)");
  if (!rules.hasSpecial) errors.push("Contains a special character");
  if (!rules.startsWithCapital) errors.push("Starts with a capital letter");

  return errors;
};

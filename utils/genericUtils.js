import { kilobyte, megaByte } from "../data/constant.js";

export const showErrorMessage = (input, message) => {
  const inputField = input.parentElement;

  const error = inputField.querySelector("small");

  error.style.color = "#f76565";
  error.style.marginTop = "7px";

  error.textContent = message;
};

export const returnFileSize = (number) => {
  if (number < kilobyte) {
    return `${number} bytes`;
  } else if (number >= kilobyte && number < megaByte) {
    return `${(number / kilobyte).toFixed(1)} KB`;
  } else if (number >= megaByte) {
    return `${(number / megaByte).toFixed(1)} MB`;
  }
};

import { ValidationError } from "yup";

interface Errors {
  [key: string]: string;
}

export default function getValidationErrors(err: ValidationError): Errors {
  const validationErrors: Errors = {};
  err.inner.forEach((error) => {
    validationErrors[error.path] = error.message;
  });

  return validationErrors;
}

export const removeMask = (value: string) => {
  if (value) return value.replace(/[^0-9,]/g, "").replace(",", ".");
};

export function sortArray(
  array: Array<any>,
  sortStatus: string,
  sortTypeNow: string
): any[] {
  if (array) {
    if (sortStatus === "up") {
      array.sort(function (a, b) {
        if (a[sortTypeNow] > b[sortTypeNow]) {
          return 1;
        }
        if (a[sortTypeNow] < b[sortTypeNow]) {
          return -1;
        }
        // a must be equal to b
        return 0;
      });
    } else if (sortStatus === "down") {
      array.sort(function (a, b) {
        if (a[sortTypeNow] < b[sortTypeNow]) {
          return 1;
        }
        if (a[sortTypeNow] > b[sortTypeNow]) {
          return -1;
        }
        // a must be equal to b
        return 0;
      });
    }
    return array;
  }
  return [];
}

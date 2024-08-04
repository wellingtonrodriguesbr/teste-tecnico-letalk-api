import { InvalidDateError } from "@/use-cases/errors/invalid-date";

export function convertToDate(date: string) {
  const cleanedDate = date.replace(/\D/g, "");

  if (cleanedDate.length !== 8) {
    throw new Error(
      "Data inválida. Certifique-se de que a data tenha 8 dígitos."
    );
  }

  const day = cleanedDate.slice(0, 2);
  const month = cleanedDate.slice(2, 4);
  const year = cleanedDate.slice(4, 8);

  const isoDateString = `${year}-${month}-${day}T00:00:00`;

  const dateObject = new Date(isoDateString);
  if (isNaN(dateObject.getTime())) {
    throw new InvalidDateError();
  }

  return dateObject;
}

// dateUtils.ts - Utilitaires pour le formatage des dates

export const formatDate = (isoDate: string | undefined | null): string => {
  if (!isoDate) return "pas de date";
  
  const date = new Date(isoDate);
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();

  const monthsFr = [
    "janvier", "février", "mars", "avril", "mai",
    "juin", "juillet", "août", "septembre", "octobre",
    "novembre", "décembre"
  ];

  const monthName = monthsFr[date.getMonth()];
  return `${day} ${monthName} ${year}`;
};

export const formatDateMessage = (isoDate: string | undefined | null): string => {
  if (!isoDate) return "erreur date";

  const date = new Date(isoDate);
  const now = new Date();
  const diffInMs = now.getTime() - date.getTime();
  const diffInDays = diffInMs / (1000 * 60 * 60 * 24);

  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");

  const daysFr = [
    "dimanche", "lundi", "mardi", "mercredi",
    "jeudi", "vendredi", "samedi"
  ];

  const monthsFr = [
    "janv.", "fev.", "mars", "avril", "mai",
    "juin", "juil.", "août", "sept.", "oct.",
    "nov.", "dec."
  ];

  if (diffInDays < 7) {
    const dayName = daysFr[date.getDay()];
    return `${dayName} ${hours}:${minutes}`;
  } else {
    const monthName = monthsFr[date.getMonth()];
    return `${day} ${monthName}, ${hours}:${minutes}`;
  }
};
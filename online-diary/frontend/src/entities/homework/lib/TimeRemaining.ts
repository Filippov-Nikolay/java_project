
export const formatDate = (dateString?: string | Date): string => {
  if (!dateString) return "—";
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return "—";
  
  return date.toLocaleDateString("uk-UA", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
};

export const getTimeRemaining = (deadlineStr?: string | Date) => {
  if (!deadlineStr) return { text: null, isUrgent: false };

  const deadline = new Date(deadlineStr);
  const now = new Date();
  const diffTime = deadline.getTime() - now.getTime();

  if (diffTime <= 0) return { text: "Термін вийшов", isUrgent: true };

  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  let text = "";
  if (diffDays === 1) {
    text = "Залишився 1 день";
  } else if (diffDays > 1 && diffDays < 5) {
    text = `Залишилось ${diffDays} дні`;
  } else {
    text = `Залишилось ${diffDays} днів`;
  }

  return { 
    text, 
    isUrgent: diffDays <= 2 
  };
};
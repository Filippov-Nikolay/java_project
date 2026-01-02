export const ROW_HEIGHT = 80;

export const getLessonPosition = (startTime: string, endTime: string) => {
  const [startH, startM] = startTime.split(':').map(Number);
  const [endH, endM] = endTime.split(':').map(Number);
  const durationMinutes = (endH * 60 + endM) - (startH * 60 + startM);
  
  return {
    top: (startM / 60) * ROW_HEIGHT,
    height: (durationMinutes / 60) * ROW_HEIGHT
  };
};
export const LESSON_TIMES = {
    1: { start: "08:50", end: "10:10" },
    2: { start: "10:20", end: "11:40" },
    3: { start: "12:00", end: "13:20" },
    4: { start: "13:30", end: "14:50" },
    5: { start: "15:00", end: "16:20" },
    6: { start: "16:30", end: "17:50" },
} as const; // as const робить об'єкт незмінним

export const DAYS_OF_WEEK = {
    1: "Понеділок",
    2: "Вівторок",
    3: "Середа",
    4: "Четвер",
    5: "П'ятниця",
} as const;